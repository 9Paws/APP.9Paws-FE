import '../global.css';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, LogBox, View } from 'react-native';

import {
  useFonts,
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
  BeVietnamPro_800ExtraBold,
} from '@expo-google-fonts/be-vietnam-pro';

import { useAuthStore } from '@/stores/auth.store';
import { Toast } from '@/components/ui/Toast';
import { initI18n } from '@/i18n';

LogBox.ignoreLogs([
  'ImageBackground is deprecated',
]);

export default function RootLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [isI18nReady, setIsI18nReady] = useState(false);

  const [fontsLoaded] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
  });

  useEffect(() => {
    initI18n().then(() => setIsI18nReady(true));
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && fontsLoaded && isI18nReady) {
      if (isAuthenticated) {
        router.replace('/(tabs)' as any);
      } else {
        router.replace('/(auth)/login' as any);
      }
    }
  }, [isLoading, fontsLoaded, isI18nReady, isAuthenticated, router]);

  if (isLoading || !fontsLoaded || !isI18nReady) {
    return (
      <View className="flex-1 items-center justify-center bg-background-warm">
        <ActivityIndicator size="large" color="#F15C22" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1 bg-background-warm">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FAF7F2' },
          }}
        />
        <Toast />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
