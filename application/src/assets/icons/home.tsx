import { COLOR } from '../../constants';
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export const HomeIcon = ({ stroke = COLOR.primary, ...props }: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
    <Path
      d="m4.286 9.429 7.714-6 7.714 6v9.428A1.714 1.714 0 0 1 18 20.571H6a1.714 1.714 0 0 1-1.714-1.714V9.43Z"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.429 20.571V12h5.142v8.571"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
