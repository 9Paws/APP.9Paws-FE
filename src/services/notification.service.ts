import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let expoNotificationsModule: typeof import('expo-notifications') | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  expoNotificationsModule = require('expo-notifications');
} catch {
  // Expo Go on Android does not bundle ExpoTopicSubscriptionModule.
  // Gracefully fallback so the app does not crash at startup.
  expoNotificationsModule = null;
}

export const setupNotificationHandler = (): void => {
  if (!expoNotificationsModule || Platform.OS === 'web') return;
  try {
    expoNotificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // Native handler unavailable in current environment
  }
};

export const requestPushPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;
  if (!expoNotificationsModule) {
    // In Expo Go or environment without native push module
    return false;
  }

  try {
    const { status } = await expoNotificationsModule.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

export const getPushPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;
  if (!expoNotificationsModule) {
    return false;
  }

  try {
    const { status } = await expoNotificationsModule.getPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};
