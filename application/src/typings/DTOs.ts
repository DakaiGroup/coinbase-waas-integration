export interface IUserRegisterRequestDTO {
  username: string;
  password: string;
  deviceId: string;
}

export interface IUserRegisterResponseDTO {
  message: string;
  data: {
    data: {
      InsertedID: string;
    };
  };
}

export interface IUserLoginRequestDTO {
  username: string;
  password: string;
}

export interface IUserLoginResponseDTO {
  token: string;
}

export interface IUserResponseDTO {
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      pool: {
        id: string;
        name: string;
        displayName: string;
      };
      deviceId: string;
      deviceGroup: string;
      addresses?: { address: string }[];
      wallet?: string;
    };
  };
}

export interface ICreateWalletResponseDTO {
  opName: string;
  done: string;
}

export interface ICreateAddressResponseDTO {
  opName: string;
  done: string;
}

export interface IBroadcastTransactionResponseDTO {
  txHash: string;
}
