import { StyleSheet } from 'react-native';
import { SPACING } from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SPACING.M,
  },
  folderIcon: {
    alignSelf: 'center',
  },
  noWalletText: {
    textAlign: 'center',
    marginHorizontal: SPACING.XXXL,
    marginTop: SPACING.L,
    marginBottom: SPACING.XL,
  },
  buttonGroupWrapper: {
    flexDirection: 'row',
  },
  selectWrapper: {
    flex: 2,
  },
  copyButton: {
    alignSelf: 'flex-end',
    marginHorizontal: SPACING.M,
  },
  generateButton: { alignSelf: 'flex-end' },
  contentWrapper: { flex: 1 },
  loader: { flex: 1, alignSelf: 'center' },
  widgetWrapper: {
    marginVertical: SPACING.XL,
  },
  balanceGroupWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.M,
  },
  balanceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etherIcon: {
    marginRight: SPACING.S,
  },
  sendButton: {
    flexBasis: 150,
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.M,
  },
});
