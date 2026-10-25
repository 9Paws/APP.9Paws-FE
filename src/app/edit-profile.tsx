import React, { useState } from 'react';
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

  const [isSaving, setIsSaving] = useState(false);

  const email = user?.email || '';
  const fullName = fullNameInput || user?.fullName || 'Người dùng 9Paws';

  // Calculate companion days from user.createdAt or fallback to 142
  const [companionDays] = useState(() => {
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
        setSelectedAvatar(result.assets[0].uri);
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
    const trimmedName = fullNameInput.trim();
    if (!trimmedName) {
      showToast({
        type: 'error',
        title: t('common.error'),
        message: t('profile.fullNameEmptyError'),
      });
      return;
    }

    // Check if user wants to change password
    const wantsPasswordChange =
      isPasswordExpanded &&
      (currentPassword.trim() !== '' ||
        newPassword.trim() !== '' ||
        confirmPassword.trim() !== '');

    if (wantsPasswordChange) {
      if (!currentPassword.trim()) {
        showToast({
          type: 'error',
          title: t('common.error'),
          message: t('profile.oldPasswordEmptyError'),
        });
        return;
      }

      if (newPassword.length < 8) {
        showToast({
          type: 'error',
          title: t('common.error'),
          message: t('profile.newPasswordLengthError'),
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast({
          type: 'error',
          title: t('common.error'),
          message: t('profile.passwordsDoNotMatchError'),
        });
        return;
      }

      if (newPassword === currentPassword) {
        showToast({
          type: 'error',
          title: t('common.error'),
          message: t('profile.passwordSameAsOldError'),
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      // 1. If password was provided, call backend API
      if (wantsPasswordChange) {
        await authService.changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });
      }

      // 2. Update user profile state in Zustand and storage
      updateUser({
        fullName: trimmedName,
        phoneNumber: phoneInput.trim() || null,
        avatarUrl: selectedAvatar,
      });

      showToast({
        type: 'success',
        title: t('common.success'),
        message: wantsPasswordChange
          ? `${t('profile.profileUpdatedSuccess')} & ${t('profile.passwordChangedSuccess')}`
          : t('profile.profileUpdatedSuccess'),
      });

      router.back();
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
      {/* Header bar with Back button and Quick Save */}
      <View className="bg-white px-5 py-3.5 flex-row items-center justify-between border-b border-gray-100 shadow-xs">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="mr-3 p-1.5 -ml-1 rounded-full active:bg-gray-100"
          >
            <ArrowLeft size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-base font-extrabold text-gray-900 font-bold" numberOfLines={1}>
            {t('profile.editProfilePageTitle')}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSave}
          disabled={isSaving}
          className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#F15C22" />
          ) : (
            <Text className="text-xs font-bold text-brand">
              {t('common.confirm')}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
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
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#FF6B35] items-center justify-center border-2 border-white shadow-md"
              >
                <Camera size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* User Full Name */}
            <Text className="text-lg font-extrabold text-gray-900 mt-3 font-bold">
              {fullName}
            </Text>

            {/* Companion Badge */}
            <View className="flex-row items-center bg-[#E8EDFB] rounded-full px-3.5 py-1 mt-1.5 border border-[#D5E1F9]">
              <Text className="text-xs mr-1">🐾</Text>
              <Text className="text-xs font-semibold text-[#3B5998]">
                {t('profile.companionBadge', { days: companionDays })}
              </Text>
            </View>
          </View>

          {/* Card 1: Thông tin hồ sơ */}
          <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mx-5 mb-5">
            <Text className="text-base font-extrabold text-gray-900 mb-4 font-bold">
              {t('profile.profileInfoCardTitle')}
            </Text>

            {/* Field: Họ và tên */}
            <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
              {t('profile.fullNameLabel')} *
            </Text>
            <View className="flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] border border-gray-200/80 px-4 mb-3.5">
              <User size={18} color="#6B7280" />
              <TextInput
                value={fullNameInput}
                onChangeText={setFullNameInput}
                placeholder={t('profile.fullNamePlaceholder')}
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900 font-sans"
              />
            </View>

            {/* Field: Địa chỉ Email (không còn badge Đã xác thực) */}
            <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
              {t('profile.emailLabel')}
            </Text>
            <View className="flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] border border-gray-200/80 px-4 mb-3.5 opacity-90">
              <Mail size={18} color="#6B7280" />
              <TextInput
                value={email}
                editable={false}
                className="flex-1 ml-3 text-sm text-gray-500 font-sans"
              />
            </View>

            {/* Field: Số điện thoại liên hệ */}
            <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
              {t('profile.phoneNumberLabel')}
            </Text>
            <View className="flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] border border-gray-200/80 px-4">
              <Phone size={18} color="#6B7280" />
              <TextInput
                value={phoneInput}
                onChangeText={setPhoneInput}
                keyboardType="phone-pad"
                placeholder={t('profile.phoneNumberPlaceholder')}
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900 font-sans"
              />
            </View>
          </View>

          {/* Card 2: Đổi mật khẩu (Collapsible Card để tối ưu UX) */}
          <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mx-5 mb-6">
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
                  <Text className="text-base font-extrabold text-gray-900 font-bold">
                    {t('profile.changePasswordCardTitle')}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5 font-sans" numberOfLines={1}>
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
                <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                  {t('profile.currentPasswordLabel')}
                </Text>
                <View className="flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] border border-gray-200/80 px-4 mb-3.5">
                  <KeyRound size={18} color="#6B7280" />
                  <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
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

                {/* Field: Mật khẩu mới */}
                <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                  {t('profile.newPasswordLabel')}
                </Text>
                <View className="flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] border border-gray-200/80 px-4 mb-3.5">
                  <Lock size={18} color="#6B7280" />
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
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

                {/* Field: Xác nhận mật khẩu mới */}
                <Text className="text-xs font-bold text-gray-700 mb-1.5 font-sans">
                  {t('profile.confirmPasswordLabel')}
                </Text>
                <View className="flex-row items-center h-12 rounded-2xl bg-[#F8F9FE] border border-gray-200/80 px-4">
                  <Lock size={18} color="#6B7280" />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
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
              </View>
            )}
          </View>

          {/* Bottom Action Buttons */}
          <View className="px-5 gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={isSaving}
              className="h-13 py-3.5 rounded-2xl bg-[#FF6B35] items-center justify-center flex-row shadow-sm active:bg-orange-600"
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Check size={18} color="#FFFFFF" />
                  <Text className="ml-2 text-white font-bold text-sm font-bold">
                    {t('profile.saveProfileChanges')}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="h-13 py-3.5 rounded-2xl bg-[#EBE5DE] items-center justify-center active:bg-gray-300"
            >
              <Text className="text-[#4A453E] font-bold text-sm font-bold">
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
              <Text className="text-base font-extrabold text-gray-900 font-bold">
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
                <Text className="text-sm font-bold text-text-main font-bold">
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
