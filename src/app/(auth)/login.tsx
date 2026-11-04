import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Lock, Mail, X } from 'lucide-react-native';

import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { authService } from '@/services/auth.service';
import { googleAuthService } from '@/services/google-auth.service';
import { setItem } from '@/lib/secure-storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { useResponsive } from '@/hooks/useResponsive';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const showToast = useToastStore((state) => state.showToast);
  const { isSmallDevice, maxContentWidth } = useResponsive();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authService.login(data);
      await setItem(STORAGE_KEYS.SAVED_EMAIL, data.email);
      await setAuth(res.data);
      showToast({ type: 'success', message: t('auth.login.loginSuccess') });
      router.replace('/(tabs)' as any);
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message ||
        (err?.response?.status === 401
          ? t('auth.login.loginFailed')
          : 'Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối!');
      setErrorMessage(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const { idToken } = await googleAuthService.signIn();
      const res = await authService.googleLogin({ idToken });
      await setAuth(res.data);
      showToast({ type: 'success', message: t('auth.login.loginSuccess') });
      router.replace('/(tabs)' as any);
    } catch (err: any) {
      if (err?.message?.includes('GOOGLE_NATIVE_UNAVAILABLE')) {
        showToast({
          type: 'info',
          title: 'Google Sign-In',
          message: 'Google Sign-In đã sẵn sàng cho bản Development Build thiết bị thật.',
        });
        return;
      }
      const errorMsg = err?.response?.data?.message || err?.message;
      if (
        errorMsg &&
        (errorMsg.toLowerCase().includes('not linked') ||
          errorMsg.toLowerCase().includes('chưa liên kết') ||
          err?.response?.status === 403)
      ) {
        showToast({
          type: 'error',
          title: t('common.notice'),
          message: t('auth.login.googleLinkRequiredNotice'),
        });
      } else {
        showToast({
          type: 'error',
          title: t('common.error'),
          message: errorMsg || t('auth.login.loginFailed'),
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-warm font-sans"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full self-center px-6 py-8 sm:py-12"
          style={{ maxWidth: maxContentWidth }}
        >
          {/* Badge pill */}
          <View className="mb-4 items-center sm:mb-5">
            <View className="flex-row items-center rounded-full bg-white px-4 py-1.5 shadow-xs border border-gray-100">
              <Text className="text-xs font-semibold text-brand">
                🔴 9PAWS • {t('common.appTagline')}
              </Text>
            </View>
          </View>

          {/* Mascot */}
          <View className="mb-4 items-center sm:mb-5">
            <View className="h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-200/80 shadow-xs">
              <Image
                source={MIU_MIU_IMAGE}
                style={{ width: isSmallDevice ? 52 : 68, height: isSmallDevice ? 52 : 68 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Title & Slogan */}
          <View className="mb-6 items-center sm:mb-8">
            <Text className="text-2xl sm:text-3xl font-extrabold text-text-main text-center">
              {t('auth.login.title')}
            </Text>
            <Text className="mt-1.5 text-center text-xs sm:text-sm text-text-muted font-sans">
              {t('auth.login.subtitle')}
            </Text>
          </View>

          {/* Inline error banner on login failure */}
          {errorMessage && (
            <View className="mb-4 flex-row items-center rounded-2xl bg-rose-50 border border-rose-200/80 p-3.5 gap-x-2.5">
              <AlertCircle size={18} color="#E11D48" />
              <Text className="flex-1 text-xs font-semibold text-rose-700 leading-4 font-sans">
                {errorMessage}
              </Text>
              <TouchableOpacity
                onPress={() => setErrorMessage(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="p-1"
              >
                <X size={15} color="#E11D48" />
              </TouchableOpacity>
            </View>
          )}

          {/* Form */}
          <View className="gap-y-3.5 sm:gap-y-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.login.emailLabel')}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon={<Mail size={18} color="#9CA3AF" />}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.login.passwordLabel')}
                  placeholder="••••••••"
                  isPassword
                  leftIcon={<Lock size={18} color="#9CA3AF" />}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            {/* Forgot password */}
            <TouchableOpacity
              className="self-end pt-1"
              onPress={() => router.push('/(auth)/forgot-password' as any)}
            >
              <Text className="text-xs sm:text-sm font-semibold text-brand">
                {t('auth.login.forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit button */}
          <View className="mt-5 sm:mt-6">
            <Button
              title={t('auth.login.submitButton')}
              onPress={() => handleSubmit(onSubmit)()}
              isLoading={isLoading}
            />
          </View>

          {/* Divider */}
          <View className="my-4 sm:my-5 flex-row items-center">
            <View className="h-px flex-1 bg-gray-200" />
            <Text className="mx-4 text-xs text-text-muted">{t('common.or')}</Text>
            <View className="h-px flex-1 bg-gray-200" />
          </View>

          {/* Google button */}
          <Button
            title={t('auth.login.googleButton')}
            variant="outline"
            icon={<GoogleIcon size={20} />}
            isLoading={isGoogleLoading}
            onPress={handleGoogleLogin}
          />

          {/* Footer */}
          <View className="mt-8 sm:mt-10 flex-row items-center justify-center pb-2">
            <Text className="text-xs sm:text-sm text-text-muted font-sans">
              {t('auth.login.noAccount')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
              <Text className="text-xs sm:text-sm font-bold text-brand">
                {t('auth.login.registerNow')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
