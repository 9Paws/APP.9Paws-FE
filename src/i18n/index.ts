/* eslint-disable import/no-named-as-default-member */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { STORAGE_KEYS } from '@/lib/constants';
import { getItem, setItem } from '@/lib/secure-storage';

import en from './locales/en.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';

export const resources = {
  vi: { translation: vi },
  en: { translation: en },
  zh: { translation: zh },
  ko: { translation: ko },
  ja: { translation: ja },
} as const;

export type SupportedLanguage = 'vi' | 'en' | 'zh' | 'ko' | 'ja';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['vi', 'en', 'zh', 'ko', 'ja'];

/**
 * Lấy ngôn ngữ mặc định từ thiết bị:
 * Nếu ngôn ngữ máy nằm trong danh sách hỗ trợ ('vi', 'en', 'zh', 'ko', 'ja') thì sử dụng.
 * Nếu không có trong danh sách thì mặc định (default) là tiếng Anh ('en').
 */
export function getDeviceLanguage(): SupportedLanguage {
  const locales = getLocales();
  const primaryLang = locales[0]?.languageCode;
  if (primaryLang && (SUPPORTED_LANGUAGES as readonly string[]).includes(primaryLang)) {
    return primaryLang as SupportedLanguage;
  }
  return 'en';
}

// Khởi tạo i18n đồng bộ ngay khi load module để tránh lỗi NO_I18NEXT_INSTANCE khi component render sớm
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
 * Nạp ngôn ngữ người dùng đã lưu từ SecureStore
 */
export async function initI18n(): Promise<void> {
  try {
    const savedLanguage = (await getItem(STORAGE_KEYS.LANGUAGE)) as SupportedLanguage | null;
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      if (i18n.language !== savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    }
  } catch {
    // Giữ nguyên ngôn ngữ thiết bị nếu không đọc được storage
  }
}

/**
 * Đổi ngôn ngữ và lưu vào SecureStore
 */
export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  const targetLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en';
  await i18n.changeLanguage(targetLang);
  await setItem(STORAGE_KEYS.LANGUAGE, targetLang);
}

export default i18n;
