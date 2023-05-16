import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SPACING.M,
  },
  messageIcon: { alignSelf: 'center' },
  text: { textAlign: 'center', flexDirection: 'row', margin: SPACING.L },
});
