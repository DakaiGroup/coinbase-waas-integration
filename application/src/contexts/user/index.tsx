import React, { createContext, useCallback, useMemo, useState } from 'react';

/* Types */
import type { User } from '../../typings';
import type {
  ICreateAddressResponseDTO,
  IUserRegisterResponseDTO,
  ICreateWalletResponseDTO,
  IUserRegisterRequestDTO,
  IUserLoginResponseDTO,
  IUserLoginRequestDTO,
  IUserResponseDTO,
} from '../../typings/DTOs';

/* Data Things */
import {
  pollForPendingSeeds,
  processPendingSeed,
  waitPendingAddress,
  initWalletService,
  initKeyService,
  registerDevice,
  getAddress,
} from '@WaaS-Private-Preview-v1/react-native-waas-sdk';
import { generateAccountAddress, transformIUserResponseDTO } from './helper';
import { API_KEY_NAME, API_PRIVATE_KEY } from '@env';
import { api } from '../../utils';

export interface IUserContext {
  onCreateAddress(): Promise<string>;
  onCreateWallet(): Promise<'ok' | string>;
  onRegistration(username: string, password: string): Promise<'ok' | string>;
  onLogin(username: string, password: string): Promise<'ok' | string>;
  user: User | null;
}

const UserContext = createContext<IUserContext>({
  onCreateAddress: () => Promise.reject(''),
  onCreateWallet: () => Promise.reject(''),
  onRegistration: () => Promise.reject(''),
  onLogin: () => Promise.reject(''),
  user: null,
});

const UserProvider = (props: React.PropsWithChildren<{}>) => {
  /* States */
  const [user, setUser] = useState<User | null>(null);

  const onCreateAddress = useCallback(async (): Promise<'ok' | string> => {
    try {
      if (user) {
        const { opName } = await api<ICreateAddressResponseDTO, any>({
          method: 'POST',
          token: user.token,
          path: 'protected/waas/generate-address',
        });

        await initKeyService(API_KEY_NAME, API_PRIVATE_KEY, true);
        await initWalletService(API_KEY_NAME, API_PRIVATE_KEY);

        if (!user.addresses?.length) {
          const pendingSeeds = await pollForPendingSeeds(user.deviceGroup);
          await Promise.all(pendingSeeds.map(x => processPendingSeed(x)));
        }

        const createdAddress = await waitPendingAddress(opName);
        const retrievedAddress = await getAddress(createdAddress.Name);

        const newAddress = generateAccountAddress(retrievedAddress.Name);

        setUser(prev => ({
          ...prev!,
          addresses: [newAddress, ...(prev!.addresses || [])],
        }));

        return Promise.resolve(newAddress.address);
      } else {
        throw new Error('Please login first');
      }
    } catch (error) {
      console.error(error);
      return Promise.reject(String(error?.message || error));
    }
  }, [user]);

  const onCreateWallet = useCallback(async (): Promise<'ok' | string> => {
    try {
      if (user) {
        const { opName } = await api<ICreateWalletResponseDTO, any>({
          method: 'POST',
          token: user.token,
          path: 'protected/waas/create-wallet-and-address',
        });

        await initKeyService(API_KEY_NAME, API_PRIVATE_KEY, true);
        await initWalletService(API_KEY_NAME, API_PRIVATE_KEY);

        const pendingSeeds = await pollForPendingSeeds(user.deviceGroup);

        await Promise.all(pendingSeeds.map(x => processPendingSeed(x)));

        const createdAddress = await waitPendingAddress(opName);
        const retrievedAddress = await getAddress(createdAddress.Name);

        setUser(prev => ({
          ...prev!,
          addresses: [generateAccountAddress(retrievedAddress.Name)],
        }));

        return Promise.resolve('ok');
      } else {
        throw new Error('Please login first');
      }
    } catch (error) {
      console.error(error);
      return Promise.reject(String(error?.message || error));
    }
  }, [user]);

  const onRegistration = useCallback(async (username: string, password: string): Promise<'ok' | string> => {
    try {
      await initKeyService(API_KEY_NAME, API_PRIVATE_KEY, true);
      const device = await registerDevice();
      console.log(device.Name); //Tip: save this for development

      await api<IUserRegisterResponseDTO, IUserRegisterRequestDTO>({
        method: 'POST',
        path: 'user/register',
        body: { username, password, deviceId: device.Name },
      });

      return Promise.resolve('ok');
    } catch (error) {
      console.error(error);
      return Promise.reject(String(error?.message || error));
    }
  }, []);

  const onLogin = useCallback(async (username: string, password: string): Promise<'ok' | string> => {
    try {
      const { token } = await api<IUserLoginResponseDTO, IUserLoginRequestDTO>({
        method: 'POST',
        path: 'user/login',
        body: { username, password },
      });

      const response = await api<IUserResponseDTO, any>({
        method: 'GET',
        path: 'protected/user/current',
        token,
      });

      setUser(transformIUserResponseDTO(response, token));

      return Promise.resolve('ok');
    } catch (error) {
      console.error(error);
      return Promise.reject(String(error?.message || error));
    }
  }, []);

  /* Variables */
  const value = useMemo(
    () => ({ user, onLogin, onRegistration, onCreateWallet, onCreateAddress }),
    [user, onLogin, onRegistration, onCreateWallet, onCreateAddress],
  );

  return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
