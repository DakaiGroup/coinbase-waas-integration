import React from 'react';

/* Types */
import type { RootStackParamList } from '../typings';

/* Data Things */
import { THEME } from '../constants';

/* Navigation Things */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

/* Screen and Stacks */
import TransactionDetailsScreen from '../screens/transaction-details';
import RegistrationScreen from '../screens/registration';
import BottomTabStack from './bottom-stack';
import WelcomeScreen from '../screens/welcome';
import LoginScreen from '../screens/login';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <NavigationContainer theme={THEME}>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={WelcomeScreen.options} />
        <Stack.Screen name="BottomTabStack" component={BottomTabStack} options={BottomTabStack.options} />
        <Stack.Screen name="Registration" component={RegistrationScreen} options={RegistrationScreen.options} />
        <Stack.Screen name="Login" component={LoginScreen} options={LoginScreen.options} />
        <Stack.Screen
          name="TransactionDetails"
          component={TransactionDetailsScreen}
          options={TransactionDetailsScreen.options}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
