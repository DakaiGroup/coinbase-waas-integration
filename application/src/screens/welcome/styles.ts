import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',

    marginHorizontal: SPACING.M,
  },
  button: {
    marginVertical: SPACING.M,
  },
  dakaiWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
});
