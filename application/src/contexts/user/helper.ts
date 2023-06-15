import type { AccountAddress, User } from '../../typings';
import type { IUserResponseDTO } from '../../typings/DTOs';
import { getRawWalletAddress } from '../../constants';

export const generateAccountAddress = (rawAddress: string): AccountAddress => {
  return {
    rawAddress: rawAddress,
    address: getRawWalletAddress(rawAddress),
  };
};

export const transformIUserResponseDTO = (p: IUserResponseDTO, token: string): User => {
  return {
    addresses: p.data.user.addresses?.map(x => generateAccountAddress(x.address)) ?? undefined,
    wallet: p.data.user.wallet ?? undefined,
    name: p.data.user.username,
    token,
  };
};
