import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Clock,
  Fingerprint,
  Heart,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react-native';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-[#FAF7F2]">
      {/* Top Header Bar */}
      <View className="bg-white px-5 py-3.5 flex-row items-center border-b border-gray-100 shadow-xs">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="mr-3 p-1.5 -ml-1 rounded-full active:bg-gray-100"
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-base font-extrabold text-gray-900 font-bold">
          {t('profile.aboutPageTitle')}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* App Hero Card */}
        <View className="items-center pt-8 pb-6 px-6">
          <View className="h-24 w-24 rounded-full overflow-hidden bg-amber-100 border-2 border-amber-200 items-center justify-center mb-3.5 shadow-sm">
            <Image
              source={MIU_MIU_IMAGE}
              style={{ width: 72, height: 72 }}
              resizeMode="contain"
            />
          </View>

          <Text className="text-2xl font-black text-gray-900 font-bold tracking-tight">
            9Paws
          </Text>

          <View className="rounded-full bg-orange-100 px-3 py-1 mt-1.5 mb-2 border border-orange-200/80">
            <Text className="text-xs font-bold text-brand">
              {t('profile.aboutAppVersion')}
            </Text>
          </View>

          <Text className="text-xs text-text-muted text-center font-sans max-w-xs">
            {t('profile.aboutTagline')}
          </Text>
        </View>

        {/* Section 1: Sứ mệnh của 9Paws */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mx-5 mb-5">
          <View className="flex-row items-center gap-2 mb-2.5">
            <View className="h-7 w-7 rounded-xl bg-orange-50 items-center justify-center border border-orange-100">
              <Sparkles size={15} color="#F15C22" />
            </View>
            <Text className="text-sm font-extrabold text-gray-900 font-bold">
              {t('profile.missionTitle')}
            </Text>
          </View>
          <Text className="text-xs text-text-muted leading-5 font-sans">
            {t('profile.missionContent')}
          </Text>
        </View>

        {/* Section 2: Cam kết bảo vệ quyền riêng tư & bảo mật */}
        <View className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm mx-5 mb-5">
          <View className="flex-row items-center gap-2 mb-3.5">
            <View className="h-7 w-7 rounded-xl bg-emerald-50 items-center justify-center border border-emerald-200">
              <ShieldCheck size={16} color="#059669" />
            </View>
            <Text className="text-sm font-extrabold text-emerald-800 font-bold">
              {t('profile.privacyTitle')}
            </Text>
          </View>

          {/* Commitment 1 */}
          <View className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 mb-2.5">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Lock size={14} color="#059669" />
              <Text className="text-xs font-bold text-emerald-900 font-bold">
                {t('profile.privacyCommitment1Title')}
              </Text>
            </View>
            <Text className="text-[11px] text-emerald-700 leading-4 font-sans">
              {t('profile.privacyCommitment1Desc')}
            </Text>
          </View>

          {/* Commitment 2 */}
          <View className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 mb-2.5">
            <View className="flex-row items-center gap-1.5 mb-1">
              <ShieldCheck size={14} color="#059669" />
              <Text className="text-xs font-bold text-emerald-900 font-bold">
                {t('profile.privacyCommitment2Title')}
              </Text>
            </View>
            <Text className="text-[11px] text-emerald-700 leading-4 font-sans">
              {t('profile.privacyCommitment2Desc')}
            </Text>
          </View>

          {/* Commitment 3 */}
          <View className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Heart size={14} color="#059669" />
              <Text className="text-xs font-bold text-emerald-900 font-bold">
                {t('profile.privacyCommitment3Title')}
              </Text>
            </View>
            <Text className="text-[11px] text-emerald-700 leading-4 font-sans">
              {t('profile.privacyCommitment3Desc')}
            </Text>
          </View>
        </View>

        {/* Section 3: Hướng dẫn các tính năng cốt lõi */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mx-5 mb-5">
          <View className="flex-row items-center gap-2 mb-3.5">
            <View className="h-7 w-7 rounded-xl bg-orange-50 items-center justify-center border border-orange-100">
              <Sparkles size={15} color="#F15C22" />
            </View>
            <Text className="text-sm font-extrabold text-gray-900 font-bold">
              {t('profile.featuresTitle')}
            </Text>
          </View>

          {/* Feature 1: Quản lý chi tiêu */}
          <View className="flex-row items-start p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-2.5">
            <View className="h-9 w-9 rounded-xl bg-orange-100 items-center justify-center mr-3 mt-0.5">
              <Wallet size={18} color="#F15C22" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-900 font-bold mb-0.5">
                {t('profile.featureExpenseTitle')}
              </Text>
              <Text className="text-[11px] text-gray-500 leading-4 font-sans">
                {t('profile.featureExpenseDesc')}
              </Text>
            </View>
          </View>

          {/* Feature 2: Tự động hoá quyết toán hoá đơn nhóm */}
          <View className="flex-row items-start p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-2.5">
            <View className="h-9 w-9 rounded-xl bg-indigo-100 items-center justify-center mr-3 mt-0.5">
              <Users size={18} color="#4F46E5" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-900 font-bold mb-0.5">
                {t('profile.featureSplitTitle')}
              </Text>
              <Text className="text-[11px] text-gray-500 leading-4 font-sans">
                {t('profile.featureSplitDesc')}
              </Text>
            </View>
          </View>

          {/* Feature 3: Miu Miu đồng hành & Nhắc nhở */}
          <View className="flex-row items-start p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-2.5">
            <View className="h-9 w-9 rounded-xl bg-emerald-100 items-center justify-center mr-3 mt-0.5">
              <Clock size={18} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-900 font-bold mb-0.5">
                {t('profile.featureCompanionTitle')}
              </Text>
              <Text className="text-[11px] text-gray-500 leading-4 font-sans">
                {t('profile.featureCompanionDesc')}
              </Text>
            </View>
          </View>

          {/* Feature 4: Bảo mật sinh trắc học */}
          <View className="flex-row items-start p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <View className="h-9 w-9 rounded-xl bg-purple-100 items-center justify-center mr-3 mt-0.5">
              <Fingerprint size={18} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-900 font-bold mb-0.5">
                {t('profile.featureSecurityTitle')}
              </Text>
              <Text className="text-[11px] text-gray-500 leading-4 font-sans">
                {t('profile.featureSecurityDesc')}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4: Đội ngũ phát triển */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mx-5 mb-5">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="h-7 w-7 rounded-xl bg-orange-50 items-center justify-center border border-orange-100">
              <UserCheck size={15} color="#F15C22" />
            </View>
            <Text className="text-sm font-extrabold text-gray-900 font-bold">
              {t('profile.aboutDevTeamTitle')}
            </Text>
          </View>

          {/* Nguyen Dai Hung */}
          <View className="flex-row items-center p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-2">
            <View className="h-10 w-10 rounded-full bg-orange-100 items-center justify-center mr-3">
              <UserCheck size={18} color="#F15C22" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-900 font-bold">
                {t('profile.aboutDevHung')}
              </Text>
              <Text className="text-[10px] text-gray-500 font-sans mt-0.5">
                {t('profile.aboutDevRole')}
              </Text>
            </View>
          </View>

          {/* Hoang Duc Chinh */}
          <View className="flex-row items-center p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <View className="h-10 w-10 rounded-full bg-indigo-100 items-center justify-center mr-3">
              <UserCheck size={18} color="#4F46E5" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-900 font-bold">
                {t('profile.aboutDevChinh')}
              </Text>
              <Text className="text-[10px] text-gray-500 font-sans mt-0.5">
                {t('profile.aboutDevRole')}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer: Support & Copyright */}
        <View className="items-center px-6 pt-2">
          <View className="flex-row items-center gap-1.5 mb-1.5">
            <Mail size={13} color="#9CA3AF" />
            <Text className="text-xs font-semibold text-gray-600 font-sans">
              support@9paws.com
            </Text>
          </View>
          <Text className="text-[10px] text-gray-400 text-center font-sans">
            {t('profile.aboutCopyright')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
