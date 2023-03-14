import { StyleSheet } from 'react-native';
import { COLOR, FONT, SPACING } from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SPACING.M,
    justifyContent: 'space-between',
  },
  inputWrapper: {
    marginVertical: SPACING.M,
  },
  amountInput: {
    alignSelf: 'center',
    padding: SPACING.L,
    borderBottomWidth: 1,
    fontSize: FONT.XL,
    fontWeight: 'bold',
    borderBottomColor: COLOR.lightGrey,
    marginVertical: SPACING.L,
    width: '33%',
  },
});
