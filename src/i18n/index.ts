/* eslint-disable import/no-named-as-default-member */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import vi from './locales/vi.json';

export const resources = {
  vi: { translation: vi },
  en: { translation: en },
} as const;

export type SupportedLanguage = 'vi' | 'en';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['vi', 'en'];

/**
 * Xác định ngôn ngữ hiển thị theo thiết bị:
 * - Nếu ngôn ngữ máy là tiếng Việt ('vi') => Ứng dụng hiển thị tiếng Việt ('vi').
 * - Tất cả các ngôn ngữ còn lại => Mặc định ứng dụng hiển thị tiếng Anh ('en').
 */
export function getDeviceLanguage(): SupportedLanguage {
  const locales = getLocales();
  const primaryLang = locales[0]?.languageCode?.toLowerCase();
  return primaryLang === 'vi' ? 'vi' : 'en';
}

// Khởi tạo i18n đồng bộ ngay khi load module để tránh cảnh báo NO_I18NEXT_INSTANCE
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });
}

/**
 * Đồng bộ ngôn ngữ theo ngôn ngữ máy khi app khởi động
 */
export async function initI18n(): Promise<void> {
  try {
    const deviceLang = getDeviceLanguage();
    if (i18n.language !== deviceLang) {
      await i18n.changeLanguage(deviceLang);
    }
  } catch {
    // Giữ nguyên trạng thái nếu gặp lỗi
  }
}

/**
 * Đổi ngôn ngữ nếu cần thiết
 */
export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  const targetLang = lang === 'vi' ? 'vi' : 'en';
  await i18n.changeLanguage(targetLang);
}

export default i18n;
