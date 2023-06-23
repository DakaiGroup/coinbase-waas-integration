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
  mpc_keys: string[];
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

export interface TransactionRequestDTO {
  sigOpName?: string;
  key: string;
  from: string;
  // The chain ID of the transaction as a "0x"-prefixed hex string.
  chainID: string;
  // The nonce of the transaction.
  nonce: number;
  // The EIP-1559 maximum priority fee per gas as a "0x"-prefixed hex string.
  maxPriorityFeePerGas: string;
  // The EIP-1559 maximum fee per gas as a "0x"-prefixed hex string.
  maxFeePerGas: string;
  // The maximum amount of gas to use on the transaction.
  gas: number;
  // The checksummed address to which the transaction is addressed, as a "0x"-prefixed hex string.
  // Note: This is NOT a WaaS Address resource of the form
  // `networks/{networkID}/addresses/{addressID}.
  to: string;
  // The native value of the transaction as a "0x"-prefixed hex string.
  value: string;
  // The hex-encoded data for the transaction.
  data: string;
}
