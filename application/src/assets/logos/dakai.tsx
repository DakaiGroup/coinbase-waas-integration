import * as React from 'react';
import Svg, { SvgProps, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export const DakaiLogo = (props: SvgProps) => (
  <Svg viewBox="0 0 78 20" width={78} height={20} fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m7.994 6.141 2.003-3.47 7.46 12.923h-4.006L7.994 6.141Z"
      fill="url(#a)"
    />
    <Path fillRule="evenodd" clipRule="evenodd" d="m4.542 12.124-2.003 3.47h14.922l-2.003-3.47H4.542Z" fill="url(#b)" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m7.995 6.144-5.456 9.45h4.006l3.453-5.98-2.003-3.47Zm4.007 0 .001-.003L10 2.671l-.002.003 2.004 3.47Z"
      fill="url(#c)"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.018 13.744a.209.209 0 0 1-.206-.205v-7.14c0-.108.092-.205.206-.205h2.72c2.215 0 4.028 1.693 4.028 3.764 0 2.092-1.813 3.786-4.028 3.786h-2.72Zm1.274-6.245v4.929H27.6c1.492 0 2.582-1.057 2.582-2.47 0-1.402-1.09-2.46-2.581-2.46h-1.309Zm11.196 6.25h-.978c-.17 0-.26-.138-.192-.276l3.498-7.162a.202.202 0 0 1 .191-.117h.113c.112 0 .157.053.19.117l3.465 7.162c.067.138-.023.276-.192.276h-.978c-.169 0-.248-.063-.326-.212l-.552-1.15h-3.362l-.551 1.15a.338.338 0 0 1-.326.212Zm2.53-4.884-1.102 2.341h2.26l-1.124-2.341h-.034Zm8.554 4.879c-.161 0-.276-.119-.276-.259V6.452c0-.14.115-.258.276-.258h1.012c.149 0 .275.118.275.258v2.913L52.758 6.3a.28.28 0 0 1 .218-.107h1.15c.219 0 .334.226.184.388l-3 3.171 3.219 3.613c.114.14.023.378-.207.378h-1.254c-.115 0-.184-.043-.207-.076l-3-3.473v3.29c0 .14-.127.259-.276.259h-1.012Zm11.688-.01h-.977c-.168 0-.258-.138-.19-.276l3.49-7.148a.202.202 0 0 1 .19-.116h.112c.112 0 .157.053.19.116l3.457 7.148c.067.138-.023.276-.19.276h-.977c-.168 0-.247-.064-.325-.213l-.55-1.147h-3.355l-.55 1.147a.338.338 0 0 1-.325.213Zm2.524-4.875-1.1 2.337h2.256l-1.122-2.337h-.034Zm8.507 4.875c-.117 0-.221-.097-.221-.205V6.4c0-.108.104-.205.221-.205h1.082c.116 0 .22.097.22.204v7.131c0 .108-.104.205-.22.205h-1.082Z"
      fill="#000"
    />
    <Defs>
      <LinearGradient id="a" x1={10} y1={2.671} x2={17.461} y2={15.66} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#656970" />
        <Stop offset={1} stopColor="#212529" />
      </LinearGradient>
      <LinearGradient id="b" x1={2.539} y1={15.601} x2={17.461} y2={15.601} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#212529" />
        <Stop offset={1} stopColor="#656970" />
      </LinearGradient>
      <LinearGradient id="c" x1={9.941} y1={2.671} x2={2.539} y2={15.601} gradientUnits="userSpaceOnUse">
        <Stop stopColor="#212529" />
        <Stop offset={1} stopColor="#656970" />
      </LinearGradient>
    </Defs>
  </Svg>
);
