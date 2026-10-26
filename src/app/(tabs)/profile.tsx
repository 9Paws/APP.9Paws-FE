import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import { getPushPermissions, requestPushPermissions } from '@/services/notification.service';
import {
  Bell,
  BellRing,
  Check,
  ChevronRight,
  Clock,
  Coins,
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
  Send,
  Sliders,
  Wallet,
  X,
} from 'lucide-react-native';

import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { authService } from '@/services/auth.service';
import { getItem, setItem } from '@/lib/secure-storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { changeLanguage, SupportedLanguage } from '@/i18n';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

const isImageUri = (uri?: string | null) => {
  if (!uri) return false;
  return (
    uri.startsWith('file://') ||
    uri.startsWith('content://') ||
    uri.startsWith('http://') ||
    uri.startsWith('https://') ||
    uri.startsWith('data:image') ||
    uri.startsWith('ph://')
  );
};

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
        <Text className="text-sm font-bold text-text-main">{title}</Text>
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

interface WalletItem {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'cash';
  balance: number;
  badge?: string;
}

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  locale: string;
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'VND', name: 'Việt Nam Đồng', symbol: '₫', flag: '🇻🇳', locale: 'vi-VN' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', locale: 'de-DE' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', locale: 'ja-JP' },
  { code: 'KRW', name: 'Korean Won', symbol: '₩', flag: '🇰🇷', locale: 'ko-KR' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', locale: 'zh-CN' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const currentLang = (i18n.language as SupportedLanguage) || 'vi';

  const [wallets, setWallets] = useState<WalletItem[]>([]);

  const [currentCurrency, setCurrentCurrency] = useState<string>('VND');
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(true);
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('21:00');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isAddWalletModalVisible, setIsAddWalletModalVisible] = useState(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);

  // Feedback form state
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // New Wallet form state
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletBalance, setNewWalletBalance] = useState('');
  const [newWalletType, setNewWalletType] = useState<'bank' | 'wallet' | 'cash'>('bank');

  const fullName = user?.fullName || 'Người dùng 9Paws';
  const email = user?.email || '';
  const firstName = fullName.split(' ').pop() || 'bạn';

  useEffect(() => {
    // Kiểm tra tính sẵn sàng của Face ID / Vân tay
    const checkBiometrics = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const supported = hasHardware && isEnrolled;
        setIsBiometricSupported(supported);

        if (!supported) {
          setFaceIdEnabled(false);
          await setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
        } else {
          const val = await getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
          setFaceIdEnabled(val === 'true');
        }
      } catch {
        setIsBiometricSupported(false);
      }
    };

    // Kiểm tra trạng thái Push Notification
    const checkPushStatus = async () => {
      try {
        if (Platform.OS === 'web') {
          const val = await getItem(STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED);
          setPushNotificationEnabled(val === 'true');
          return;
        }
        const granted = await getPushPermissions();
        setPushNotificationEnabled(granted);
        await setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED, granted ? 'true' : 'false');
      } catch {
        setPushNotificationEnabled(false);
      }
    };

    checkBiometrics();
    checkPushStatus();

    getItem(STORAGE_KEYS.WALLETS).then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            setWallets(parsed);
          }
        } catch {
          // Ignore parse error
        }
      }
    });

    getItem(STORAGE_KEYS.CURRENCY).then((val) => {
      if (val) setCurrentCurrency(val);
    });

    getItem(STORAGE_KEYS.REMINDER_ENABLED).then((val) => {
      if (val !== null && val !== undefined) setReminderEnabled(val === 'true');
    });
    getItem(STORAGE_KEYS.REMINDER_TIME).then((val) => {
      if (val) setReminderTime(val);
    });
  }, []);

  const handleToggleBiometric = async (value: boolean) => {
    if (!isBiometricSupported) {
      return;
    }

    if (value) {
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: t('profile.biometricPrompt'),
        fallbackLabel: t('common.cancel'),
      });

      if (res.success) {
        setFaceIdEnabled(true);
        await setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
        showToast({
          type: 'success',
          title: t('common.success'),
          message: t('profile.biometricEnabledSuccess'),
        });
      }
    } else {
      setFaceIdEnabled(false);
      await setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
      showToast({
        type: 'info',
        title: t('common.notice'),
        message: t('profile.biometricDisabledNotice'),
      });
    }
  };

  const handleTogglePushNotification = async (value: boolean) => {
    if (value) {
      if (Platform.OS === 'web') {
        setPushNotificationEnabled(true);
        await setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED, 'true');
        showToast({
          type: 'success',
          title: t('common.success'),
          message: t('profile.pushNotificationEnabledSuccess'),
        });
        return;
      }

      const granted = await requestPushPermissions();
      if (granted) {
        setPushNotificationEnabled(true);
        await setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED, 'true');
        showToast({
          type: 'success',
          title: t('common.success'),
          message: t('profile.pushNotificationEnabledSuccess'),
        });
      } else {
        setPushNotificationEnabled(false);
        await setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED, 'false');
        showToast({
          type: 'info',
          title: t('common.notice'),
          message: t('profile.pushNotificationDisabledNotice'),
        });
      }
    } else {
      setPushNotificationEnabled(false);
      await setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED, 'false');
      showToast({
        type: 'info',
        title: t('common.notice'),
        message: t('profile.pushNotificationOffNotice'),
      });
    }
  };

  const handleToggleReminder = async (value: boolean) => {
    setReminderEnabled(value);
    await setItem(STORAGE_KEYS.REMINDER_ENABLED, value ? 'true' : 'false');
    if (value) {
      setIsReminderModalVisible(true);
    } else {
      showToast({
        type: 'info',
        title: t('common.notice'),
        message: t('profile.reminderDisabledNotice'),
      });
    }
  };

  const handleSelectReminderTime = async (time: string) => {
    setReminderTime(time);
    await setItem(STORAGE_KEYS.REMINDER_TIME, time);
    setIsReminderModalVisible(false);
    showToast({
      type: 'success',
      title: t('common.success'),
      message: t('profile.reminderTimeSetSuccess', { time }),
    });
  };

  const handleCreateWallet = async () => {
    if (!newWalletName.trim()) {
      showToast({
        type: 'error',
        title: t('common.notice'),
        message: t('profile.enterSourceNameNotice'),
      });
      return;
    }
    const balanceNum = parseFloat(newWalletBalance.replace(/[^0-9]/g, '')) || 0;
    const newSource: WalletItem = {
      id: Date.now().toString(),
      name: newWalletName.trim(),
      type: newWalletType,
      balance: balanceNum,
    };
    const updated = [newSource, ...wallets];
    setWallets(updated);
    await setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updated));
    setNewWalletName('');
    setNewWalletBalance('');
    setIsAddWalletModalVisible(false);
    showToast({
      type: 'success',
      title: t('common.success'),
      message: t('profile.addSourceSuccess'),
    });
  };

  const formatCurrency = (amount: number) => {
    const curr = CURRENCIES.find((c) => c.code === currentCurrency) || CURRENCIES[0];
    try {
      return new Intl.NumberFormat(curr.locale, {
        style: 'currency',
        currency: curr.code,
        maximumFractionDigits: curr.code === 'VND' || curr.code === 'JPY' || curr.code === 'KRW' ? 0 : 2,
      }).format(amount);
    } catch {
      return `${new Intl.NumberFormat('vi-VN').format(amount)} ${curr.symbol}`;
    }
  };

  const handleSelectCurrency = async (curr: CurrencyOption) => {
    setCurrentCurrency(curr.code);
    await setItem(STORAGE_KEYS.CURRENCY, curr.code);
    setIsCurrencyModalVisible(false);
    showToast({
      type: 'success',
      title: t('profile.currencyChangedTitle'),
      message: t('profile.currencyChangedMessage', {
        name: `${curr.name} (${curr.code} - ${curr.symbol})`,
      }),
    });
  };

  const handleSubmitFeedback = () => {
    if (!feedbackContent.trim()) {
      showToast({
        type: 'error',
        title: t('common.notice'),
        message: t('profile.feedbackEmptyNotice'),
      });
      return;
    }
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setIsFeedbackModalVisible(false);
      setFeedbackTitle('');
      setFeedbackContent('');
      showToast({
        type: 'success',
        title: t('common.success'),
        message: t('profile.feedbackSubmittedSuccess'),
      });
    }, 400);
  };

  const getLanguageDisplayName = (lang: string) => {
    switch (lang) {
      case 'vi':
        return 'Tiếng Việt';
      case 'en':
        return 'English';
      case 'zh':
        return '中文';
      case 'ko':
        return '한국어';
      case 'ja':
        return '日本語';
      default:
        return 'Tiếng Việt';
    }
  };

  const activeCurrencyObj =
    CURRENCIES.find((c) => c.code === currentCurrency) || CURRENCIES[0];

  const handleSelectLanguage = async (lang: SupportedLanguage) => {
    await changeLanguage(lang);
    setIsLangModalVisible(false);
    showToast({
      type: 'success',
      title: t('profile.langChangedTitle'),
      message: t('profile.langChangedMessage'),
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
            <Text className="text-lg font-extrabold text-text-main">
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
              {isImageUri(user?.avatarUrl) ? (
                <Image source={{ uri: user!.avatarUrl! }} style={{ width: 40, height: 40 }} resizeMode="cover" />
              ) : user?.avatarUrl && user.avatarUrl !== '🐱' ? (
                <Text className="text-xl">{user.avatarUrl}</Text>
              ) : (
                <Image source={MIU_MIU_IMAGE} style={{ width: 32, height: 32 }} resizeMode="contain" />
              )}
            </View>
          </View>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex-row items-center mb-6">
          <View className="h-16 w-16 rounded-full overflow-hidden bg-amber-100 items-center justify-center border-2 border-amber-200 mr-3.5">
            {isImageUri(user?.avatarUrl) ? (
              <Image source={{ uri: user!.avatarUrl! }} style={{ width: 64, height: 64 }} resizeMode="cover" />
            ) : user?.avatarUrl && user.avatarUrl !== '🐱' ? (
              <Text className="text-3xl">{user.avatarUrl}</Text>
            ) : (
              <Image source={MIU_MIU_IMAGE} style={{ width: 50, height: 50 }} resizeMode="contain" />
            )}
          </View>

          <View className="flex-1">
            <Text className="text-base font-bold text-text-main">{fullName}</Text>
            <Text className="text-xs text-text-muted mt-0.5 font-sans">{email}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/edit-profile' as any)}
            className="h-9 w-9 items-center justify-center rounded-full bg-gray-50 border border-gray-200"
          >
            <Pencil size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Section: Nguồn tiền */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <View className="flex-row items-center gap-x-2">
              <View className="h-6 w-6 items-center justify-center rounded-md bg-orange-100">
                <Wallet size={14} color="#F15C22" />
              </View>
              <Text className="text-sm font-bold text-text-main">
                {t('profile.walletsSection')}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsAddWalletModalVisible(true)}
              className="flex-row items-center gap-x-1 rounded-full bg-orange-50 border border-orange-200/80 px-3 py-1"
            >
              <Plus size={13} color="#F15C22" />
              <Text className="text-xs font-bold text-brand">{t('profile.addWallet')}</Text>
            </TouchableOpacity>
          </View>

          {wallets.length === 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsAddWalletModalVisible(true)}
              className="bg-white rounded-3xl p-5 border border-dashed border-gray-200 items-center justify-center shadow-sm"
            >
              <View className="h-12 w-12 rounded-full bg-orange-50 items-center justify-center mb-2.5">
                <Wallet size={22} color="#F15C22" />
              </View>
              <Text className="text-sm font-bold text-text-main">
                {t('profile.emptyWalletsTitle')}
              </Text>
              <Text className="text-xs text-text-muted mt-1 text-center font-sans">
                {t('profile.emptyWalletsSub')}
              </Text>
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {wallets.map((wallet) => (
                <View
                  key={wallet.id}
                  className="w-40 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mr-3"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    {wallet.type === 'bank' && <CreditCard size={18} color="#92400E" />}
                    {wallet.type === 'wallet' && <QrCode size={18} color="#BE185D" />}
                    {wallet.type === 'cash' && (
                      <View className="h-5 w-5 items-center justify-center rounded-md bg-emerald-100">
                        <Text className="text-xs">💵</Text>
                      </View>
                    )}
                    <View className="rounded-full bg-orange-50 px-2 py-0.5">
                      <Text className="text-[10px] font-bold text-brand">
                        {wallet.type === 'bank'
                          ? t('profile.typeBank')
                          : wallet.type === 'wallet'
                            ? t('profile.typeWallet')
                            : t('profile.typeCash')}
                      </Text>
                    </View>
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-xs text-text-muted font-medium font-sans"
                  >
                    {wallet.name}
                  </Text>
                  <Text numberOfLines={1} className="mt-1 text-sm font-extrabold text-text-main">
                    {formatCurrency(wallet.balance)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Section: Cài đặt & Bảo mật */}
        <View className="mb-6">
          <View className="flex-row items-center gap-x-2.5 mb-3 px-1">
            <Sliders size={16} color="#F15C22" />
            <Text className="text-sm font-bold text-text-main">
              {t('profile.securitySection')}
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
            {/* Quyền Push Notification */}
            <SettingRow
              icon={<BellRing size={20} color="#F97316" />}
              iconBgColor="bg-orange-50"
              title={t('profile.pushNotification')}
              subtitle={t('profile.pushNotificationSub')}
              rightElement={
                <Switch
                  value={pushNotificationEnabled}
                  onValueChange={handleTogglePushNotification}
                  trackColor={{ false: '#E5E7EB', true: '#F15C22' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <View className="h-px bg-gray-100 my-1" />

            {/* Khóa Face ID / Vân tay */}
            <View style={{ opacity: isBiometricSupported ? 1 : 0.55 }}>
              <SettingRow
                icon={<Fingerprint size={20} color={isBiometricSupported ? '#8B5CF6' : '#9CA3AF'} />}
                iconBgColor={isBiometricSupported ? 'bg-purple-50' : 'bg-gray-100'}
                title={t('profile.biometric')}
                subtitle={
                  isBiometricSupported
                    ? t('profile.biometricSub')
                    : t('profile.biometricUnsupported')
                }
                rightElement={
                  <Switch
                    value={isBiometricSupported && faceIdEnabled}
                    onValueChange={handleToggleBiometric}
                    disabled={!isBiometricSupported}
                    trackColor={{ false: '#E5E7EB', true: '#F15C22' }}
                    thumbColor="#FFFFFF"
                  />
                }
              />
            </View>
            <View className="h-px bg-gray-100 my-1" />

            <SettingRow
              icon={<Bell size={20} color="#3B82F6" />}
              iconBgColor="bg-blue-50"
              title={t('profile.reminder')}
              subtitle={t('profile.reminderSub', { time: reminderTime })}
              onPress={() => {
                if (reminderEnabled) setIsReminderModalVisible(true);
              }}
              rightElement={
                <Switch
                  value={reminderEnabled}
                  onValueChange={handleToggleReminder}
                  trackColor={{ false: '#E5E7EB', true: '#F15C22' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <View className="h-px bg-gray-100 my-1" />

            <SettingRow
              icon={<Coins size={20} color="#E11D48" />}
              iconBgColor="bg-rose-50"
              title={t('profile.currency')}
              subtitle={t('profile.currencySub')}
              rightElement={
                <View className="flex-row items-center">
                  <Text className="text-xs font-semibold text-text-muted mr-1.5 font-sans">
                    {activeCurrencyObj.flag} {activeCurrencyObj.code} ({activeCurrencyObj.symbol})
                  </Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              }
              onPress={() => setIsCurrencyModalVisible(true)}
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
                    {getLanguageDisplayName(currentLang)}
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
          <View className="flex-row items-center gap-x-2.5 mb-3 px-1">
            <HelpCircle size={16} color="#F15C22" />
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
              onPress={() => setIsFeedbackModalVisible(true)}
            />
            <View className="h-px bg-gray-100 my-1" />

            <SettingRow
              icon={<Heart size={20} color="#EC4899" />}
              iconBgColor="bg-pink-50"
              title={t('profile.about')}
              subtitle={t('profile.aboutSub')}
              onPress={() => router.push('/about' as any)}
            />
          </View>
        </View>

        {/* Đăng xuất button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          disabled={isLoggingOut}
          className="h-14 w-full flex-row items-center justify-center gap-x-2.5 rounded-2xl bg-red-50 border border-red-200/70 shadow-sm mb-4"
        >
          <LogOut size={18} color="#EF4444" />
          <Text className="text-base font-bold text-red-500">
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
              <Text className="text-lg font-bold text-text-main">
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
              className={`flex-row items-center justify-between py-3.5 border-b border-gray-50 ${
                currentLang === 'vi' ? 'bg-orange-50/50 rounded-xl px-3' : 'px-3'
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🇻🇳</Text>
                <View>
                  <Text className="text-sm font-bold text-text-main">Tiếng Việt</Text>
                  <Text className="text-xs text-text-muted font-sans">Việt Nam</Text>
                </View>
              </View>
              {currentLang === 'vi' && <Check size={20} color="#F15C22" strokeWidth={2.5} />}
            </TouchableOpacity>

            {/* English */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectLanguage('en')}
              className={`flex-row items-center justify-between py-3.5 border-b border-gray-50 ${
                currentLang === 'en' ? 'bg-orange-50/50 rounded-xl px-3' : 'px-3'
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🇬🇧</Text>
                <View>
                  <Text className="text-sm font-bold text-text-main">English</Text>
                  <Text className="text-xs text-text-muted font-sans">Global / US</Text>
                </View>
              </View>
              {currentLang === 'en' && <Check size={20} color="#F15C22" strokeWidth={2.5} />}
            </TouchableOpacity>

            {/* 中文 */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectLanguage('zh')}
              className={`flex-row items-center justify-between py-3.5 border-b border-gray-50 ${
                currentLang === 'zh' ? 'bg-orange-50/50 rounded-xl px-3' : 'px-3'
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🇨🇳</Text>
                <View>
                  <Text className="text-sm font-bold text-text-main">中文</Text>
                  <Text className="text-xs text-text-muted font-sans">简体中文 (China)</Text>
                </View>
              </View>
              {currentLang === 'zh' && <Check size={20} color="#F15C22" strokeWidth={2.5} />}
            </TouchableOpacity>

            {/* 한국어 */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectLanguage('ko')}
              className={`flex-row items-center justify-between py-3.5 border-b border-gray-50 ${
                currentLang === 'ko' ? 'bg-orange-50/50 rounded-xl px-3' : 'px-3'
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🇰🇷</Text>
                <View>
                  <Text className="text-sm font-bold text-text-main">한국어</Text>
                  <Text className="text-xs text-text-muted font-sans">대한민국 (Korea)</Text>
                </View>
              </View>
              {currentLang === 'ko' && <Check size={20} color="#F15C22" strokeWidth={2.5} />}
            </TouchableOpacity>

            {/* 日本語 */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectLanguage('ja')}
              className={`flex-row items-center justify-between py-3.5 ${
                currentLang === 'ja' ? 'bg-orange-50/50 rounded-xl px-3' : 'px-3'
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🇯🇵</Text>
                <View>
                  <Text className="text-sm font-bold text-text-main">日本語</Text>
                  <Text className="text-xs text-text-muted font-sans">日本 (Japan)</Text>
                </View>
              </View>
              {currentLang === 'ja' && <Check size={20} color="#F15C22" strokeWidth={2.5} />}
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

            <Text className="text-lg font-bold text-text-main text-center mb-2">
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
                <Text className="text-sm font-semibold text-text-main">
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
                  <Text className="text-sm font-bold text-white">
                    {t('profile.logoutButton')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal Thêm Nguồn Tiền Mới */}
      <Modal
        visible={isAddWalletModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddWalletModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setIsAddWalletModalVisible(false)}
          />
          <View className="bg-white rounded-t-3xl px-6 pt-5 pb-8 shadow-2xl">
            <View className="flex-row items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <Text className="text-lg font-bold text-text-main">
                {t('profile.modalAddSourceTitle')}
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddWalletModalVisible(false)}
                className="p-1"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Chọn loại nguồn tiền */}
            <Text className="text-xs font-semibold text-text-muted mb-2 font-sans">
              {t('profile.sourceTypeLabel')}
            </Text>
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setNewWalletType('bank')}
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${
                  newWalletType === 'bank'
                    ? 'border-brand bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <CreditCard size={15} color={newWalletType === 'bank' ? '#F15C22' : '#6B7280'} />
                <Text
                  className={`ml-1.5 text-xs font-bold ${
                    newWalletType === 'bank' ? 'text-brand' : 'text-text-main'
                  }`}
                >
                  {t('profile.typeBank')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setNewWalletType('wallet')}
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${
                  newWalletType === 'wallet'
                    ? 'border-brand bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <QrCode size={15} color={newWalletType === 'wallet' ? '#F15C22' : '#6B7280'} />
                <Text
                  className={`ml-1.5 text-xs font-bold ${
                    newWalletType === 'wallet' ? 'text-brand' : 'text-text-main'
                  }`}
                >
                  {t('profile.typeWallet')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setNewWalletType('cash')}
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${
                  newWalletType === 'cash'
                    ? 'border-brand bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Text className="text-sm">💵</Text>
                <Text
                  className={`ml-1 text-xs font-bold ${
                    newWalletType === 'cash' ? 'text-brand' : 'text-text-main'
                  }`}
                >
                  {t('profile.typeCash')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nhập tên nguồn tiền */}
            <Text className="text-xs font-semibold text-text-muted mb-1.5 font-sans">
              {t('profile.sourceNameLabel')}
            </Text>
            <View className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 justify-center mb-4">
              <TextInput
                value={newWalletName}
                onChangeText={setNewWalletName}
                placeholder={t('profile.sourceNamePlaceholder')}
                placeholderTextColor="#9CA3AF"
                className="text-sm text-text-main font-sans"
              />
            </View>

            {/* Nhập số dư ban đầu */}
            <Text className="text-xs font-semibold text-text-muted mb-1.5 font-sans">
              {t('profile.initialBalanceLabel')}
            </Text>
            <View className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 justify-center mb-6">
              <TextInput
                value={newWalletBalance}
                onChangeText={setNewWalletBalance}
                keyboardType="numeric"
                placeholder={t('profile.initialBalancePlaceholder')}
                placeholderTextColor="#9CA3AF"
                className="text-sm text-text-main font-sans font-bold"
              />
            </View>

            {/* Nút lưu */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsAddWalletModalVisible(false)}
                className="flex-1 h-12 rounded-2xl bg-gray-100 items-center justify-center"
              >
                <Text className="text-sm font-semibold text-text-main">
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCreateWallet}
                className="flex-1 h-12 rounded-2xl bg-brand items-center justify-center shadow-sm"
              >
                <Text className="text-sm font-bold text-white">
                  {t('profile.confirmAddSource')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Cài Đặt Giờ Nhắc Nhở Ghi Chép */}
      <Modal
        visible={isReminderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsReminderModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl items-center">
            <View className="h-16 w-16 rounded-full bg-blue-50 border border-blue-100 items-center justify-center mb-3">
              <Clock size={28} color="#3B82F6" />
            </View>

            <Text className="text-lg font-bold text-text-main text-center mb-1">
              {t('profile.reminderModalTitle')}
            </Text>

            <Text className="text-xs text-text-muted text-center font-sans mb-5">
              {t('profile.reminderModalDesc')}
            </Text>

            {/* Quick time selection pills */}
            <View className="w-full flex-row flex-wrap gap-2 justify-center mb-6">
              {['20:00', '20:30', '21:00', '21:30', '22:00', '22:30'].map((time) => (
                <TouchableOpacity
                  key={time}
                  activeOpacity={0.7}
                  onPress={() => handleSelectReminderTime(time)}
                  className={`px-4 py-2.5 rounded-xl border ${
                    reminderTime === time
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      reminderTime === time ? 'text-blue-600' : 'text-text-main'
                    }`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsReminderModalVisible(false)}
              className="w-full h-12 rounded-2xl bg-gray-100 items-center justify-center"
            >
              <Text className="text-sm font-semibold text-text-main">
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Chọn Đơn vị tiền tệ (Currency Switcher Sheet) */}
      <Modal
        visible={isCurrencyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCurrencyModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setIsCurrencyModalVisible(false)}
          />
          <View className="bg-white rounded-t-3xl px-6 pt-5 pb-8 shadow-2xl">
            <View className="flex-row items-center justify-between pb-4 border-b border-gray-100 mb-2">
              <Text className="text-lg font-bold text-text-main">
                {t('profile.currencyModalTitle')}
              </Text>
              <TouchableOpacity
                onPress={() => setIsCurrencyModalVisible(false)}
                className="p-1"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {CURRENCIES.map((curr) => {
              const isSelected = currentCurrency === curr.code;
              return (
                <TouchableOpacity
                  key={curr.code}
                  activeOpacity={0.7}
                  onPress={() => handleSelectCurrency(curr)}
                  className={`flex-row items-center justify-between py-3.5 border-b border-gray-50 ${
                    isSelected ? 'bg-orange-50/50 rounded-xl px-3' : 'px-3'
                  }`}
                >
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">{curr.flag}</Text>
                    <View>
                      <Text className="text-sm font-bold text-text-main">
                        {curr.name} ({curr.code})
                      </Text>
                      <Text className="text-xs text-text-muted font-sans">
                        {curr.symbol} • {curr.locale}
                      </Text>
                    </View>
                  </View>
                  {isSelected && <Check size={20} color="#F15C22" strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Modal Góp ý & Báo lỗi (Feedback & Bug Report Modal) */}
      <Modal
        visible={isFeedbackModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFeedbackModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setIsFeedbackModalVisible(false)}
          />
          <View className="bg-white rounded-t-3xl px-6 pt-5 pb-8 shadow-2xl">
            <View className="flex-row items-center justify-between pb-4 border-b border-gray-100 mb-3">
              <Text className="text-lg font-bold text-text-main">
                {t('profile.feedbackModalTitle')}
              </Text>
              <TouchableOpacity
                onPress={() => setIsFeedbackModalVisible(false)}
                className="p-1"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Subject input */}
            <Text className="text-xs font-semibold text-text-muted mb-1.5 font-sans">
              {t('profile.feedbackTitleLabel')}
            </Text>
            <View className="h-11 w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 justify-center mb-3">
              <TextInput
                value={feedbackTitle}
                onChangeText={setFeedbackTitle}
                placeholder={t('profile.feedbackTitlePlaceholder')}
                placeholderTextColor="#9CA3AF"
                className="text-xs text-text-main font-sans"
              />
            </View>

            {/* Content input */}
            <Text className="text-xs font-semibold text-text-muted mb-1.5 font-sans">
              {t('profile.feedbackContentLabel')} *
            </Text>
            <View className="h-28 w-full rounded-2xl bg-gray-50 border border-gray-200 p-3 mb-5">
              <TextInput
                value={feedbackContent}
                onChangeText={setFeedbackContent}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder={t('profile.feedbackContentPlaceholder')}
                placeholderTextColor="#9CA3AF"
                className="text-xs text-text-main font-sans flex-1"
              />
            </View>

            {/* Action buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsFeedbackModalVisible(false)}
                className="flex-1 h-12 rounded-2xl bg-gray-100 items-center justify-center"
              >
                <Text className="text-sm font-semibold text-text-main">
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
                className="flex-1 h-12 rounded-2xl bg-brand items-center justify-center shadow-sm flex-row gap-1.5"
              >
                {isSubmittingFeedback ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Send size={15} color="#FFFFFF" />
                    <Text className="text-sm font-bold text-white">
                      {t('profile.feedbackSubmitButton')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
