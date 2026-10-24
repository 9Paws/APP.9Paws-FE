import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Fingerprint,
  Globe,
  Heart,
  HelpCircle,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  QrCode,
  Sliders,
  Wallet,
  X,
} from 'lucide-react-native';

import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { authService } from '@/services/auth.service';
import { getItem } from '@/lib/secure-storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { changeLanguage, SupportedLanguage } from '@/i18n';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

interface SettingRowProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

function SettingRow({
  icon,
  iconBgColor = 'bg-gray-100',
  title,
  subtitle,
  rightElement,
  onPress,
}: SettingRowProps) {
  const content = (
    <View className="flex-row items-center py-3.5">
      <View className={`h-11 w-11 items-center justify-center rounded-2xl ${iconBgColor} mr-3.5`}>
        {icon}
      </View>
      <View className="flex-1 mr-2">
        <Text className="text-sm font-bold text-text-main font-bold">{title}</Text>
        {subtitle && (
          <Text className="mt-0.5 text-xs text-text-muted leading-4 font-sans">{subtitle}</Text>
        )}
      </View>
      {rightElement || (
        <ChevronRight size={18} color="#9CA3AF" />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const fullName = user?.fullName || 'Người dùng 9Paws';
  const email = user?.email || '';
  const firstName = fullName.split(' ').pop() || 'bạn';

  const currentLang = (i18n.language as SupportedLanguage) || 'vi';

  const handleSelectLanguage = async (lang: SupportedLanguage) => {
    await changeLanguage(lang);
    setIsLangModalVisible(false);
    showToast({
      type: 'success',
      title: lang === 'vi' ? 'Đã đổi ngôn ngữ' : 'Language Changed',
      message: lang === 'vi' ? 'Giao diện đã chuyển sang Tiếng Việt' : 'Interface switched to English',
    });
  };

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = await getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Vẫn logout ở client ngay cả khi gọi API thất bại
    } finally {
      await logout();
      setIsLoggingOut(false);
      setIsLogoutModalVisible(false);
      router.replace('/(auth)/login' as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-warm font-sans">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="px-5 pt-3 pb-12"
      >
        {/* Top bar */}
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-lg font-extrabold text-text-main font-bold">
              {t('profile.greeting', { name: firstName })}
            </Text>
            <Text className="mt-0.5 text-xs text-text-muted font-medium">
              {t('profile.subtitle')}
            </Text>
          </View>

          <View className="flex-row items-center gap-x-2.5">
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm">
              <Bell size={18} color="#1F2937" />
            </TouchableOpacity>
            <View className="h-10 w-10 items-center justify-center rounded-full overflow-hidden bg-amber-100 border border-amber-200">
              <Image source={MIU_MIU_IMAGE} style={{ width: 32, height: 32 }} resizeMode="contain" />
            </View>
          </View>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex-row items-center mb-6">
          <View className="h-16 w-16 rounded-full overflow-hidden bg-amber-100 items-center justify-center border-2 border-amber-200 mr-3.5">
            <Image source={MIU_MIU_IMAGE} style={{ width: 50, height: 50 }} resizeMode="contain" />
          </View>

          <View className="flex-1">
            <Text className="text-base font-bold text-text-main font-bold">{fullName} ✨</Text>
            <Text className="text-xs text-text-muted mt-0.5 font-sans">{email}</Text>
            <View className="self-start mt-2 rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5">
              <Text className="text-[10px] font-bold text-amber-800">
                {t('profile.memberBadge')}
              </Text>
            </View>
          </View>

          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-gray-50 border border-gray-200">
            <Pencil size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Section: Tài khoản & Ví thanh toán */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <View className="flex-row items-center">
              <View className="h-6 w-6 items-center justify-center rounded-md bg-orange-100 mr-2">
                <Wallet size={14} color="#F15C22" />
              </View>
              <Text className="text-sm font-bold text-text-main">
                {t('profile.walletsSection')}
              </Text>
            </View>

            <TouchableOpacity className="flex-row items-center rounded-full bg-orange-50 border border-orange-200/80 px-3 py-1">
              <Plus size={13} color="#F15C22" />
              <Text className="ml-1 text-xs font-bold text-brand">{t('profile.addWallet')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {/* Card 1: Vietcombank */}
            <View className="w-40 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mr-3">
              <View className="flex-row items-center justify-between mb-3">
                <CreditCard size={18} color="#92400E" />
                <View className="rounded-full bg-indigo-50 px-2 py-0.5">
                  <Text className="text-[10px] font-bold text-indigo-600">{t('profile.mainBadge')}</Text>
                </View>
              </View>
              <Text className="text-xs text-text-muted font-medium font-sans">Vietcombank</Text>
              <Text className="mt-1 text-sm font-extrabold text-text-main">10.250.000 ₫</Text>
            </View>

            {/* Card 2: Ví MoMo */}
            <View className="w-40 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mr-3">
              <View className="flex-row items-center justify-between mb-3">
                <QrCode size={18} color="#BE185D" />
                <View className="rounded-full bg-gray-100 px-2 py-0.5">
                  <Text className="text-[10px] font-bold text-text-muted">{t('profile.foodBadge')}</Text>
                </View>
              </View>
              <Text className="text-xs text-text-muted font-medium font-sans">Ví MoMo</Text>
              <Text className="mt-1 text-sm font-extrabold text-text-main">1.200.000 ₫</Text>
            </View>

            {/* Card 3: Tiền mặt */}
            <View className="w-40 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mr-3">
              <View className="flex-row items-center justify-between mb-3">
                <View className="h-5 w-5 items-center justify-center rounded-md bg-emerald-100">
                  <Text className="text-xs">💵</Text>
                </View>
              </View>
              <Text className="text-xs text-text-muted font-medium font-sans">{t('profile.cash')}</Text>
              <Text className="mt-1 text-sm font-extrabold text-text-main">1.000.000 ₫</Text>
            </View>
          </ScrollView>
        </View>

        {/* Section: Cài đặt ứng dụng & Bảo mật */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3 px-1">
            <Sliders size={16} color="#F15C22" className="mr-2" />
            <Text className="text-sm font-bold text-text-main">
              {t('profile.securitySection')}
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
            <SettingRow
              icon={<Fingerprint size={20} color="#8B5CF6" />}
              iconBgColor="bg-purple-50"
              title={t('profile.biometric')}
              subtitle={t('profile.biometricSub')}
              rightElement={
                <Switch
                  value={faceIdEnabled}
                  onValueChange={setFaceIdEnabled}
                  trackColor={{ false: '#E5E7EB', true: '#F15C22' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <View className="h-px bg-gray-100 my-1" />

            <SettingRow
              icon={<Bell size={20} color="#3B82F6" />}
              iconBgColor="bg-blue-50"
              title={t('profile.reminder')}
              subtitle={t('profile.reminderSub')}
              rightElement={
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: '#E5E7EB', true: '#F15C22' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <View className="h-px bg-gray-100 my-1" />

            <SettingRow
              icon={<Text className="text-base font-bold text-rose-500">$</Text>}
              iconBgColor="bg-rose-50"
              title={t('profile.currency')}
              subtitle={t('profile.currencySub')}
              rightElement={
                <View className="flex-row items-center">
                  <Text className="text-xs font-semibold text-text-muted mr-1.5 font-sans">
                    {t('profile.currencyValue')}
                  </Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              }
              onPress={() =>
                showToast({
                  type: 'info',
                  title: t('profile.currency'),
                  message: 'Tính năng chuyển đổi đơn vị tiền tệ đang được hoàn thiện.',
                })
              }
            />
            <View className="h-px bg-gray-100 my-1" />

            <SettingRow
              icon={<Globe size={20} color="#06B6D4" />}
              iconBgColor="bg-cyan-50"
              title={t('profile.language')}
              subtitle={t('profile.languageSub')}
              rightElement={
                <View className="flex-row items-center">
                  <Text className="text-xs font-semibold text-text-muted mr-1.5 font-sans">
                    {currentLang === 'vi' ? 'Tiếng Việt' : 'English'}
                  </Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              }
              onPress={() => setIsLangModalVisible(true)}
            />
          </View>
        </View>

        {/* Section: Hỗ trợ & Thông tin */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3 px-1">
            <HelpCircle size={16} color="#F15C22" className="mr-2" />
            <Text className="text-sm font-bold text-text-main">
              {t('profile.supportSection')}
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
            <SettingRow
              icon={<MessageSquare size={20} color="#F59E0B" />}
              iconBgColor="bg-amber-50"
              title={t('profile.feedback')}
              subtitle={t('profile.feedbackSub')}
              onPress={() =>
                showToast({
                  type: 'success',
                  title: t('profile.feedback'),
                  message: 'Cảm ơn bạn! Mọi ý kiến xin gửi về support@9paws.com',
                })
              }
            />
            <View className="h-px bg-gray-100 my-1" />

            <SettingRow
              icon={<Heart size={20} color="#EC4899" />}
              iconBgColor="bg-pink-50"
              title={t('profile.about')}
              subtitle={t('profile.aboutSub')}
              onPress={() =>
                showToast({
                  type: 'info',
                  title: '9Paws v1.0.0 ✨',
                  message: 'Sổ tay chi tiêu ấm cúng và tự động hoá quyết toán hoá đơn nhóm.',
                })
              }
            />
          </View>
        </View>

        {/* Đăng xuất button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          disabled={isLoggingOut}
          className="h-14 w-full flex-row items-center justify-center rounded-2xl bg-red-50 border border-red-200/70 shadow-sm mb-4"
        >
          <LogOut size={18} color="#EF4444" className="mr-2" />
          <Text className="text-base font-bold text-red-500 font-bold">
            {isLoggingOut ? '...' : t('profile.logoutButton')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Chọn Ngôn ngữ (Language Switcher Sheet) */}
      <Modal
        visible={isLangModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setIsLangModalVisible(false)}
          />
          <View className="bg-white rounded-t-3xl px-6 pt-5 pb-8 shadow-2xl">
            <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-text-main font-bold">
                {t('profile.selectLanguage')}
              </Text>
              <TouchableOpacity
                onPress={() => setIsLangModalVisible(false)}
                className="p-1"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Tiếng Việt */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectLanguage('vi')}
              className={`flex-row items-center justify-between py-4 border-b border-gray-50 ${
                currentLang === 'vi' ? 'bg-orange-50/40 rounded-xl px-3' : 'px-3'
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🇻🇳</Text>
                <View>
                  <Text className="text-base font-bold text-text-main font-bold">Tiếng Việt</Text>
                  <Text className="text-xs text-text-muted font-sans">Việt Nam</Text>
                </View>
              </View>
              {currentLang === 'vi' && <Check size={20} color="#F15C22" strokeWidth={2.5} />}
            </TouchableOpacity>

            {/* English */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectLanguage('en')}
              className={`flex-row items-center justify-between py-4 ${
                currentLang === 'en' ? 'bg-orange-50/40 rounded-xl px-3' : 'px-3'
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🇬🇧</Text>
                <View>
                  <Text className="text-base font-bold text-text-main font-bold">English</Text>
                  <Text className="text-xs text-text-muted font-sans">United States / UK</Text>
                </View>
              </View>
              {currentLang === 'en' && <Check size={20} color="#F15C22" strokeWidth={2.5} />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Xác nhận Đăng xuất */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl items-center">
            <View className="h-16 w-16 rounded-full bg-red-50 border border-red-100 items-center justify-center mb-4">
              <LogOut size={26} color="#EF4444" />
            </View>

            <Text className="text-lg font-bold text-text-main text-center font-bold mb-2">
              {t('profile.logoutConfirmTitle')}
            </Text>

            <Text className="text-sm text-text-muted text-center font-sans mb-6">
              {t('profile.logoutConfirmMessage')}
            </Text>

            <View className="w-full flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsLogoutModalVisible(false)}
                className="flex-1 h-12 rounded-2xl bg-gray-100 items-center justify-center"
              >
                <Text className="text-sm font-semibold text-text-main font-bold">
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 h-12 rounded-2xl bg-red-500 items-center justify-center shadow-sm"
              >
                {isLoggingOut ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="text-sm font-bold text-white font-bold">
                    {t('profile.logoutButton')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
