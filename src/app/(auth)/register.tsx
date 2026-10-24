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
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User } from 'lucide-react-native';
import type { AxiosError } from 'axios';

import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { authService } from '@/services/auth.service';
import { setItem } from '@/lib/secure-storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { useToastStore } from '@/stores/toast.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MiuMiuTip } from '@/components/ui/MiuMiuTip';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

type PasswordStrength = 'weak' | 'medium' | 'strong';

function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return 'weak';
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z\d]/.test(password);
  if (hasLetter && hasNumber && (hasSpecial || password.length >= 12)) return 'strong';
  if (hasLetter && hasNumber) return 'medium';
  return 'weak';
}

function PasswordStrengthBar({ password }: { password: string }) {
  const { t } = useTranslation();
  if (!password) return null;
  const strength = getPasswordStrength(password);

  const strengthConfig: Record<
    PasswordStrength,
    { label: string; filledBars: number; barColor: string; labelColor: string }
  > = {
    weak: { label: t('auth.register.weak'), filledBars: 1, barColor: '#EF4444', labelColor: '#EF4444' },
    medium: { label: t('auth.register.medium'), filledBars: 2, barColor: '#F97316', labelColor: '#F97316' },
    strong: { label: t('auth.register.strong'), filledBars: 3, barColor: '#10B981', labelColor: '#10B981' },
  };

  const config = strengthConfig[strength];

  return (
    <View className="mt-2 gap-y-1">
      <View className="flex-row gap-x-1.5">
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: index < config.filledBars ? config.barColor : '#E5E7EB',
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 11, fontWeight: '600', color: config.labelColor }}>
        {config.label}
      </Text>
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });

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
        <View className="flex-1 px-6 pt-12 pb-8">
          {/* Mascot */}
          <View className="mb-5 items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Image
                source={MIU_MIU_IMAGE}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Title */}
          <View className="mb-7 items-center">
            <Text className="text-2xl font-bold text-text-main font-bold">
              {t('auth.register.title')}
            </Text>
            <Text className="mt-2 text-center text-sm text-text-muted font-sans">
              {t('auth.register.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-y-4">
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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
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
                  <PasswordStrengthBar password={passwordValue} />
                </View>
              )}
            />

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
          <View className="mt-5">
            <MiuMiuTip content={t('auth.register.miumiuTip')} />
          </View>

          {/* Submit button */}
          <View className="mt-6">
            <Button
              title={t('auth.register.submitButton')}
              onPress={() => handleSubmit(onSubmit)()}
              isLoading={isLoading}
            />
          </View>

          {/* Divider */}
          <View className="my-5 flex-row items-center">
            <View className="h-px flex-1 bg-gray-200" />
            <Text className="mx-4 text-xs text-text-muted">{t('common.or')}</Text>
            <View className="h-px flex-1 bg-gray-200" />
          </View>

          {/* Google button */}
          <Button
            title={t('auth.register.googleButton')}
            variant="outline"
            onPress={() => {
              showToast({
                type: 'info',
                title: 'Google Sign-In',
                message: 'Tính năng đăng ký với Google đang được tích hợp.',
              });
            }}
          />

          {/* Footer */}
          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-sm text-text-muted font-sans">
              {t('auth.register.hasAccount')}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-sm font-bold text-brand">
                {t('auth.register.loginNow')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
