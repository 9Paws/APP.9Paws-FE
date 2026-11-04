import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'ImageBackground is deprecated',
  '[expo-notifications]',
  '`expo-notifications` functionality is not fully supported in Expo Go',
  'NO_I18NEXT_INSTANCE',
]);

// Chặn thông báo cảnh báo deprecation từ thư viện bên thứ 3 và Expo Go gửi lên Metro terminal
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const message = args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(' ');

  if (
    message.includes('ImageBackground is deprecated') ||
    message.includes('[expo-notifications]') ||
    message.includes('expo-notifications') ||
    message.includes('NO_I18NEXT_INSTANCE')
  ) {
    return;
  }

  originalWarn(...args);
};
