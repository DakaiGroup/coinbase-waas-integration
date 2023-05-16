import { COLOR, ICON } from '../../constants';
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export const NavigationIcon = ({ fill = COLOR.white, ...props }: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={ICON.M} height={ICON.M} fill="none" {...props}>
    <Path
      d="m3.429 11.143 16.285-7.714L12 19.714l-1.714-6.857-6.857-1.714Z"
      fill={fill}
      stroke={fill}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
