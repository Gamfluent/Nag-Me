import * as React from 'react';
import 'react-native-reanimated';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from 'expo-router';
import { theme } from './theme';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { registerForPushNotifications, addNotificationResponseHandler } from './services/notifications';
import { useTaskStore } from './store/taskStore';
import { router } from 'expo-router';

export default function App() {
  const { tasks } = useTaskStore();

  React.useEffect(() => {
    // Prevent the splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    // Register for notifications
    const setupNotifications = async () => {
      try {
        const { status } = await registerForPushNotifications();
        console.log('Notification permission status:', status);
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();

    // Handle notification taps
    const subscription = addNotificationResponseHandler(response => {
      const taskId = response.notification.request.content.data?.taskId;
      if (taskId) {
        router.push(`/add-task?taskId=${taskId}`);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: 'Nag Me',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="add-task"
            options={{
              title: 'Add Task',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              presentation: 'modal',
              headerLeft: () => null, // Remove the default back button
            }}
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
