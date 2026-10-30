import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  Lock,
  Mail,
  Phone,
  User,
  X,
} from 'lucide-react-native';

import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { getItem, setItem } from '@/lib/secure-storage';
import { STORAGE_KEYS } from '@/lib/constants';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

const AVATAR_OPTIONS = [
  { id: '🐱', label: 'Miu Miu' },
  { id: '🐶', label: 'Corgi' },
  { id: '🦊', label: 'Fox' },
  { id: '🐼', label: 'Panda' },
  { id: '🐰', label: 'Bunny' },
  { id: '🐾', label: 'Paw' },
];

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

export default function EditProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  // Profile fields state
  const [fullNameInput, setFullNameInput] = useState(user?.fullName || '');
  const [phoneInput, setPhoneInput] = useState(user?.phoneNumber || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || '🐱');
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // Change password section expansion state
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);

  // Change password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Touched state to track fields the user has interacted with
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Field validation errors state (display inline under inputs)
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [isSaving, setIsSaving] = useState(false);

  const email = user?.email || '';

  // Load avatar from storage on mount if available
  useEffect(() => {
    getItem(STORAGE_KEYS.AVATAR).then((saved) => {
      if (saved) {
        setSelectedAvatar(saved);
      } else if (user?.avatarUrl) {
        setSelectedAvatar(user.avatarUrl);
      }
    });
  }, [user?.avatarUrl]);

  // Validation functions (run onBlur and real-time onChange)
  const validateFullName = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setErrors((prev) => ({ ...prev, fullName: t('profile.fullNameEmptyError') }));
      return false;
    }
    setErrors((prev) => ({ ...prev, fullName: undefined }));
    return true;
  };

  const validatePhone = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
      return true;
    }
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(trimmed)) {
      setErrors((prev) => ({ ...prev, phone: t('profile.phoneInvalidError') }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: undefined }));
    return true;
  };

  const validateCurrentPassword = (curr: string, nextPass: string) => {
    if (nextPass.trim() && !curr.trim()) {
      setErrors((prev) => ({ ...prev, currentPassword: t('profile.oldPasswordEmptyError') }));
      return false;
    }
    setErrors((prev) => ({ ...prev, currentPassword: undefined }));
    return true;
  };

  const validateNewPassword = (nextPass: string, curr: string) => {
    if (!nextPass) {
      setErrors((prev) => ({ ...prev, newPassword: undefined }));
      return true;
    }
    if (nextPass.length < 8) {
      setErrors((prev) => ({ ...prev, newPassword: t('profile.newPasswordLengthError') }));
      return false;
    }
    if (curr && nextPass === curr) {
      setErrors((prev) => ({ ...prev, newPassword: t('profile.passwordSameAsOldError') }));
      return false;
    }
    setErrors((prev) => ({ ...prev, newPassword: undefined }));
    return true;
  };

  const validateConfirmPassword = (confirm: string, nextPass: string) => {
    if (!confirm) {
      if (nextPass) {
        setErrors((prev) => ({ ...prev, confirmPassword: t('profile.confirmPasswordEmptyError') }));
        return false;
      }
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      return true;
    }
    if (confirm !== nextPass) {
      setErrors((prev) => ({ ...prev, confirmPassword: t('profile.passwordsDoNotMatchError') }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    return true;
  };

  // Companion days from user.companionDays, or calculated from user.createdAt, or fallback to 142
  const [companionDays] = useState(() => {
    if (user?.companionDays) return user.companionDays;
    if (user?.createdAt) {
      const createdTime = new Date(user.createdAt).getTime();
      if (!isNaN(createdTime)) {
        const diffMs = Date.now() - createdTime;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return Math.max(1, days + 1);
      }
    }
    return 142;
  });

  const handlePickImageFromLibrary = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast({
          type: 'error',
          title: t('common.notice'),
          message: 'Vui lòng cấp quyền truy cập thư viện ảnh để thay đổi hình đại diện.',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedAvatar(uri);
        setIsAvatarModalVisible(false);
      }
    } catch {
      showToast({
        type: 'error',
        title: t('common.error'),
        message: 'Không thể mở thư viện ảnh.',
      });
    }
  };

  const handleSave = async () => {
    const isNameValid = validateFullName(fullNameInput);
    const isPhoneValid = validatePhone(phoneInput);

    let isPasswordValid = true;
    const wantsPasswordChange =
      isPasswordExpanded &&
      (currentPassword.trim() !== '' ||
        newPassword.trim() !== '' ||
        confirmPassword.trim() !== '');

    if (wantsPasswordChange) {
      const isCurrValid = validateCurrentPassword(currentPassword, newPassword);
      const isNewValid = validateNewPassword(newPassword, currentPassword);
      const isConfValid = validateConfirmPassword(confirmPassword, newPassword);
      if (!isCurrValid || !isNewValid || !isConfValid) {
        isPasswordValid = false;
      }
    }

    if (!isNameValid || !isPhoneValid || !isPasswordValid) {
      setTouched({
        fullName: true,
        phone: true,
        currentPassword: true,
        newPassword: true,
        confirmPassword: true,
      });
      return;
    }

    setIsSaving(true);
    const trimmedName = fullNameInput.trim();
    const trimmedPhone = phoneInput.trim();

    try {
      // 1. If password was provided, call backend API
      if (wantsPasswordChange) {
        await authService.changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });
      }

      // 2. Call backend updateProfile API
      let updatedUserFromApi: any = null;
      try {
        const res = await userService.updateProfile({
          fullName: trimmedName,
          phoneNumber: trimmedPhone || null,
        });
        updatedUserFromApi = res.data;
      } catch (profileErr: any) {
        console.warn('[EditProfile] updateProfile API error:', profileErr);
        if (profileErr?.response?.data?.message) {
          throw profileErr;
        }
      }

      // 3. Persist avatar in local storage so it survives app restarts
      await setItem(STORAGE_KEYS.AVATAR, selectedAvatar);

      // 4. Update user profile state in Zustand and storage
      updateUser({
        fullName: updatedUserFromApi?.fullName || trimmedName,
        phoneNumber:
          updatedUserFromApi?.phoneNumber !== undefined
            ? updatedUserFromApi.phoneNumber
            : trimmedPhone || null,
        avatarUrl: selectedAvatar,
        companionDays: updatedUserFromApi?.companionDays ?? user?.companionDays,
      });

      showToast({
        type: 'success',
        title: t('common.success'),
        message: wantsPasswordChange
          ? `${t('profile.profileUpdatedSuccess')} & ${t('profile.passwordChangedSuccess')}`
          : t('profile.profileUpdatedSuccess'),
      });

      // Quay về màn hình Tôi (Me)
      router.replace('/(tabs)/profile');
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || t('profile.changePasswordFailed');
      showToast({
        type: 'error',
        title: t('common.error'),
        message: errMsg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF7F2]">
      {/* Header bar with Back button */}
      <View className="bg-white px-5 py-3.5 flex-row items-center border-b border-gray-100 shadow-xs">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.replace('/(tabs)/profile')}
          className="mr-3 p-1.5 -ml-1 rounded-full active:bg-gray-100"
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-base font-extrabold text-gray-900 flex-1" numberOfLines={1}>
          {t('profile.editProfilePageTitle')}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* Avatar Section */}
          <View className="items-center py-6">
            <View className="relative">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsAvatarModalVisible(true)}
                className="h-24 w-24 rounded-full overflow-hidden border-2 border-amber-200 bg-amber-50 items-center justify-center shadow-sm"
              >
                {isImageUri(selectedAvatar) ? (
                  <Image
                    source={{ uri: selectedAvatar }}
                    style={{ width: 96, height: 96 }}
                    resizeMode="cover"
                  />
                ) : selectedAvatar && selectedAvatar !== '🐱' ? (
                  <Text className="text-4xl">{selectedAvatar}</Text>
                ) : (
                  <Image
                    source={MIU_MIU_IMAGE}
                    style={{ width: 72, height: 72 }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>

              {/* Camera badge button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsAvatarModalVisible(true)}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-brand items-center justify-center border-2 border-white shadow-sm"
              >
                <Camera size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsAvatarModalVisible(true)}
              className="mt-3 flex-row items-center"
            >
              <Text className="text-sm font-bold text-brand mr-1">
                {t('profile.changeAvatarTitle')}
              </Text>
              <ChevronDown size={14} color="#F15C22" />
            </TouchableOpacity>

            <Text className="mt-1 text-xs text-gray-400 font-sans">
              {t('profile.companionWithMiuMiu', { days: companionDays })}
            </Text>
          </View>

          {/* Section: Thông tin cá nhân */}
          <View className="mx-5 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 font-sans">
              {t('profile.basicInfoSection')}
            </Text>

            {/* Field: Họ và tên */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                {t('profile.fullNameLabel')} *
              </Text>
              <View
                className={`flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] px-4 border ${
                  errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-gray-200/80'
                }`}
              >
                <User size={18} color={errors.fullName ? '#EF4444' : '#6B7280'} />
                <TextInput
                  value={fullNameInput}
                  onChangeText={(val) => {
                    setFullNameInput(val);
                    if (touched.fullName) validateFullName(val);
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, fullName: true }));
                    validateFullName(fullNameInput);
                  }}
                  placeholder={t('profile.fullNamePlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-3 text-sm text-gray-900 font-sans"
                />
              </View>
              {errors.fullName ? (
                <Text className="text-xs text-red-500 mt-1 font-sans">{errors.fullName}</Text>
              ) : null}
            </View>

            {/* Field: Địa chỉ Email (Chỉ đọc) */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                {t('profile.emailAddressLabel')}
              </Text>
              <View className="flex-row items-center h-12 rounded-2xl bg-gray-50 border border-gray-200/60 px-4">
                <Mail size={18} color="#9CA3AF" />
                <Text className="flex-1 ml-3 text-sm text-gray-500 font-sans" numberOfLines={1}>
                  {email || 'Chưa cập nhật email'}
                </Text>
              </View>
              <Text className="mt-1 text-[11px] text-gray-400 font-sans">
                {t('profile.emailCantChangeNotice')}
              </Text>
            </View>

            {/* Field: Số điện thoại */}
            <View>
              <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                {t('profile.phoneNumberLabel')}
              </Text>
              <View
                className={`flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] px-4 border ${
                  errors.phone ? 'border-red-400 bg-red-50/20' : 'border-gray-200/80'
                }`}
              >
                <Phone size={18} color={errors.phone ? '#EF4444' : '#6B7280'} />
                <TextInput
                  value={phoneInput}
                  onChangeText={(val) => {
                    setPhoneInput(val);
                    if (touched.phone) validatePhone(val);
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, phone: true }));
                    validatePhone(phoneInput);
                  }}
                  placeholder={t('profile.phoneNumberPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  className="flex-1 ml-3 text-sm text-gray-900 font-sans"
                />
              </View>
              {errors.phone ? (
                <Text className="text-xs text-red-500 mt-1 font-sans">{errors.phone}</Text>
              ) : null}
            </View>
          </View>

          {/* Section: Đổi mật khẩu (Collapsible Card) */}
          <View className="mx-5 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPasswordExpanded(!isPasswordExpanded)}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 pr-2">
                <View className="h-9 w-9 rounded-xl bg-orange-50 items-center justify-center mr-3 border border-orange-100">
                  <Lock size={17} color="#F15C22" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-gray-900">
                    {t('profile.changePasswordCardTitle')}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5 font-sans">
                    {isPasswordExpanded
                      ? t('profile.changePasswordCardSub')
                      : t('profile.changePasswordTapToExpand')}
                  </Text>
                </View>
              </View>

              <View className="h-7 w-7 rounded-full bg-gray-50 items-center justify-center border border-gray-200">
                {isPasswordExpanded ? (
                  <ChevronUp size={16} color="#6B7280" />
                ) : (
                  <ChevronDown size={16} color="#6B7280" />
                )}
              </View>
            </TouchableOpacity>

            {/* Expandable Password Inputs */}
            {isPasswordExpanded && (
              <View className="mt-4 pt-4 border-t border-gray-100">
                {/* Field: Mật khẩu hiện tại */}
                <View className="mb-3.5">
                  <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                    {t('profile.currentPasswordLabel')}
                  </Text>
                  <View
                    className={`flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] px-4 border ${
                      errors.currentPassword ? 'border-red-400 bg-red-50/20' : 'border-gray-200/80'
                    }`}
                  >
                    <KeyRound size={18} color={errors.currentPassword ? '#EF4444' : '#6B7280'} />
                    <TextInput
                      value={currentPassword}
                      onChangeText={(val) => {
                        setCurrentPassword(val);
                        if (touched.currentPassword) validateCurrentPassword(val, newPassword);
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, currentPassword: true }));
                        validateCurrentPassword(currentPassword, newPassword);
                      }}
                      secureTextEntry={!showCurrentPassword}
                      placeholder={t('profile.currentPasswordPlaceholder')}
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 ml-3 text-sm text-gray-900 font-sans"
                    />
                    <TouchableOpacity
                      onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="p-1"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={16} color="#6B7280" />
                      ) : (
                        <Eye size={16} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.currentPassword ? (
                    <Text className="text-xs text-red-500 mt-1 font-sans">
                      {errors.currentPassword}
                    </Text>
                  ) : null}
                </View>

                {/* Field: Mật khẩu mới */}
                <View className="mb-3.5">
                  <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                    {t('profile.newPasswordLabel')}
                  </Text>
                  <View
                    className={`flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] px-4 border ${
                      errors.newPassword ? 'border-red-400 bg-red-50/20' : 'border-gray-200/80'
                    }`}
                  >
                    <Lock size={18} color={errors.newPassword ? '#EF4444' : '#6B7280'} />
                    <TextInput
                      value={newPassword}
                      onChangeText={(val) => {
                        setNewPassword(val);
                        if (touched.newPassword) validateNewPassword(val, currentPassword);
                        if (touched.confirmPassword && confirmPassword) {
                          validateConfirmPassword(confirmPassword, val);
                        }
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, newPassword: true }));
                        validateNewPassword(newPassword, currentPassword);
                      }}
                      secureTextEntry={!showNewPassword}
                      placeholder={t('profile.newPasswordPlaceholder')}
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 ml-3 text-sm text-gray-900 font-sans"
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      className="p-1"
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} color="#6B7280" />
                      ) : (
                        <Eye size={16} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.newPassword ? (
                    <Text className="text-xs text-red-500 mt-1 font-sans">
                      {errors.newPassword}
                    </Text>
                  ) : null}
                </View>

                {/* Field: Xác nhận mật khẩu mới */}
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                    {t('profile.confirmPasswordLabel')}
                  </Text>
                  <View
                    className={`flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] px-4 border ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-gray-200/80'
                    }`}
                  >
                    <Lock size={18} color={errors.confirmPassword ? '#EF4444' : '#6B7280'} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={(val) => {
                        setConfirmPassword(val);
                        if (touched.confirmPassword) validateConfirmPassword(val, newPassword);
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, confirmPassword: true }));
                        validateConfirmPassword(confirmPassword, newPassword);
                      }}
                      secureTextEntry={!showConfirmPassword}
                      placeholder={t('profile.confirmPasswordPlaceholder')}
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 ml-3 text-sm text-gray-900 font-sans"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} color="#6B7280" />
                      ) : (
                        <Eye size={16} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword ? (
                    <Text className="text-xs text-red-500 mt-1 font-sans">
                      {errors.confirmPassword}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
          </View>

          {/* Action buttons at bottom */}
          <View className="mx-5 gap-y-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={isSaving}
              className="h-13 py-3.5 rounded-2xl bg-brand items-center justify-center flex-row shadow-sm active:bg-orange-600"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Check size={18} color="#FFFFFF" />
                  <Text className="ml-2 text-white text-sm font-bold">
                    {t('profile.saveProfileChanges')}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace('/(tabs)/profile')}
              className="h-13 py-3.5 rounded-2xl bg-[#EBE5DE] items-center justify-center active:bg-gray-300"
            >
              <Text className="text-[#4A453E] text-sm font-bold">
                {t('profile.cancelButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Avatar Picker Modal */}
      <Modal
        visible={isAvatarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAvatarModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-extrabold text-gray-900">
                {t('profile.chooseAvatar')}
              </Text>
              <TouchableOpacity
                onPress={() => setIsAvatarModalVisible(false)}
                className="p-1"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Option 1: Upload from device photo library */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePickImageFromLibrary}
              className="w-full flex-row items-center p-3.5 rounded-2xl bg-orange-50 border border-orange-200 mb-4"
            >
              <View className="h-10 w-10 rounded-full bg-brand items-center justify-center mr-3 shadow-xs">
                <ImageIcon size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-text-main">
                  {t('profile.chooseFromLibrary')}
                </Text>
                <Text className="text-[11px] text-text-muted mt-0.5 font-sans">
                  JPG, PNG, HEIC
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: Choose Mascot / Emoji */}
            <Text className="text-xs font-semibold text-text-muted mb-3 font-sans">
              {t('profile.defaultMiuMiuAvatar')}
            </Text>
            <View className="flex-row flex-wrap gap-3 justify-center">
              {AVATAR_OPTIONS.map((item) => {
                const isSelected = selectedAvatar === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedAvatar(item.id);
                      setIsAvatarModalVisible(false);
                    }}
                    className={`h-13 w-13 rounded-full items-center justify-center border-2 p-1 ${
                      isSelected
                        ? 'border-brand bg-orange-100 scale-105 shadow-sm'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {item.id === '🐱' ? (
                      <Image
                        source={MIU_MIU_IMAGE}
                        style={{ width: 34, height: 34 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text className="text-2xl">{item.id}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
