import React, { useContext, useEffect, useMemo, useState } from 'react';

/* Types */
import type { RootStackParamList, BottomTabParamList, TokenOrCoin } from '../../../typings';
import type { BottomTabNavigationOptions, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';

/* Data Thigns */
import Clipboard from '@react-native-clipboard/clipboard';
import { UserContext, AssetsContext } from '../../../contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

/* Presentation Things */
import { CopyIcon, EtherIcon, FolderIcon, HomeIcon, NavigationIcon } from '../../../assets/icons';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { Select, Button, Text } from '../../../components';

/* Styles */
import { styles } from './styles';

/* Images */
type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

function HomeScreen(props: Props) {
  /* Hooks */
  const { top } = useSafeAreaInsets();
  const isFocused = useIsFocused();

  /* Contexts */
  const { user, onCreateAddress, onCreateWallet } = useContext(UserContext);
  const { assets, onGetAssets } = useContext(AssetsContext);

  /* States */
  const [isAddressCreating, setIsAddressCreating] = useState(false);
  const [isWalletCreating, setIsWalletCreating] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0]?.address ?? '');
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* Variables */
  const selectedAddressAssets = useMemo(() => assets?.[selectedAddress] ?? null, [selectedAddress, assets]);
  const addressSelectOptions = useMemo(
    () => user?.addresses?.map(({ address }) => ({ label: address, value: address })) ?? [],
    [user],
  );

  const onInitiateAddressCreation = async () => {
    try {
      setIsAddressCreating(true);

      const newAddress = await onCreateAddress();

      setSelectedAddress(newAddress);
    } catch (error) {
      Alert.alert('Create address', String(error?.message || error));
    } finally {
      setIsAddressCreating(false);
    }
  };

  const onInitiateWalletCreation = async () => {
    try {
      setIsWalletCreating(true);

      const resp = await onCreateWallet();

      if (resp === 'ok') {
      } else {
        throw new Error(resp);
      }
    } catch (error) {
      Alert.alert('Create wallet', String(error?.message || error));
    } finally {
      setIsWalletCreating(false);
    }
  };

  const onRefreshSelectedAssets = async () => {
    try {
      setIsRefreshing(true);
      onGetAssets(selectedAddress);
    } catch (error) {
    } finally {
      setIsRefreshing(false);
    }
  };

  const onChangeSelectedAddress = (_, index: number) => setSelectedAddress(user?.addresses?.[index]?.address ?? '');

  const onCopySelectedAddress = () => Clipboard.setString(selectedAddress);

  const navigateToTransfer = () => props.navigation.navigate('Transfer');

  useEffect(() => {
    if (user?.addresses?.length) {
      setSelectedAddress(user.addresses[0]?.address);
    }
  }, [user?.addresses]);

  useEffect(() => {
    if (isFocused && selectedAddress) {
      onGetAssets(selectedAddress);
    }
  }, [isFocused, selectedAddress, onGetAssets]);

  return (
    <View style={[styles.container, { marginTop: top }]}>
      {!user?.wallet ? (
        <>
          <FolderIcon style={styles.folderIcon} />
          <Text type="bold" size="L" style={styles.noWalletText}>
            You don't have any wallet yet.
          </Text>
          <Button title="Create wallet" onPress={onInitiateWalletCreation} loading={isWalletCreating} />
        </>
      ) : !selectedAddress ? (
        <>
          <FolderIcon style={styles.folderIcon} />
          <Text type="bold" size="L" style={styles.noWalletText}>
            You don't have any address yet.
          </Text>
          <Button title="Create address" onPress={onInitiateAddressCreation} loading={isAddressCreating} />
        </>
      ) : (
        <>
          <View style={styles.buttonGroupWrapper}>
            <View style={styles.selectWrapper}>
              <Select
                key={addressSelectOptions.length}
                label="Selected address"
                onSelect={onChangeSelectedAddress}
                clearable={false}
                options={addressSelectOptions}
                defaultOption={addressSelectOptions[0]}
              />
            </View>

            <Button leadingIcon={<CopyIcon />} onPress={onCopySelectedAddress} style={styles.copyButton} />

            <Button
              type="outlined"
              title="Generate"
              onPress={onInitiateAddressCreation}
              loading={isAddressCreating}
              style={styles.generateButton}
            />
          </View>

          <View style={styles.contentWrapper}>
            {!selectedAddressAssets ? (
              <ActivityIndicator size="large" color="black" style={styles.loader} />
            ) : (
              <>
                <View style={styles.widgetWrapper}>
                  <Text type="bold">{selectedAddressAssets?.[0]?.symbol ?? ''} Balance</Text>
                  <View style={styles.balanceGroupWrapper}>
                    <View style={styles.balanceWrapper}>
                      <EtherIcon style={styles.etherIcon} />
                      <Text type="bold" size="L">
                        {selectedAddressAssets?.[0]?.amount?.substring(0, 6) ?? ''}
                      </Text>
                    </View>

                    <Button
                      title="Send"
                      leadingIcon={<NavigationIcon />}
                      onPress={navigateToTransfer}
                      style={styles.sendButton}
                    />
                  </View>
                </View>

                <Text type="bold">Your assets</Text>

                <FlatList
                  data={selectedAddressAssets}
                  refreshing={isRefreshing}
                  renderItem={_renderItem}
                  onRefresh={onRefreshSelectedAssets}
                />
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const _renderItem = ({ item }: { item: TokenOrCoin }) => {
  return (
    <View style={styles.rowWrapper}>
      <View>
        <Text type="bold">{item.name}</Text>
        <Text>{item.symbol}</Text>
      </View>

      <Text type="bold">
        {item.amount?.substring(0, 8)} {item.symbol}
      </Text>
    </View>
  );
};

HomeScreen.navigationOptions = (): BottomTabNavigationOptions => {
  return {
    tabBarIcon: ({ color }) => <HomeIcon stroke={color} />,
  };
};

export default HomeScreen;
