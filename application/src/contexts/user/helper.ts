import type { AccountAddress, User } from '../../typings';
import type { IUserResponseDTO } from '../../typings/DTOs';
import { getRawWalletAddress } from '../../constants';

export const generateAccountAddress = (rawAddress: string, key: string): AccountAddress => {
  return {
    rawAddress,
    address: getRawWalletAddress(rawAddress),
    key,
  };
};

export const transformIUserResponseDTO = (p: IUserResponseDTO, token: string): User => {
  return {
    addresses: p.data.user.addresses?.map(x => generateAccountAddress(x.address, x.key)) ?? undefined,
    wallet: p.data.user.wallet ?? undefined,
    name: p.data.user.username,
    token,
  };
};
