import type { Theme } from '@react-navigation/native';
import { Dimensions, PixelRatio } from 'react-native';

const { width } = Dimensions.get('screen');

export const wp = (widthPercent: number) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};

export const getRawWalletAddress = (address: string) => {
  //address = "networks/ethereum-goerli/addresses/0x15fD936bd5646063Ff01954cfb7109b243E0653B"
  return address.split('/')?.[3] ?? address;
};

export const ICON = {
  XS: wp(4),
  S: wp(4.5),
  M: wp(5),
  L: wp(6),
};

export const COLOR = {
  primary: '#1652F0',
  secondary: '#5C5C5C',
  background: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  red: '#F46363',
  lightGrey: '#DFDFDF',
};

export const SPACING = {
  XXS: wp(0.7),
  XS: wp(1),
  S: wp(1.5),
  M: wp(2.5),
  L: wp(5),
  XL: wp(8),
  XXL: wp(14),
  XXXL: wp(18),
  XXXXL: wp(22),
};

export const FONT = {
  XS: wp(2.5),
  S: wp(3.5),
  M: wp(4),
  L: wp(5),
  XL: wp(7),
};

export const THEME: Theme = {
  colors: {
    background: COLOR.background,
    border: COLOR.secondary,
    card: COLOR.background,
    notification: COLOR.red,
    primary: COLOR.primary,
    text: COLOR.black,
  },
  dark: false,
};

export const ABI = [
  'function transfer(address to, uint256 amount)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

export const TOKEN_ADDRESSES = ['0x90e74012256D74A12Bf64bdcc307522DF664440a'];
