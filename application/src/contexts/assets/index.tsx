import '@ethersproject/shims';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* Types */
import type { IBroadcastTransactionResponseDTO } from '../../typings/DTOs';
import type { AccountAddress, TokenOrCoin } from '../../typings';
import { computeMPCOperation, Transaction } from '@coinbase/waas-sdk-react-native';

/* Data Things */
import {
  pollForPendingSignatures,
  createSignatureFromTx,
  getSignedTransaction,
  initMPCWalletService,
  waitPendingSignature,
  initMPCKeyService,
  getAddress,
  initMPCSdk,
} from '@coinbase/waas-sdk-react-native';
import { API_KEY_NAME, API_PRIVATE_KEY, RPC_URL, CHAIN_ID } from '@env';
import { ABI, TOKEN_ADDRESSES } from '../../constants';
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
          await initMPCKeyService(API_KEY_NAME, API_PRIVATE_KEY);
          await initMPCWalletService(API_KEY_NAME, API_PRIVATE_KEY);

          const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

          console.log({ provider }); //TODO remove debug log

          /* Get basic informations for transaction initiation */
          const txCount = await provider.getTransactionCount(from.address);
          const gasInfo = await provider.getFeeData();

          console.log({ txCount, gasInfo }); //TODO remove debug log

          const retrievedAddress = await getAddress(from.rawAddress);

          console.log({ retrievedAddress }); //TODO remove debug log
          const keyName = retrievedAddress.MPCKeys[0];

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

          /* Transact */
          const resp1 = await createSignatureFromTx(keyName, transaction);

          console.log({ resp1 }); //TODO remove debug log
          console.log({ user }); //TODO remove debug log

          const pendingSignatures = await pollForPendingSignatures(user.deviceGroup);

          console.log({ pendingSignatures }); //TODO remove debug log

          const resp2 = await computeMPCOperation(pendingSignatures[0]?.MPCData);

          console.log([resp2]); //TODO remove debug log

          const signatureResult = await waitPendingSignature(pendingSignatures[0]?.Operation);

          console.log({ signatureResult }); //TODO remove debug log

          const signedTransaction = await getSignedTransaction(transaction, signatureResult);

          console.log({ signedTransaction }); //TODO remove debug log

          const response = await api<IBroadcastTransactionResponseDTO, any>({
            path: 'protected/waas/broadcast-transaction',
            method: 'POST',
            token: user.token,
            body: {
              rawTransaction: signedTransaction.RawTransaction,
            },
          });

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
            await initMPCKeyService(API_KEY_NAME, API_PRIVATE_KEY);
            await initMPCWalletService(API_KEY_NAME, API_PRIVATE_KEY);

            const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

            /* Get basic informations for transaction initiation */
            const txCount = await provider.getTransactionCount(from.address);
            const gasInfo = await provider.getFeeData();
            const retrievedAddress = await getAddress(from.rawAddress);
            const keyName = retrievedAddress.MPCKeys[0];

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

            /* Prepare the transaction */
            const transaction: Transaction = {
              ChainID: CHAIN_ID,
              Nonce: txCount,
              MaxPriorityFeePerGas: gasInfo.maxPriorityFeePerGas!.toHexString(),
              MaxFeePerGas: gasInfo.maxFeePerGas!.toHexString(),
              Gas: estimation.toNumber(),
              To: token.address,
              Value: '0x0',
              Data: data.substring(2),
            };

            /* Transact */
            await createSignatureFromTx(keyName, transaction);

            const pendingSignatures = await pollForPendingSignatures(user.deviceGroup);

            await computeMPCOperation(pendingSignatures[0]?.MPCData);

            const signatureResult = await waitPendingSignature(pendingSignatures[0]?.Operation);

            const signedTransaction = await getSignedTransaction(transaction, signatureResult);

            const response = await api<IBroadcastTransactionResponseDTO, any>({
              path: 'protected/waas/broadcast-transaction',
              method: 'POST',
              token: user.token,
              body: {
                rawTransaction: signedTransaction.RawTransaction,
              },
            });
            return Promise.resolve(response.txHash);
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
      await initMPCKeyService(API_KEY_NAME, API_PRIVATE_KEY);
      await initMPCWalletService(API_KEY_NAME, API_PRIVATE_KEY);

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
