import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#FAF7F2',
          maxWidth: 480,
          width: '100%',
          alignSelf: 'center',
        },
        animation: 'slide_from_right',
      }}
    />
  );
}
