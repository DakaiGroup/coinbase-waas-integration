import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export const MessageIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 128 128" width={128} height={128} fill="none" {...props}>
    <Path d="m74 32 8 8-8 8" stroke="#1652F0" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M46 52v-4a8 8 0 0 1 8-8h28M54 76l-8-8 8-8"
      stroke="#1652F0"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M82 56v4a8 8 0 0 1-8 8H46" stroke="#1652F0" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M105.143 77.714A9.142 9.142 0 0 1 96 86.857H41.143l-18.286 18.286V32A9.143 9.143 0 0 1 32 22.857h64A9.144 9.144 0 0 1 105.143 32v45.714Z"
      stroke="#1652F0"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
