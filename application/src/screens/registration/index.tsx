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

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

function RegistrationScreen(props: Props) {
  /* Hooks */
  const { bottom } = useSafeAreaInsets();

  /* Contexts */
  const { onRegistration } = useContext(UserContext);

  /* States */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rePassword, setRePassword] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      const response = await onRegistration(username, password);

      if (response === 'ok') {
        props.navigation.replace('Login');
      } else {
        throw new Error(response);
      }
    } catch (error) {
      Alert.alert('Create an Account', String(error?.message || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { marginBottom: bottom }]}>
      <Input
        label="Username"
        autoCapitalize="none"
        autoComplete="username-new"
        autoCorrect={false}
        placeholder="Enter username"
        onChangeText={setUsername}
        containerStyle={styles.gap}
      />

      <Input
        label="Password"
        autoComplete="password-new"
        placeholder="Enter password"
        textContentType="password"
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.gap}
      />

      <Input
        label="Confirm Password"
        placeholder="Confirm password"
        textContentType="password"
        onChangeText={setRePassword}
        secureTextEntry
        containerStyle={styles.gap}
      />

      <Button title="Create account" style={styles.gap} onPress={onSubmit} loading={isSubmitting} />
      <Text size="S">By clicking on Create Account I accept the Terms of Service and read Privacy Policy.</Text>

      <View style={styles.bottomWrapper}>
        <View style={styles.textWrapper}>
          <Text>Already have an account? </Text>
          <Link to="Login" type="bold" color="primary">
            Login.
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

RegistrationScreen.options = (): NativeStackNavigationOptions => {
  return {
    title: 'Create an Account',
  };
};

export default RegistrationScreen;
