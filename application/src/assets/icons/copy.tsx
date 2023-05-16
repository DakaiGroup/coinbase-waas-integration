import { ICON } from '../../constants';
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export const CopyIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={ICON.M} height={ICON.M} fill="none" {...props}>
    <Path
      d="M18.857 9.429h-7.714c-.947 0-1.714.767-1.714 1.714v7.714c0 .947.767 1.714 1.714 1.714h7.714c.947 0 1.714-.767 1.714-1.714v-7.714c0-.947-.767-1.714-1.714-1.714Z"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 14.571h-.857a1.714 1.714 0 0 1-1.714-1.714V5.143a1.714 1.714 0 0 1 1.714-1.714h7.714a1.714 1.714 0 0 1 1.714 1.714V6"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
