export interface IUserRegisterRequestDTO {
  username: string;
  password: string;
  registrationData: String;
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
      addresses?: { address: string; key: string }[];
      wallet?: string;
    };
  };
}

export interface ICreateAddressResponseDTO {
  name: string;
}

export interface IBroadcastTransactionResponseDTO {
  txHash: string;
}

export interface ISaveWalletRequestDTO {
  wallet: string;
}

export interface ISaveWalletResponseDTO {
  saved: boolean;
}

export interface IPendingMpcOperationDTO {
  name: string;
  mpc_data: string;
}

export interface ICreateTransactionDTO {
  signatureOp: string;
  mpc_data: string;
}
