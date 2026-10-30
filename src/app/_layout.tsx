import '../global.css';
import '@/lib/suppress-warnings';
import { initI18n } from '@/i18n';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SplashScreen from 'expo-splash-screen';

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
import { AnimatedSplashScreen } from '@/components/ui/AnimatedSplashScreen';
import { api } from '@/lib/api';
import { STORAGE_KEYS } from '@/lib/constants';
import { getItem, setItem } from '@/lib/secure-storage';
import { requestPushPermissions, setupNotificationHandler } from '@/services/notification.service';
import { googleAuthService } from '@/services/google-auth.service';

SplashScreen.preventAutoHideAsync().catch(() => {});
setupNotificationHandler();

export default function RootLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [minSplashTimePassed, setMinSplashTimePassed] = useState(false);
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  const [fontsLoaded] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
  });

  useEffect(() => {
    // Hide static native splash as soon as our React tree mounts
    SplashScreen.hideAsync().catch(() => {});

    // Giữ splash animation tối thiểu 1.4s để hiệu ứng xuất hiện mượt mà
    const timer = setTimeout(() => {
      setMinSplashTimePassed(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Khởi tạo cấu hình Google Sign-In SDK
    googleAuthService.configure();

    // Pre-warm kết nối backend ngầm ngay khi app vừa mở
    api.get('/', { timeout: 4000 }).catch(() => {});

    // Yêu cầu quyền thông báo đẩy lần đầu mở app
    const requestInitialPushPermission = async () => {
      if (Platform.OS === 'web') return;
      try {
        const requested = await getItem(STORAGE_KEYS.PUSH_PERMISSION_REQUESTED);
        if (!requested) {
          await setItem(STORAGE_KEYS.PUSH_PERMISSION_REQUESTED, 'true');
          const granted = await requestPushPermissions();
          await setItem(
            STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED,
            granted ? 'true' : 'false'
          );
        }
      } catch {
        // Ignored in unsupported platforms
      }
    };
    requestInitialPushPermission();
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

  const isAppReady = fontsLoaded && isI18nReady && !isLoading && minSplashTimePassed;

  if (!fontsLoaded || !isI18nReady) {
    return (
      <View style={{ flex: 1 }}>
        <AnimatedSplashScreen isReady={false} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        <Toast />
        {!isSplashFinished && (
          <AnimatedSplashScreen
            isReady={isAppReady}
            onFinish={() => setIsSplashFinished(true)}
          />
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
