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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import type { AxiosError } from 'axios';

import {
  forgotPasswordEmailSchema,
  resetPasswordSchema,
  type ForgotPasswordEmailFormData,
  type ResetPasswordFormData,
} from '@/lib/validators';
import { authService } from '@/services/auth.service';
import { useToastStore } from '@/stores/toast.store';
import { useCountdown } from '@/hooks/useCountdown';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { OtpInput } from '@/components/ui/OtpInput';
import { MiuMiuTip } from '@/components/ui/MiuMiuTip';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD';
type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const showToast = useToastStore((state) => state.showToast);

  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer for OTP step (105 seconds)
  const { seconds, isExpired, restart: resetCountdown } = useCountdown(105);

  // Form for Step 1: Email
  const emailForm = useForm<ForgotPasswordEmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  // Form for Step 3: New Password
  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const newPasswordValue = useWatch({
    control: resetForm.control,
    name: 'password',
    defaultValue: '',
  });

  // Calculate password strength
  const getPasswordStrength = (pwd: string): PasswordStrength => {
    if (!pwd || pwd.length < 6) return 'weak';
    if (pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /\d/.test(pwd)) {
      return pwd.length >= 10 && /[^A-Za-z0-9]/.test(pwd) ? 'strong' : 'medium';
    }
    return 'weak';
  };

  const strength = getPasswordStrength(newPasswordValue);

  // Handlers
  const handleSendEmail = async (data: ForgotPasswordEmailFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email: data.email });
      setEmail(data.email);
      resetCountdown();
      setStep('OTP');
      showToast({
        type: 'success',
        title: t('common.success'),
        message: t('auth.forgotPassword.sendOtpSuccess'),
      });
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      showToast({
        type: 'error',
        title: t('common.error'),
        message: axiosErr.response?.data?.message || t('auth.login.loginFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      showToast({
        type: 'error',
        title: t('common.notice'),
        message: t('auth.otp.incomplete'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyForgotPasswordOtp({ email, otp });
      setResetToken(res.data.resetToken);
      setStep('NEW_PASSWORD');
      showToast({
        type: 'success',
        title: t('common.success'),
        message: t('auth.forgotPassword.otpTitle'),
      });
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      showToast({
        type: 'error',
        title: t('common.error'),
        message: axiosErr.response?.data?.message || t('auth.otp.incomplete'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isExpired) {
      showToast({
        type: 'info',
        title: t('common.notice'),
        message: t('auth.otp.resendWait'),
      });
      return;
    }

    try {
      await authService.resendOtp({ email, type: 'FORGOT_PASSWORD' });
      resetCountdown();
      showToast({
        type: 'success',
        title: t('common.success'),
        message: t('auth.otp.resendSuccess'),
      });
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      showToast({
        type: 'error',
        title: t('common.error'),
        message: axiosErr.response?.data?.message || t('common.error'),
      });
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        resetToken,
        newPassword: data.password,
      });

      showToast({
        type: 'success',
        title: t('common.success'),
        message: t('auth.forgotPassword.resetSuccess'),
      });

      router.replace('/(auth)/login' as any);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      showToast({
        type: 'error',
        title: t('common.error'),
        message: axiosErr.response?.data?.message || t('common.error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-warm">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="px-6 py-4"
        >
          {/* Back button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (step === 'OTP') setStep('EMAIL');
              else if (step === 'NEW_PASSWORD') setStep('OTP');
              else router.back();
            }}
            className="h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm mb-4"
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>

          {/* Logo & Header */}
          <View className="items-center my-3">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-amber-100/70 border-2 border-amber-200 shadow-sm">
              <Image source={MIU_MIU_IMAGE} style={{ width: 60, height: 60 }} resizeMode="contain" />
            </View>

            <Text className="mt-4 text-2xl font-bold text-text-main font-bold">
              {step === 'EMAIL' && t('auth.forgotPassword.title')}
              {step === 'OTP' && t('auth.forgotPassword.otpTitle')}
              {step === 'NEW_PASSWORD' && t('auth.forgotPassword.newPasswordTitle')}
            </Text>

            <Text className="mt-1.5 text-center text-sm text-text-muted font-sans px-4">
              {step === 'EMAIL' && t('auth.forgotPassword.subtitle')}
              {step === 'OTP' && t('auth.forgotPassword.otpSubtitle', { email })}
              {step === 'NEW_PASSWORD' && t('auth.forgotPassword.newPasswordSubtitle')}
            </Text>
          </View>

          {/* Step 1: Nhập Email */}
          {step === 'EMAIL' && (
            <View className="mt-6">
              <Controller
                control={emailForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label={t('auth.forgotPassword.emailLabel')}
                    placeholder="example@email.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    leftIcon={<Mail size={20} color="#9CA3AF" />}
                  />
                )}
              />

              <View className="mt-6">
                <Button
                  title={t('auth.forgotPassword.sendOtpButton')}
                  onPress={() => emailForm.handleSubmit(handleSendEmail)()}
                  isLoading={isLoading}
                />
              </View>
            </View>
          )}

          {/* Step 2: Nhập OTP */}
          {step === 'OTP' && (
            <View className="mt-6">
              <OtpInput
                length={6}
                value={otp}
                onChange={(val: string) => {
                  setOtp(val);
                }}
              />

              <View className="my-6 flex-row items-center justify-center">
                <Text className="text-sm text-text-muted font-sans">
                  {t('auth.otp.expiresIn')}
                </Text>
                <Text className="text-sm font-bold text-brand font-bold ml-1">
                  {isExpired ? t('auth.otp.expired') : `${seconds}s`}
                </Text>
                {isExpired && (
                  <TouchableOpacity onPress={handleResendOtp} className="ml-2">
                    <Text className="text-sm font-bold text-brand underline font-bold">
                      {t('auth.otp.resendCode')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Button
                title={t('auth.forgotPassword.verifyOtpButton')}
                onPress={handleVerifyOtp}
                isLoading={isLoading}
              />

              <View className="mt-6">
                <MiuMiuTip content={t('auth.otp.miumiuTip')} />
              </View>
            </View>
          )}

          {/* Step 3: Tạo mật khẩu mới */}
          {step === 'NEW_PASSWORD' && (
            <View className="mt-6">
              <Controller
                control={resetForm.control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label={t('auth.forgotPassword.newPasswordLabel')}
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    isPassword
                    leftIcon={<Lock size={20} color="#9CA3AF" />}
                  />
                )}
              />

              {/* Password strength bar */}
              {newPasswordValue.length > 0 && (
                <View className="mb-4 mt-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-xs text-text-muted font-sans">Độ mạnh mật khẩu</Text>
                    <Text
                      className={`text-xs font-bold font-bold ${
                        strength === 'weak'
                          ? 'text-red-500'
                          : strength === 'medium'
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                      }`}
                    >
                      {strength === 'weak'
                        ? t('auth.register.weak')
                        : strength === 'medium'
                          ? t('auth.register.medium')
                          : t('auth.register.strong')}
                    </Text>
                  </View>
                  <View className="h-1.5 w-full flex-row rounded-full bg-gray-200 overflow-hidden">
                    <View
                      className={`h-full ${
                        strength === 'weak'
                          ? 'w-1/3 bg-red-500'
                          : strength === 'medium'
                            ? 'w-2/3 bg-amber-500'
                            : 'w-full bg-emerald-500'
                      }`}
                    />
                  </View>
                </View>
              )}

              <Controller
                control={resetForm.control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label={t('auth.forgotPassword.confirmPasswordLabel')}
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    isPassword
                    leftIcon={<Lock size={20} color="#9CA3AF" />}
                  />
                )}
              />

              <View className="mt-6">
                <Button
                  title={t('auth.forgotPassword.submitResetButton')}
                  onPress={() => resetForm.handleSubmit(handleResetPassword)()}
                  isLoading={isLoading}
                />
              </View>
            </View>
          )}

          {/* Footer: Back to login */}
          <View className="mt-8 flex-row items-center justify-center">
            <TouchableOpacity onPress={() => router.replace('/(auth)/login' as any)}>
              <Text className="text-sm font-bold text-brand font-bold">
                ← {t('auth.forgotPassword.backToLogin')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
