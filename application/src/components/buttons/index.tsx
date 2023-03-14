import React, { useCallback, useMemo } from 'react';

/* Data Things */
import { useNavigation } from '@react-navigation/native';

/* Presentation Things */
import {
  BorderlessButtonProps,
  BorderlessButton,
  TouchableOpacity,
  RectButtonProps,
  RectButton,
} from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { Text, TextProps } from '../text';

/* Styles */
import { COLOR, ICON, SPACING } from '../../constants';

type ButtonTypes = 'filled' | 'outlined';

type ButtonProps = RectButtonProps & {
  type?: ButtonTypes;
  leadingIcon?: JSX.Element;
  loading?: boolean;
  title?: string;
};

type LinkTo = {
  to: string;
  params?: Object;
};

type LinkPress = {
  onPress(): void;
};

type LinkProps = TextProps & (LinkTo | LinkPress);

type IconButtonProps = BorderlessButtonProps & {
  icon: JSX.Element;
};

export const Button = ({ title, type = 'filled', leadingIcon, loading, ...props }: ButtonProps) => {
  /* Variables */
  const style = useMemo(() => [styles.container, types[type], props.style], [props.style, type]);

  return (
    /*
      Should add an extra wrapper View to override the default native behaviour
      https://github.com/software-mansion/react-native-gesture-handler/issues/477
    */
    <View style={style}>
      <RectButton enabled={!loading} {...props} style={styles.wrapper}>
        {leadingIcon}

        {title && (
          <Text type="bold" color={type === 'filled' ? 'white' : 'primary'} style={styles.text}>
            {title}
          </Text>
        )}

        {loading && (
          <ActivityIndicator
            color={type === 'filled' ? COLOR.white : COLOR.primary}
            style={styles.loader}
            size="small"
          />
        )}
      </RectButton>
    </View>
  );
};

export const Link = ({ children, ...props }: LinkProps) => {
  /* Hooks */
  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    if ('to' in props) {
      navigate(props.to as never, props.params as never);
    } else {
      props.onPress();
    }
  }, [props, navigate]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Text {...props}>{children}</Text>
    </TouchableOpacity>
  );
};

export const IconButton = ({ icon, ...props }: IconButtonProps) => {
  return (
    <BorderlessButton foreground borderless rippleRadius={ICON.M} {...props}>
      {icon}
    </BorderlessButton>
  );
};

const types = StyleSheet.create<Record<ButtonTypes, ViewStyle>>({
  filled: {
    backgroundColor: COLOR.primary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: COLOR.primary,
    borderWidth: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.S,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.M,
  },
  text: {
    marginHorizontal: SPACING.S,
    textTransform: 'uppercase',
  },
  loader: {
    position: 'absolute',
    right: SPACING.S,
  },
});
