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
import { computeMPCOperation, getRegistrationData, bootstrapDevice, initMPCSdk } from '@coinbase/waas-sdk-react-native';
import { generateAccountAddress, transformIUserResponseDTO } from './helper';
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
        // Initiate address creation on our server
        const { name } = await api<ICreateAddressResponseDTO, any>({
          method: 'POST',
          token: user.token,
          path: 'protected/waas/generate-address',
        });

        const newAddress = generateAccountAddress(name);

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

  const onLongPollUser = useCallback(
    async (attemptsTillNow: number = 0): Promise<IUserResponseDTO | string> => {
      try {
        if (attemptsTillNow === 20) {
          throw new Error('Too many attempts for getting user');
        }

        if (user && user.token) {
          const response = await api<IUserResponseDTO, any>({
            method: 'GET',
            path: 'protected/user/current',
            token: user.token,
            sleep: attemptsTillNow * 1000,
          });

          if (response.data.user.wallet) {
            return Promise.resolve(response);
          } else {
            return await onLongPollUser(attemptsTillNow + 1);
          }
        } else {
          throw new Error('Please login first');
        }
      } catch (error) {
        console.error(error);
        return Promise.reject(String(error?.message || error));
      }
    },
    [user],
  );

  const onCreateWallet = useCallback(async (): Promise<'ok' | string> => {
    try {
      if (user) {
        // Init WaaS services
        await initMPCSdk(true);

        // Initiate wallet creation on our server
        const { mpcData } = await api<ICreateWalletResponseDTO, any>({
          method: 'POST',
          token: user.token,
          path: 'protected/waas/create-wallet',
        });

        await computeMPCOperation(mpcData);

        // Poll the current user for 2 mins
        const response = await onLongPollUser();
        setUser(transformIUserResponseDTO(response, user.token));

        // Create address for our freshly created wallet
        await onCreateAddress();

        return Promise.resolve('ok');
      } else {
        throw new Error('Please login first');
      }
    } catch (error) {
      console.error(error);
      return Promise.reject(String(error?.message || error));
    }
  }, [user, onCreateAddress]);

  const onRegistration = useCallback(async (username: string, password: string): Promise<'ok' | string> => {
    try {
      await initMPCSdk(true);
      await bootstrapDevice(password);

      const registrationData = await getRegistrationData();

      await api<IUserRegisterResponseDTO, IUserRegisterRequestDTO>({
        method: 'POST',
        path: 'user/register',
        body: { username, password, registrationData },
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
