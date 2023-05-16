import React, { useContext, useState } from 'react';

/* Types */
import type { NativeStackNavigationOptions, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../typings';

/* Navigation Things */
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* Data Things */
import { UserContext } from '../../contexts';

/* Presentation Things */
import { Button, Input, Link, Text } from '../../components';
import { Alert, View } from 'react-native';
import { DakaiLogo } from '../../assets/logos';

/* Styles */
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen(props: Props) {
  /* Hooks */
  const { bottom } = useSafeAreaInsets();

  /* Contexts */
  const { onLogin } = useContext(UserContext);

  /* States */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      const response = await onLogin(username, password);

      if (response === 'ok') {
        props.navigation.replace('BottomTabStack', { screen: 'Home' });
      } else {
        throw new Error(response);
      }
    } catch (error) {
      Alert.alert('Login', String(error?.message || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { marginBottom: bottom }]}>
      <Input
        label="Username"
        placeholder="Enter username"
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect={false}
        onChangeText={setUsername}
        containerStyle={styles.gap}
      />

      <Input
        label="Password"
        placeholder="Enter password"
        autoComplete="password"
        textContentType="password"
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.gap}
      />

      <Button title="Login" style={styles.gap} onPress={onSubmit} loading={isSubmitting} />

      <View style={styles.bottomWrapper}>
        <View style={styles.textWrapper}>
          <Text>Dont't have an account yet? </Text>
          <Link to="Registration" type="bold" color="primary">
            Create Acccount.
          </Link>
        </View>

        <View style={styles.dakaiWrapper}>
          <Text>Made by</Text>
          <DakaiLogo />
        </View>
      </View>
    </View>
  );
}

LoginScreen.options = (): NativeStackNavigationOptions => {
  return {
    title: 'Login',
  };
};

export default LoginScreen;
