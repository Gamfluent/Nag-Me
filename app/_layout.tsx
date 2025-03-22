import * as React from 'react';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
}
