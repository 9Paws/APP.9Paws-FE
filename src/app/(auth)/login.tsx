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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Lock, Mail, X } from 'lucide-react-native';
import type { AxiosError } from 'axios';

import { loginSchema, type LoginFormData } from '@/lib/validators';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authService.login(data);
      await setAuth(res.data);
      showToast({ type: 'success', message: t('auth.login.loginSuccess') });
      router.replace('/(tabs)' as any);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const serverMsg = error.response?.data?.message;
      setErrorMessage(
        serverMsg && !serverMsg.toLowerCase().includes('bad credentials')
          ? serverMsg
          : t('auth.login.loginFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-warm font-sans"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-14 pb-8">
          {/* Badge pill */}
          <View className="mb-8 items-center">
            <View className="flex-row items-center rounded-full bg-white px-4 py-2 shadow-sm border border-gray-100">
              <Text className="text-xs font-bold text-brand font-semibold">
                🔴 9PAWS • {t('common.appTagline')}
              </Text>
            </View>
          </View>

          {/* Mascot */}
          <View className="mb-6 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-amber-100 shadow-sm">
              <Image
                source={MIU_MIU_IMAGE}
                style={{ width: 64, height: 64 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Title */}
          <View className="mb-8 items-center">
            <Text className="text-2xl font-bold text-text-main font-bold">
              {t('auth.login.title')}
            </Text>
            <Text className="mt-2 text-center text-sm text-text-muted font-sans">
              {t('auth.login.subtitle')}
            </Text>
          </View>

          {/* Inline error banner on login failure */}
          {errorMessage && (
            <View className="mb-5 flex-row items-center rounded-2xl bg-rose-50 border border-rose-200/80 p-3.5 gap-x-2.5">
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
          <View className="gap-y-4">
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
              className="self-end"
              onPress={() => router.push('/(auth)/forgot-password' as any)}
            >
              <Text className="text-sm font-semibold text-brand">
                {t('auth.login.forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit button */}
          <View className="mt-6">
            <Button
              title={t('auth.login.submitButton')}
              onPress={() => handleSubmit(onSubmit)()}
              isLoading={isLoading}
            />
          </View>

          {/* Divider */}
          <View className="my-6 flex-row items-center">
            <View className="h-px flex-1 bg-gray-200" />
            <Text className="mx-4 text-xs text-text-muted">{t('common.or')}</Text>
            <View className="h-px flex-1 bg-gray-200" />
          </View>

          {/* Google button */}
          <Button
            title={t('auth.login.googleButton')}
            variant="outline"
            icon={<GoogleIcon size={20} />}
            onPress={() => {
              showToast({
                type: 'info',
                title: 'Google Sign-In',
                message: t('auth.login.googleComingSoon'),
              });
            }}
          />

          {/* Footer */}
          <View className="mt-8 flex-row items-center justify-center">
            <Text className="text-sm text-text-muted font-sans">
              {t('auth.login.noAccount')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
              <Text className="text-sm font-bold text-brand">
                {t('auth.login.registerNow')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
