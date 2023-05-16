import React from 'react';

/* Types */
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { BottomTabParamList } from '../../typings';

/* Navigation Things */
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* Presentation Things */
/* Data Things */
import { COLOR } from '../../constants';

/* Screens - Stacks */
import TransferScreen from '../../screens/bottom/transfer';
import HomeScreen from '../../screens/bottom/home';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarInactiveTintColor: COLOR.secondary,
};

export default function BottomTabStack() {
  return (
    <Tab.Navigator screenOptions={SCREEN_OPTIONS}>
      <Tab.Screen name="Home" component={HomeScreen} options={HomeScreen.navigationOptions} />
      <Tab.Screen name="Transfer" component={TransferScreen} options={TransferScreen.navigationOptions} />
    </Tab.Navigator>
  );
}

BottomTabStack.options = (): NativeStackNavigationOptions => {
  return {
    headerShown: false,
  };
};
