import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'ImageBackground is deprecated',
]);

// Chặn thông báo cảnh báo ImageBackground gửi từ client lên Metro terminal
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('ImageBackground is deprecated')
  ) {
    return;
  }
  originalWarn(...args);
};
