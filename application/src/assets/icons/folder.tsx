import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export const FolderIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 88 76" width={88} height={76} fill="none" {...props}>
    <Path
      d="M12 0C5.382 0 0 5.382 0 12v52c0 6.618 5.382 12 12 12h64c6.618 0 12-5.382 12-12V20c0-6.618-5.382-12-12-12H38.207a7.999 7.999 0 0 1-4.992-1.754l-3.426-2.738A16.066 16.066 0 0 0 19.793 0H12Zm0 8h7.793c1.81 0 3.584.622 4.996 1.754l3.422 2.738A16.066 16.066 0 0 0 38.207 16H76c2.206 0 4 1.794 4 4v2H8V12c0-2.206 1.794-4 4-4ZM8 30h72v34c0 2.206-1.794 4-4 4H12c-2.206 0-4-1.794-4-4V30Z"
      fill="#1652F0"
    />
  </Svg>
);
