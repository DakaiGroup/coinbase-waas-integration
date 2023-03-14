import React from 'react';

/* Types */
import type { NativeStackNavigationOptions, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../typings';

/* Navigation Things */
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* Presentation Things */
import { CoinbaseLogo, DakaiLogo } from '../../assets/logos';
import { Button, Text } from '../../components';
import { View } from 'react-native';

/* Styles */
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

function WelcomeScreen(props: Props) {
  /* Hooks */
  const { top, bottom } = useSafeAreaInsets();

  const navigateToRegistration = () => props.navigation.navigate('Registration');

  const navigateToLogin = () => props.navigation.navigate('Login');

  return (
    <View style={[styles.container, { marginTop: top, marginBottom: bottom }]}>
      <View>
        <Text type="bold" size="XL">
          WaaS by
        </Text>
        <CoinbaseLogo />
      </View>

      <View>
        <Button title="Register" onPress={navigateToRegistration} style={styles.button} />

        <Button type="outlined" title="Login" onPress={navigateToLogin} style={styles.button} />
      </View>

      <View style={styles.dakaiWrapper}>
        <Text>Made by</Text>
        <DakaiLogo />
      </View>
    </View>
  );
}

WelcomeScreen.options = (): NativeStackNavigationOptions => {
  return {
    headerShown: false,
  };
};

export default WelcomeScreen;
