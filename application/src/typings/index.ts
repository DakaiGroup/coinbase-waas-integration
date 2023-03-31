import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  BottomTabStack: NavigatorScreenParams<BottomTabParamList>;
  TransactionDetails: { hash: string };
  Registration: undefined;
  Welcome: undefined;
  Login: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Transfer: undefined;
};

export interface IAPIRejection {
  message: string;
  code: number;
  extra?: Object;
}

export interface IAPIRequest<Body> {
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: Body;
  token?: string;
}

export type User = {
  addresses?: Array<AccountAddress>;
  wallet?: string;
  deviceGroup?: string;
  token: string;
  name: string;
};

export type TokenOrCoin = {
  symbol: string;
  name: string;
  amount: string;
  decimals: number;
  address: string | null;
};

export type AccountAddress = {
  rawAddress: string;
  address: string;
};
