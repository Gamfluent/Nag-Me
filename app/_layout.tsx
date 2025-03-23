import * as React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Nag Me',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(screens)/add-task"
          options={{
            title: 'Add Task',
            presentation: 'modal',
            headerLeft: () => null,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
