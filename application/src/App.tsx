import React from 'react';

/* Providers */
import { UserProvider, AssetsProvider } from './contexts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import { Navigation } from './navigations';

/* Styles */
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <UserProvider>
        <AssetsProvider>
          <SelectProvider>
            <Navigation />
          </SelectProvider>
        </AssetsProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
