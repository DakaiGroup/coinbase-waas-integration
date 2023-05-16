import React from 'react';

/* Types */
import type { NativeStackNavigationOptions, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../typings';

/* Data Things */
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EXPLORER_URL } from '@env';

/* Presentation Things */
import { Button, Link, Text } from '../../components';
import { Linking, View } from 'react-native';
import { MessageIcon } from '../../assets/icons';

/* Styles */
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionDetails'>;

function TransactionDetailsScreen(props: Props) {
  /* Hooks */
  const { top, bottom } = useSafeAreaInsets();

  const openTransactionDetails = () => {
    if (props.route.params?.hash) {
      Linking.openURL(`${EXPLORER_URL}/${props.route.params.hash}`);
    }
  };

  return (
    <View style={[styles.container, { marginTop: top, marginBottom: bottom }]}>
      <MessageIcon style={styles.messageIcon} />

      <Text type="bold" style={styles.text}>
        To see the transaction details in Block Explorer, please click{' '}
        <Link color="primary" type="bold" onPress={openTransactionDetails}>
          here
        </Link>
        .
      </Text>

      <Button title="Done" onPress={props.navigation.goBack} />
    </View>
  );
}

TransactionDetailsScreen.options = (): NativeStackNavigationOptions => {
  return {
    title: 'Transaction Details',
  };
};

export default TransactionDetailsScreen;
