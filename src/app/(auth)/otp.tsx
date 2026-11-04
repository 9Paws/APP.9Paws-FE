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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, RotateCw } from 'lucide-react-native';
import type { AxiosError } from 'axios';

import { OtpInput } from '@/components/ui/OtpInput';
import { Button } from '@/components/ui/Button';
import { MiuMiuTip } from '@/components/ui/MiuMiuTip';
import { useCountdown } from '@/hooks/useCountdown';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { APP_CONFIG } from '@/lib/constants';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

export default function OtpScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || 'mai.nguyen@example.com';

  const { setAuth } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { formatted, isExpired, restart } = useCountdown(APP_CONFIG.OTP_COUNTDOWN_SECONDS);

  const handleVerify = async () => {
    if (otp.length < APP_CONFIG.OTP_LENGTH) {
      showToast({
        type: 'info',
        title: t('common.notice'),
        message: t('auth.otp.incomplete'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyRegistrationOtp({
        email,
        otp,
      });

      if (res.data) {
        await setAuth(res.data);
        showToast({
          type: 'success',
          title: t('common.success'),
          message: 'Chào mừng bạn đã gia nhập 9Paws ✨',
        });
        router.replace('/(tabs)' as any);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      showToast({
        type: 'error',
        title: t('common.error'),
        message: error.response?.data?.message ?? 'Mã OTP không chính xác hoặc đã hết hạn.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isExpired && !isResending) {
      showToast({
        type: 'info',
        title: t('common.notice'),
        message: t('auth.otp.resendWait'),
      });
      return;
    }

    setIsResending(true);
    try {
      await authService.resendOtp({
        email,
        type: 'REGISTER',
      });
      restart();
      showToast({
        type: 'success',
        title: t('common.success'),
        message: t('auth.otp.resendSuccess'),
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      showToast({
        type: 'error',
        title: t('common.error'),
        message: error.response?.data?.message ?? 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.',
      });
    } finally {
      setIsResending(false);
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
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm"
            accessibilityLabel="Quay lại"
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>

          {/* Mascot */}
          <View className="mt-4 mb-4 items-center">
            <View className="relative h-20 w-20 items-center justify-center rounded-full bg-amber-100/60 border border-amber-200/50 shadow-sm">
              <Image
                source={MIU_MIU_IMAGE}
                style={{ width: 56, height: 56 }}
                resizeMode="contain"
              />
              <View className="absolute -top-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm border border-red-100">
                <Text style={{ fontSize: 11 }}>💌</Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <View className="mb-4 items-center">
            <Text className="text-2xl font-extrabold text-text-main">
              {t('auth.otp.title')}
            </Text>
            <Text className="mt-1 text-center text-sm text-text-muted font-sans">
              {t('auth.otp.subtitle')}
            </Text>
          </View>

          {/* Email badge pill */}
          <View className="mb-8 items-center">
            <View className="rounded-full border border-gray-200 bg-white px-5 py-2 shadow-sm">
              <Text className="text-sm font-medium text-text-main">{email}</Text>
            </View>
          </View>

          {/* OTP input 6 digits */}
          <OtpInput value={otp} onChange={setOtp} length={APP_CONFIG.OTP_LENGTH} />

          {/* Timer and Resend Row */}
          <View className="mt-5 flex-row items-center justify-between px-1">
            <View className="flex-row items-center">
              <Clock size={16} color="#F15C22" />
              <Text className="ml-1.5 text-xs text-text-muted font-sans">
                {t('auth.otp.expiresIn')}
                <Text className="font-bold text-brand">
                  {isExpired ? t('auth.otp.expired') : formatted}
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleResend}
              disabled={isResending}
              className="flex-row items-center"
            >
              <RotateCw size={15} color={isExpired ? '#F15C22' : '#9CA3AF'} />
              <Text
                className={`ml-1.5 text-xs font-semibold ${
                  isExpired ? 'text-brand' : 'text-text-muted'
                }`}
              >
                {t('auth.otp.resendCode')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* MiuMiu Tip */}
          <View className="mt-8">
            <MiuMiuTip content={t('auth.otp.miumiuTip')} />
          </View>

          {/* Submit button */}
          <View className="mt-8">
            <Button
              title={t('auth.otp.submitButton')}
              onPress={handleVerify}
              isLoading={isLoading}
              disabled={otp.length < APP_CONFIG.OTP_LENGTH}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
