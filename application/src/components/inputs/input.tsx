import React, { useMemo } from 'react';

/* Presentation Things */
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Text } from '../text';

/* Styles */
import { COLOR, SPACING } from '../../constants';

type Props = TextInputProps & {
  containerStyle?: ViewStyle;
  label?: string;
  trailingIcon?: JSX.Element;
};

export const Input = ({ label, trailingIcon, containerStyle, ...props }: Props) => {
  /* Variables */
  const style = useMemo(() => [props.style, styles.input], [props.style]);

  return (
    <View style={containerStyle}>
      {label && (
        <Text color="secondary" size="S" style={styles.label}>
          {label}
        </Text>
      )}

      <View style={styles.inputWrapper}>
        <TextInput {...props} style={style} />

        {trailingIcon}
      </View>
    </View>
  );
};

Input.defaultProps = {
  placeholderTextColor: COLOR.secondary,
  selectionColor: COLOR.secondary,
  cursorColor: COLOR.secondary,
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    borderRadius: SPACING.S,
    padding: SPACING.M,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR.secondary,
  },
  input: {
    flex: 1,
    padding: 0,
    color: COLOR.black,
  },
  label: {
    marginBottom: SPACING.S,
  },
});
