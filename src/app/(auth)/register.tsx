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
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, User } from 'lucide-react-native';
import { AxiosError } from 'axios';

import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import { googleAuthService } from '@/services/google-auth.service';
import { setItem } from '@/lib/secure-storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { useResponsive } from '@/hooks/useResponsive';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MiuMiuTip } from '@/components/ui/MiuMiuTip';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

interface PasswordStrengthProps {
  password?: string;
}

function PasswordStrengthBar({ password = '' }: PasswordStrengthProps) {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();

  const getBarColor = (index: number) => {
    if (index >= strength) return 'bg-gray-200';
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-amber-400';
    if (strength <= 3) return 'bg-yellow-400';
    return 'bg-emerald-500';
  };

  const getLabel = () => {
    if (!password) return '';
    if (strength <= 1) return 'Yếu';
    if (strength <= 2) return 'Trung bình';
    if (strength <= 3) return 'Khá';
    return 'Mạnh';
  };

  const getTextColor = () => {
    if (strength <= 1) return 'text-red-500';
    if (strength <= 2) return 'text-amber-500';
    if (strength <= 3) return 'text-yellow-600';
    return 'text-emerald-600';
  };

  if (!password) return null;

  return (
    <View className="mt-1.5">
      <View className="flex-row items-center gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            className={`h-1 flex-1 rounded-full ${getBarColor(index)}`}
          />
        ))}
      </View>
      <Text className={`mt-1 text-right text-xs font-semibold ${getTextColor()}`}>
        {getLabel()}
      </Text>
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const showToast = useToastStore((state) => state.showToast);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { isSmallDevice, maxContentWidth } = useResponsive();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = useWatch({ control, name: 'password' });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      await setItem(STORAGE_KEYS.SAVED_EMAIL, data.email);
      showToast({
        type: 'success',
        title: t('common.notice'),
        message: t('auth.register.registerSuccess'),
      });
      router.push({ pathname: '/(auth)/otp' as any, params: { email: data.email } });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      showToast({
        type: 'error',
        title: t('common.error'),
        message: error.response?.data?.message ?? 'Đăng ký thất bại. Vui lòng thử lại!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
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
      showToast({
        type: 'error',
        title: t('common.error'),
        message: errorMsg || 'Đăng nhập Google thất bại.',
      });
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
          {/* Mascot */}
          <View className="mb-4 items-center sm:mb-5">
            <View className="h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-200/80 shadow-xs">
              <Image
                source={MIU_MIU_IMAGE}
                style={{ width: isSmallDevice ? 46 : 54, height: isSmallDevice ? 46 : 54 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Title */}
          <View className="mb-5 items-center sm:mb-7">
            <Text className="text-2xl sm:text-3xl font-extrabold text-text-main text-center">
              {t('auth.register.title')}
            </Text>
            <Text className="mt-1.5 text-center text-xs sm:text-sm text-text-muted font-sans">
              {t('auth.register.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-y-3.5 sm:gap-y-4">
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.register.fullNameLabel')}
                  placeholder="Nguyễn Văn A"
                  autoCapitalize="words"
                  leftIcon={<User size={18} color="#9CA3AF" />}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.fullName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.register.emailLabel')}
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

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.register.passwordLabel')}
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
              <PasswordStrengthBar password={passwordValue} />
            </View>

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.register.confirmPasswordLabel')}
                  placeholder="••••••••"
                  isPassword
                  leftIcon={<Lock size={18} color="#9CA3AF" />}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </View>

          {/* MiuMiu Tip */}
          <View className="mt-4 sm:mt-5">
            <MiuMiuTip content={t('auth.register.miumiuTip')} />
          </View>

          {/* Submit button */}
          <View className="mt-5 sm:mt-6">
            <Button
              title={t('auth.register.submitButton')}
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
            title={t('auth.register.googleButton')}
            variant="outline"
            icon={<GoogleIcon size={20} />}
            isLoading={isGoogleLoading}
            onPress={handleGoogleLogin}
          />

          {/* Footer */}
          <View className="mt-8 sm:mt-10 flex-row items-center justify-center pb-2">
            <Text className="text-xs sm:text-sm text-text-muted font-sans">
              {t('auth.register.hasAccount')}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-xs sm:text-sm font-bold text-brand">
                {t('auth.register.loginNow')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
