import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SPACING.M,
  },
  gap: {
    marginVertical: SPACING.M,
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textWrapper: {
    flexDirection: 'row',
  },
  dakaiWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: SPACING.M,
  },
});
