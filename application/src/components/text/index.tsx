import React, { useMemo } from 'react';

/* Presentation Things */
import { Platform, StyleSheet, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { COLOR, FONT } from '../../constants';

type TextColors = keyof typeof COLOR;

type TextTypes = 'normal' | 'bold';

type TextSize = keyof typeof FONT;

export type TextProps = RNTextProps & {
  color?: TextColors;
  type?: TextTypes;
  size?: TextSize;
};

export const Text = ({ color = 'black', type = 'normal', size = 'M', ...props }: TextProps) => {
  const style = useMemo(() => [sizes[size], types[type], colors[color], props.style], [props.style, color, type, size]);

  return <RNText style={style}>{props.children}</RNText>;
};

const types = StyleSheet.create<Record<TextTypes, TextStyle>>({
  normal: {
    lineHeight: Platform.select({ android: 24, default: 0 }),
    fontWeight: 'normal',
  },
  bold: {
    fontWeight: 'bold',
  },
});

const colors = StyleSheet.create<Record<TextColors, TextStyle>>(
  Object.keys(COLOR).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: { color: COLOR[curr as keyof typeof COLOR] },
    }),
    {} as Record<TextColors, TextStyle>,
  ),
);

const sizes = StyleSheet.create<Record<TextSize, TextStyle>>(
  Object.keys(FONT).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: { fontSize: FONT[curr as keyof typeof FONT] },
    }),
    {} as Record<TextSize, TextStyle>,
  ),
);
