import * as React from 'react';
import Svg, { SvgProps, G, Mask, Path } from 'react-native-svg';

export const EtherIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 20 31" width={20} height={31} fill="none" {...props}>
    <G opacity={0.6}>
      <Mask
        id="a"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={11}
        width={20}
        height={11}
      >
        <Path d="M0 11.466h19.01v9.94H0v-9.94Z" fill="#fff" />
      </Mask>
      <G mask="url(#a)">
        <Path d="M9.507 11.466 0 15.79l9.507 5.616 9.503-5.616-9.503-4.324Z" fill="#010101" />
      </G>
    </G>
    <G opacity={0.45}>
      <Mask
        id="b"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={10}
        height={22}
      >
        <Path d="M0 .016h9.507v21.39H0V.016Z" fill="#fff" />
      </Mask>
      <G mask="url(#b)">
        <Path d="m0 15.79 9.507 5.616V.016L0 15.79Z" fill="#010101" />
      </G>
    </G>
    <G opacity={0.8}>
      <Mask
        id="c"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={9}
        y={0}
        width={11}
        height={22}
      >
        <Path d="M9.507.016h9.507v21.39H9.507V.016Z" fill="#fff" />
      </Mask>
      <G mask="url(#c)">
        <Path d="M9.507.016v21.39l9.503-5.616L9.507.016Z" fill="#010101" />
      </G>
    </G>
    <G opacity={0.45}>
      <Mask
        id="d"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={17}
        width={10}
        height={14}
      >
        <Path d="M0 17.59h9.507v13.394H0V17.59Z" fill="#fff" />
      </Mask>
      <G mask="url(#d)">
        <Path d="m0 17.59 9.507 13.394v-7.777L0 17.591Z" fill="#010101" />
      </G>
    </G>
    <G opacity={0.8}>
      <Mask
        id="e"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={9}
        y={17}
        width={11}
        height={14}
      >
        <Path d="M9.507 17.59h9.51v13.394h-9.51V17.59Z" fill="#fff" />
      </Mask>
      <G mask="url(#e)">
        <Path d="M9.507 23.207v7.777l9.51-13.393-9.51 5.616Z" fill="#010101" />
      </G>
    </G>
  </Svg>
);
