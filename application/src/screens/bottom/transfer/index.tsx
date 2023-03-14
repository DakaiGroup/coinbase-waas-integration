import React, { useContext, useEffect, useMemo, useState } from 'react';

/* Types */
import type { BottomTabNavigationOptions, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, BottomTabParamList } from '../../../typings';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';

/* Data Thigns */
import { UserContext, AssetsContext } from '../../../contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* Presentation Things */
import { View, TextInput, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Select, Input, Button } from '../../../components';
import { NavigationIcon } from '../../../assets/icons';

/* Styles */
import { styles } from './styles';
import { COLOR } from '../../../constants';

/* Images */
type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Transfer'>,
  NativeStackScreenProps<RootStackParamList>
>;

function TransferScreen(props: Props) {
  /* Hooks */
  const { top, bottom } = useSafeAreaInsets();

  /* Contexts */
  const { assets, onSendERC20Token, onSendNativeToken } = useContext(AssetsContext);
  const { user } = useContext(UserContext);

  /* States */
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0] ?? null);
  const [selectedAsset, setSelectedAsset] = useState(assets?.[selectedAddress?.address!]?.[0] ?? null);
  const [isSending, setIsSending] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  /* Variables */
  const addressSelectOptions = useMemo(
    () => user?.addresses?.map(({ address }) => ({ label: address, value: address })) ?? [],
    [user],
  );
  const assetSelectOptions = useMemo(
    () =>
      selectedAddress && assets[selectedAddress?.address]
        ? Object.values(assets[selectedAddress?.address]).map(x => ({
            label: `${x.name} - ${x.amount} ${x.symbol}`,
            value: x.symbol,
          }))
        : [],
    [assets, selectedAddress],
  );

  const onChangeSelectedAddress = (_, index: number) => {
    setSelectedAddress(user?.addresses?.[index] ?? null);
  };

  const onChangeSelectedAsset = (_, index: number) => {
    if (selectedAddress) {
      setSelectedAsset(assets?.[selectedAddress?.address]?.[index] ?? null);
    }
  };

  const onSend = async () => {
    try {
      setIsSending(true);
      if (selectedAsset && selectedAddress && amount && toAddress) {
        const hash = selectedAsset.address
          ? await onSendERC20Token(selectedAsset, amount, selectedAddress, toAddress)
          : await onSendNativeToken(amount, selectedAddress, toAddress);

        props.navigation.replace('BottomTabStack', { screen: 'Home' });
        props.navigation.navigate('TransactionDetails', { hash });
      }
    } catch (error) {
      Alert.alert('Send', String(error.message || error));
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (user?.addresses?.length) {
      setSelectedAddress(user.addresses[0] ?? null);
    }
  }, [user?.addresses]);

  useEffect(() => {
    if (selectedAddress) {
      setSelectedAsset(assets?.[selectedAddress?.address]?.[0] ?? null);
    }
  }, [selectedAddress, assets]);

  return (
    <View style={[styles.container, { marginBottom: bottom, marginTop: top }]}>
      <ScrollView>
        <Select
          label="Your address"
          onSelect={onChangeSelectedAddress}
          clearable={false}
          options={addressSelectOptions}
          defaultOption={addressSelectOptions[0]}
          containerStyle={styles.inputWrapper}
        />

        <Input
          label="Recipient’s address"
          placeholder="0xm63gTR5h5gYuI021vBNMbS602...m45"
          containerStyle={styles.inputWrapper}
          onChangeText={setToAddress}
        />

        <Select
          key={selectedAddress?.address}
          label="Asset"
          onSelect={onChangeSelectedAsset}
          clearable={false}
          options={assetSelectOptions}
          defaultOption={assetSelectOptions[0]}
          containerStyle={styles.inputWrapper}
        />

        <TextInput
          autoFocus
          placeholder="1.05"
          inputMode="decimal"
          keyboardType="decimal-pad"
          style={styles.amountInput}
          textAlign="center"
          selectionColor={COLOR.black}
          onChangeText={setAmount}
        />
      </ScrollView>

      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
        <Button title="send" onPress={onSend} loading={isSending} />
      </KeyboardAvoidingView>
    </View>
  );
}

TransferScreen.navigationOptions = (): BottomTabNavigationOptions => {
  return {
    tabBarIcon: ({ color }) => <NavigationIcon fill={color} />,
    unmountOnBlur: true,
  };
};

export default TransferScreen;
