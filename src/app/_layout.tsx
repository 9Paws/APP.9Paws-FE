import '../global.css';
import '@/lib/suppress-warnings';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

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
import { api } from '@/lib/api';
import { STORAGE_KEYS } from '@/lib/constants';
import { getItem } from '@/lib/secure-storage';

export default function RootLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);

  const [fontsLoaded] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
  });

  useEffect(() => {
    // Pre-warm kết nối backend ngầm ngay khi app vừa mở
    api.get('/', { timeout: 4000 }).catch(() => {});
  }, []);

  useEffect(() => {
    initI18n().then(() => setIsI18nReady(true));
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && fontsLoaded && isI18nReady) {
      if (isAuthenticated) {
        // Kiểm tra xem người dùng có bật khóa sinh trắc học không
        getItem(STORAGE_KEYS.BIOMETRIC_ENABLED).then(async (enabled) => {
          if (enabled === 'true' && !isBiometricVerified) {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (hasHardware && isEnrolled) {
              const res = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Xác thực sinh trắc học để mở 9Paws',
                fallbackLabel: 'Sử dụng mật khẩu',
              });
              if (res.success) {
                setIsBiometricVerified(true);
                router.replace('/(tabs)' as any);
              }
              return;
            }
          }
          router.replace('/(tabs)' as any);
        });
      } else {
        router.replace('/(auth)/login' as any);
      }
    }
  }, [isLoading, fontsLoaded, isI18nReady, isAuthenticated, isBiometricVerified, router]);

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
