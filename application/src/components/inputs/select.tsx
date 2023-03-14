import React from 'react';

/* Types */
import type { SelectProps, SelectStyles } from '@mobile-reality/react-native-select-pro';

/* Presentation tHings */
import { Select as RawSelect } from '@mobile-reality/react-native-select-pro';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '../text';

/* Styles */
import { COLOR, SPACING } from '../../constants';

interface IProps<T> extends SelectProps<T> {
  containerStyle?: ViewStyle;
  label?: string;
}

export const Select = <T extends unknown>({ label, containerStyle, ...props }: IProps<T>) => {
  return (
    <View style={containerStyle}>
      {label && (
        <Text color="secondary" size="S" style={styles.label}>
          {label}
        </Text>
      )}

      <RawSelect {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: SPACING.S,
  },
});

const selectStyles: SelectStyles = {
  select: {
    text: { fontWeight: 'bold', color: COLOR.black },
    container: {
      borderColor: COLOR.lightGrey,
    },
  },
};

Select.defaultProps = {
  optionTextProps: { ellipsizeMode: 'middle' },
  selectTextProps: { ellipsizeMode: 'middle' },
  styles: selectStyles,
};
