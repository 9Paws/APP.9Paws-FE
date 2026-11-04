import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import {
  ArrowLeft,
  Clock,
  Coins,
  FileText,
  Fingerprint,
  GraduationCap,
  Heart,
  Lock,
  Mail,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react-native';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Tự động lấy version của App từ app.json / native package thay vì hardcode
  const appVersion =
    Constants.expoConfig?.version || Constants.nativeAppVersion || '1.0.0';

  // State cho Modal Điều khoản & Chính sách quyền riêng tư
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

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
        <Text className="text-base font-extrabold text-gray-900">
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

          <Text className="text-2xl font-black text-gray-900 tracking-tight">
            9Paws
          </Text>

          {/* Version badge tự động cập nhật theo build/release */}
          <View className="rounded-full bg-orange-100 px-3.5 py-1 mt-1.5 mb-2 border border-orange-200/80">
            <Text className="text-xs font-bold text-brand">
              {t('profile.aboutAppVersion', { version: appVersion })}
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
            <Text className="text-sm font-extrabold text-gray-900">
              {t('profile.missionTitle')}
            </Text>
          </View>
          <Text className="text-xs text-text-muted leading-5 font-sans">
            {t('profile.missionContent')}
          </Text>
        </View>

        {/* Section 2: Tuân thủ Pháp lý & Quy định phát hành tại Việt Nam */}
        <View className="bg-white rounded-3xl p-5 border border-blue-100 shadow-sm mx-5 mb-5">
          <View className="flex-row items-center gap-2 mb-1.5">
            <View className="h-7 w-7 rounded-xl bg-blue-50 items-center justify-center border border-blue-200">
              <Scale size={16} color="#2563EB" />
            </View>
            <Text className="text-sm font-extrabold text-blue-900">
              {t('profile.legalTitle')}
            </Text>
          </View>
          <Text className="text-[11px] text-gray-500 font-sans mb-3.5">
            {t('profile.legalSubtitle')}
          </Text>

          {/* Pillar 1: Nghị định 13/2023/NĐ-CP (PDPD) */}
          <View className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 mb-2.5">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Shield size={14} color="#2563EB" />
              <Text className="text-xs font-bold text-blue-950">
                {t('profile.legalPdpdTitle')}
              </Text>
            </View>
            <Text className="text-[11px] text-blue-800 leading-4 font-sans">
              {t('profile.legalPdpdDesc')}
            </Text>
          </View>

          {/* Pillar 2: Tuyên bố tài chính & Nghị định 52/2024/NĐ-CP */}
          <View className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 mb-2.5">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Coins size={14} color="#D97706" />
              <Text className="text-xs font-bold text-amber-950">
                {t('profile.legalFinancialTitle')}
              </Text>
            </View>
            <Text className="text-[11px] text-amber-900 leading-4 font-sans">
              {t('profile.legalFinancialDesc')}
            </Text>
          </View>

          {/* Pillar 3: Luật Bảo vệ quyền lợi người tiêu dùng 2023 */}
          <View className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 mb-2.5">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Heart size={14} color="#7C3AED" />
              <Text className="text-xs font-bold text-purple-950">
                {t('profile.legalConsumerTitle')}
              </Text>
            </View>
            <Text className="text-[11px] text-purple-800 leading-4 font-sans">
              {t('profile.legalConsumerDesc')}
            </Text>
          </View>

          {/* Pillar 4: An toàn thông tin mạng (Luật An ninh mạng 2018) */}
          <View className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 mb-3">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Lock size={14} color="#059669" />
              <Text className="text-xs font-bold text-emerald-950">
                {t('profile.legalCyberSecurityTitle')}
              </Text>
            </View>
            <Text className="text-[11px] text-emerald-800 leading-4 font-sans">
              {t('profile.legalCyberSecurityDesc')}
            </Text>
          </View>

          {/* Legal Document Action Buttons */}
          <View className="flex-row gap-2 pt-1">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveModal('terms')}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-100/70 active:bg-blue-200 border border-blue-200"
            >
              <FileText size={13} color="#1D4ED8" />
              <Text className="text-[11px] font-bold text-blue-800">
                {t('profile.termsOfServiceButton')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveModal('privacy')}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-100/70 active:bg-emerald-200 border border-emerald-200"
            >
              <ShieldCheck size={13} color="#047857" />
              <Text className="text-[11px] font-bold text-emerald-800">
                {t('profile.privacyPolicyButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 3: Cam kết bảo vệ quyền riêng tư & bảo mật */}
        <View className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm mx-5 mb-5">
          <View className="flex-row items-center gap-2 mb-3.5">
            <View className="h-7 w-7 rounded-xl bg-emerald-50 items-center justify-center border border-emerald-200">
              <ShieldCheck size={16} color="#059669" />
            </View>
            <Text className="text-sm font-extrabold text-emerald-800">
              {t('profile.privacyTitle')}
            </Text>
          </View>

          {/* Commitment 1 */}
          <View className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 mb-2.5">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Lock size={14} color="#059669" />
              <Text className="text-xs font-bold text-emerald-900">
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
              <Text className="text-xs font-bold text-emerald-900">
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
              <Text className="text-xs font-bold text-emerald-900">
                {t('profile.privacyCommitment3Title')}
              </Text>
            </View>
            <Text className="text-[11px] text-emerald-700 leading-4 font-sans">
              {t('profile.privacyCommitment3Desc')}
            </Text>
          </View>
        </View>

        {/* Section 4: Hướng dẫn các tính năng cốt lõi */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mx-5 mb-5">
          <View className="flex-row items-center gap-2 mb-3.5">
            <View className="h-7 w-7 rounded-xl bg-orange-50 items-center justify-center border border-orange-100">
              <Sparkles size={15} color="#F15C22" />
            </View>
            <Text className="text-sm font-extrabold text-gray-900">
              {t('profile.featuresTitle')}
            </Text>
          </View>

          {/* Feature 1: Quản lý chi tiêu */}
          <View className="flex-row items-start p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-2.5">
            <View className="h-9 w-9 rounded-xl bg-orange-100 items-center justify-center mr-3 mt-0.5">
              <Wallet size={18} color="#F15C22" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-900 mb-0.5">
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
              <Text className="text-xs font-bold text-gray-900 mb-0.5">
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
              <Text className="text-xs font-bold text-gray-900 mb-0.5">
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
              <Text className="text-xs font-bold text-gray-900 mb-0.5">
                {t('profile.featureSecurityTitle')}
              </Text>
              <Text className="text-[11px] text-gray-500 leading-4 font-sans">
                {t('profile.featureSecurityDesc')}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 5: Đội ngũ phát triển */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mx-5 mb-5">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="h-7 w-7 rounded-xl bg-orange-50 items-center justify-center border border-orange-100">
              <UserCheck size={15} color="#F15C22" />
            </View>
            <Text className="text-sm font-extrabold text-gray-900">
              {t('profile.aboutDevTeamTitle')}
            </Text>
          </View>

          {/* School / Institution Info */}
          <View className="flex-row items-center p-3 rounded-2xl bg-orange-50/70 border border-orange-100 mb-3">
            <View className="h-9 w-9 rounded-xl bg-white items-center justify-center mr-3 border border-orange-100 shadow-xs">
              <GraduationCap size={18} color="#F15C22" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-800 leading-4">
                {t('profile.aboutDevSchool')}
              </Text>
            </View>
          </View>

          {/* Nguyen Dai Hung */}
          <View className="flex-row items-center p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-2.5">
            <View className="h-10 w-10 rounded-full bg-orange-100 items-center justify-center mr-3">
              <UserCheck size={18} color="#F15C22" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-900">
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
              <Text className="text-xs font-bold text-gray-900">
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

      {/* Modal: Điều khoản dịch vụ & Chính sách quyền riêng tư */}
      <Modal
        visible={activeModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="px-5 py-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center gap-2">
              {activeModal === 'terms' ? (
                <FileText size={20} color="#2563EB" />
              ) : (
                <ShieldCheck size={20} color="#059669" />
              )}
              <Text className="text-base font-extrabold text-gray-900">
                {activeModal === 'terms'
                  ? t('profile.termsModalTitle')
                  : t('profile.privacyModalTitle')}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveModal(null)}
              className="p-1 rounded-full bg-gray-100"
            >
              <X size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView className="flex-1 px-5 py-4" showsVerticalScrollIndicator={false}>
            {activeModal === 'terms' ? (
              <View className="gap-y-4 pb-10">
                <Text className="text-xs font-semibold text-gray-500 font-sans">
                  Có hiệu lực từ ngày: 01/07/2024 • Phiên bản: 1.0 (Phù hợp pháp luật Việt Nam)
                </Text>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    1. Giới thiệu và Phạm vi dịch vụ
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    9Paws là ứng dụng công nghệ hỗ trợ quản lý chi tiêu cá nhân và chia sẻ hoá đơn nhóm. Bằng việc tải về, cài đặt hoặc sử dụng ứng dụng, bạn đồng ý tuân thủ các Điều khoản này cùng các quy định pháp luật hiện hành của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    2. Tuyên bố phi trung gian tài chính (Nghị định 52/2024/NĐ-CP)
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    9Paws hoàn toàn KHÔNG PHẢI là ngân hàng, tổ chức tín dụng, ví điện tử hay tổ chức cung ứng dịch vụ trung gian thanh toán theo quy định tại Nghị định số 52/2024/NĐ-CP của Chính phủ. Chúng tôi không mở tài khoản thanh toán, không huy động hay lưu giữ tiền của người dùng và không cung ứng dịch vụ chuyển tiền thay thế. Mọi hành vi tất toán, chuyển khoản đều do người dùng tự chủ động thực hiện trực tiếp giữa các bên qua ngân hàng chính thức.
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    3. Trách nhiệm người dùng và Sở hữu dữ liệu
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    Bạn chịu trách nhiệm về tính chính xác của các con số chi tiêu nhập vào ứng dụng và bảo mật thiết bị cá nhân của mình. Dữ liệu ghi chép thu chi thuộc toàn quyền sở hữu của bạn.
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    4. Bảo vệ quyền lợi người dùng (Luật số 19/2023/QH15)
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    Chúng tôi cam kết minh bạch mọi tính năng, không phát sinh chi phí ẩn. Người dùng có quyền đóng tài khoản và xoá toàn bộ dữ liệu bất kỳ khi nào có nhu cầu mà không chịu ràng buộc nghĩa vụ.
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    5. Giải quyết tranh chấp và Khiếu nại
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    Mọi thắc mắc, khiếu nại xin vui lòng gửi về email: support@9paws.com. Chúng tôi cam kết tiếp nhận và phản hồi theo quy định của pháp luật Việt Nam.
                  </Text>
                </View>
              </View>
            ) : (
              <View className="gap-y-4 pb-10">
                <Text className="text-xs font-semibold text-gray-500 font-sans">
                  Tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân (PDPD)
                </Text>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    1. Nguyên tắc thu thập dữ liệu tối giản
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    9Paws chỉ thu thập các thông tin tối thiểu cần thiết để vận hành tài khoản: Họ tên, địa chỉ Email, số điện thoại (nếu bạn cung cấp) và ảnh đại diện. Chúng tôi TUYỆT ĐỐI KHÔNG thu thập số CCCD, tài khoản ngân hàng, mật khẩu giao dịch ngân hàng hay mã OTP thanh toán.
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    2. Quyền của Chủ thể Dữ liệu (Điều 9 - Nghị định 13/2023/NĐ-CP)
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    Bạn có đầy đủ các quyền theo luật định đối với dữ liệu của mình:
                    {'\n'}• Quyền được biết và đồng ý với mục đích xử lý dữ liệu.
                    {'\n'}• Quyền truy cập, chỉnh sửa thông tin cá nhân trong mục Chỉnh sửa hồ sơ.
                    {'\n'}• Quyền rút lại sự đồng ý hoặc từ chối bật tính năng sinh trắc học/thông báo.
                    {'\n'}• Quyền yêu cầu xóa vĩnh viễn toàn bộ dữ liệu và tài khoản (Right to erasure).
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    3. Cam kết không chia sẻ dữ liệu cho bên thứ ba
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    9Paws cam đoan không bán, không cho thuê, không chia sẻ dữ liệu chi tiêu cá nhân của người dùng cho bất kỳ đối tác quảng cáo hay tổ chức tín dụng nào.
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    4. Biện pháp an toàn kỹ thuật (Luật An ninh mạng 2018)
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    Toàn bộ đường truyền kết nối đều được mã hóa bằng giao thức HTTPS/TLS 1.3 tiêu chuẩn. Dữ liệu xác thực vân tay/Face ID được xử lý hoàn toàn cục bộ trên phần cứng bảo mật của thiết bị (iOS Keychain / Android Keystore) và không bao giờ gửi về máy chủ.
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-900 mb-1">
                    5. Đầu mối liên hệ bảo vệ dữ liệu cá nhân (DPO)
                  </Text>
                  <Text className="text-xs text-gray-600 font-sans leading-5">
                    Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu thực hiện quyền chủ thể dữ liệu, vui lòng liên hệ Bộ phận Bảo vệ dữ liệu của 9Paws qua email: privacy@9paws.com hoặc support@9paws.com.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              className="w-full py-3.5 rounded-2xl bg-brand items-center justify-center shadow-xs"
            >
              <Text className="text-sm font-bold text-white">
                {t('profile.legalCloseButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
