import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Task } from '../store/taskStore';

// Configure notifications to show when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Calculate notification frequency based on priority and due date
function getNotificationFrequency(priority: number, dueDate: Date): number {
  const now = new Date();
  const timeUntilDue = dueDate.getTime() - now.getTime();
  const daysUntilDue = timeUntilDue / (1000 * 60 * 60 * 24);

  // Base frequency in minutes
  let frequency: number;

  if (daysUntilDue <= 1) {
    // Last 24 hours
    frequency = priority >= 8 ? 30 : // High priority: every 30 minutes
               priority >= 5 ? 60 : // Medium priority: every hour
               120; // Low priority: every 2 hours
  } else if (daysUntilDue <= 3) {
    // 2-3 days before
    frequency = priority >= 8 ? 120 : // High priority: every 2 hours
               priority >= 5 ? 240 : // Medium priority: every 4 hours
               360; // Low priority: every 6 hours
  } else {
    // More than 3 days before
    frequency = priority >= 8 ? 720 : // High priority: every 12 hours
               priority >= 5 ? 1440 : // Medium priority: daily
               2880; // Low priority: every 2 days
  }

  return frequency;
}

// Request notification permissions
export async function registerForPushNotifications() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return { status: finalStatus };
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return { status: token ? 'granted' : 'denied' };
}

// Schedule a notification for a task
export async function scheduleTaskNotification(task: Task) {
  try {
    // Cancel any existing notifications for this task
    await cancelTaskNotifications(task.id);

    if (task.completed) {
      console.log(`Task ${task.id} is completed, no notifications needed`);
      return;
    }

    const dueDate = new Date(task.dueDate);
    if (dueDate <= new Date()) {
      console.log(`Task ${task.id} is overdue, no notifications needed`);
      return;
    }

    // Get notification frequency based on priority and due date
    const frequencyMinutes = getNotificationFrequency(task.priority, dueDate);
    
    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Task Due: ${task.title}`,
        body: task.description || 'No description provided',
        data: { taskId: task.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: frequencyMinutes * 60,
        repeats: true,
      },
    });

    console.log(`Scheduled notification ${notificationId} for task ${task.id}`);
    console.log(`Due date: ${dueDate.toLocaleString()}`);
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

// Cancel all notifications for a task
export async function cancelTaskNotifications(taskId: string) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
    throw error;
  }
}

// Reschedule all task notifications
export async function rescheduleAllNotifications(tasks: Task[]) {
  try {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new notifications for all incomplete tasks
    for (const task of tasks) {
      if (!task.completed) {
        await scheduleTaskNotification(task);
      }
    }
  } catch (error) {
    console.error('Error rescheduling notifications:', error);
    throw error;
  }
}

// Handle notification response
export function addNotificationResponseHandler(handler: (response: Notifications.NotificationResponse) => void) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}
