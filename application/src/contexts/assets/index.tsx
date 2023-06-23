import '@ethersproject/shims';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* Types */
import type {
  IBroadcastTransactionResponseDTO,
  ICreateTransactionDTO,
  IPendingMpcOperationDTO,
  TransactionRequestDTO,
} from '../../typings/DTOs';
import type { AccountAddress, TokenOrCoin } from '../../typings';
import type { Transaction } from '@coinbase/waas-sdk-react-native';

/* Data Things */
import {
  createSignatureFromTx,
  getSignedTransaction,
  waitPendingSignature,
  computeMPCOperation,
  getAddress,
  initMPCSdk,
} from '@coinbase/waas-sdk-react-native';
import { ABI, TOKEN_ADDRESSES } from '../../constants';
import { RPC_URL, CHAIN_ID } from '@env';
import { UserContext } from '../user';
import { ethers } from 'ethers';
import { api } from '../../utils';

interface IAssetsContext {
  onSendNativeToken(amount: string, from: AccountAddress, to: string): Promise<string>;
  onSendERC20Token(token: TokenOrCoin, amount: string, from: AccountAddress, to: string): Promise<string>;
  onGetAssets(address: string): Promise<TokenOrCoin[] | string>;
  assets: Record<string, TokenOrCoin[]>;
}

const AssetsContext = createContext<IAssetsContext>({
  onSendNativeToken: () => Promise.reject(''),
  onSendERC20Token: () => Promise.reject(''),
  onGetAssets: () => Promise.reject(''),
  assets: {},
});

const AssetsProvider = (props: React.PropsWithChildren<{}>) => {
  /* Context */
  const { user } = useContext(UserContext);

  /* States */
  const [assets, setAssets] = useState<Record<string, TokenOrCoin[]>>({});

  const onSendNativeToken = useCallback(
    async (amount: string, from: AccountAddress, to: string) => {
      try {
        if (user) {
          await initMPCSdk(true);

          const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

          /* Get basic informations for transaction initiation */
          const txCount = await provider.getTransactionCount(from.address);
          const gasInfo = await provider.getFeeData();

          /* Prepare the transaction */
          const transaction: Transaction = {
            ChainID: CHAIN_ID,
            Nonce: txCount,
            MaxPriorityFeePerGas: gasInfo.maxPriorityFeePerGas!.toHexString(),
            MaxFeePerGas: gasInfo.maxFeePerGas!.toHexString(),
            Gas: 21000,
            To: to,
            Value: ethers.utils.parseEther(amount).toHexString(),
            Data: '',
          };

          console.log(1);
          /* Transact */
          await createSignatureFromTx(from.key, transaction);

          console.log(2);

          const pendingSignatures = await api<IPendingMpcOperationDTO, any>({
            path: 'protected/waas/poll-mpc-operation',
            method: 'GET',
            token: user.token,
          });

          console.log(3);

          await computeMPCOperation(pendingSignatures.mpc_data);

          console.log(4);

          const signatureResult = await waitPendingSignature(pendingSignatures.name);

          console.log(5);

          const signedTransaction = await getSignedTransaction(transaction, signatureResult);

          console.log(6);

          const response = await api<IBroadcastTransactionResponseDTO, any>({
            path: 'protected/waas/broadcast-transaction',
            method: 'POST',
            token: user.token,
            body: {
              rawTransaction: signedTransaction.RawTransaction,
            },
          });

          console.log(7);

          return Promise.resolve(response.txHash);
        } else {
          throw new Error('Please login first!');
        }
      } catch (error) {
        console.error(error);
        return Promise.reject(String(error.message || error));
      }
    },
    [user],
  );

  const onSendERC20Token = useCallback(
    async (token: TokenOrCoin, amount: string, from: AccountAddress, to: string) => {
      try {
        if (user) {
          if (token.address) {
            await initMPCSdk(true);

            const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

            /* Get basic informations for transaction initiation */
            console.log(from.rawAddress);
            const txCount = await provider.getTransactionCount(from.address);
            const gasInfo = await provider.getFeeData();

            /* Preapate the contract */
            const tokenContract = new ethers.Contract(token.address, ABI, provider);

            /* Calculate the transaction fee */
            const estimation = await tokenContract.estimateGas.transfer(
              to,
              ethers.utils.parseUnits(amount, token.decimals),
              {
                from: from.address,
              },
            );

            /* Encode the parameters */
            const data = new ethers.utils.Interface(ABI).encodeFunctionData('transfer', [
              to,
              ethers.utils.parseUnits(amount, token.decimals),
            ]);

            /* Transact */

            const transaction: TransactionRequestDTO = {
              chainID: CHAIN_ID,
              nonce: txCount,
              maxPriorityFeePerGas: gasInfo.maxPriorityFeePerGas!.toHexString(),
              maxFeePerGas: gasInfo.maxFeePerGas!.toHexString(),
              gas: estimation.toNumber(),
              from: from.address,
              key: from.key,
              to: token.address,
              value: '0x0',
              data: data.substring(2),
            };

            // TODO use one transaction object for this with optional key and singatureOP field
            const { mpc_data, signatureOp } = await api<ICreateTransactionDTO, any>({
              path: 'protected/waas/create-transaction',
              method: 'POST',
              token: user.token,
              body: transaction,
            });

            await computeMPCOperation(mpc_data);

            const { txHash } = await api<any, any>({
              path: 'protected/waas/wait-signature-and-broadcast',
              method: 'POST',
              token: user.token,
              body: {
                sigOpname: signatureOp,
                ...transaction,
              },
            });
            return Promise.resolve(txHash);
          } else {
            throw new Error('You can not send native tokens with this method');
          }
        } else {
          throw new Error('Please login first!');
        }
      } catch (error) {
        console.error(error);
        return Promise.reject(String(error.message || error));
      }
    },
    [user],
  );

  const onGetAssets = useCallback(async (address: string) => {
    try {
      await initMPCSdk(true);

      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

      /* Get the information about assets */
      let returnable: TokenOrCoin[] = [];

      for (let tokenAddress of TOKEN_ADDRESSES) {
        const contract = new ethers.Contract(tokenAddress, ABI, provider);
        const tokenBalance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        const symbol = await contract.symbol();
        const name = await contract.name();
        returnable.push({
          amount: ethers.utils.formatUnits(tokenBalance, decimals).padEnd(6),
          address: tokenAddress,
          decimals,
          symbol,
          name,
        });
      }

      /* Get the native token balance */
      const nativeTokenBalance = await provider.getBalance(address);

      returnable.unshift({
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        address: null,
        amount: ethers.utils.formatUnits(nativeTokenBalance, 18),
      });

      setAssets(prev => ({ ...prev, [address]: returnable }));

      return Promise.resolve(returnable);
    } catch (error) {
      console.error(error);
      return Promise.reject(String(error.message || error));
    }
  }, []);

  const value = useMemo(
    () => ({ assets, onSendERC20Token, onSendNativeToken, onGetAssets }),
    [assets, onSendERC20Token, onSendNativeToken, onGetAssets],
  );

  return <AssetsContext.Provider value={value}>{props.children}</AssetsContext.Provider>;
};

export { AssetsContext, AssetsProvider };
