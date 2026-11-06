/* eslint-disable import/no-named-as-default-member */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { STORAGE_KEYS } from '@/lib/constants';
import { getItem, setItem } from '@/lib/secure-storage';
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

function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return value === 'vi' || value === 'en';
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
 * Đồng bộ ngôn ngữ theo ngôn ngữ máy khi app khởi động.
 * Ưu tiên ngôn ngữ đã lưu (STORAGE_KEYS.LANGUAGE) nếu người dùng từng chọn.
 */
export async function initI18n(): Promise<void> {
  try {
    const savedLang = await getItem(STORAGE_KEYS.LANGUAGE);
    const targetLang = isSupportedLanguage(savedLang) ? savedLang : getDeviceLanguage();
    if (i18n.language !== targetLang) {
      await i18n.changeLanguage(targetLang);
    }
  } catch {
    // Giữ nguyên trạng thái nếu gặp lỗi
  }
}

/**
 * Đổi ngôn ngữ nếu cần thiết và lưu lại lựa chọn của người dùng
 */
export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  const targetLang = lang === 'vi' ? 'vi' : 'en';
  await i18n.changeLanguage(targetLang);
  await setItem(STORAGE_KEYS.LANGUAGE, targetLang);
}

export default i18n;
