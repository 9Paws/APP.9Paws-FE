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

/**
 * Lấy ngôn ngữ mặc định từ thiết bị:
 */
export function getDeviceLanguage(): SupportedLanguage {
  const locales = getLocales();
  const primaryLang = locales[0]?.languageCode;
  if (primaryLang === 'en' || primaryLang === 'zh' || primaryLang === 'ko' || primaryLang === 'ja') {
    return primaryLang;
  }
  return 'vi';
}

/**
 * Khởi tạo i18n
 */
export async function initI18n(): Promise<void> {
  let initialLanguage = getDeviceLanguage();

  try {
    const savedLanguage = (await getItem(STORAGE_KEYS.LANGUAGE)) as SupportedLanguage | null;
    if (savedLanguage && (['vi', 'en', 'zh', 'ko', 'ja'] as SupportedLanguage[]).includes(savedLanguage)) {
      initialLanguage = savedLanguage;
    }
  } catch {
    // Giữ nguyên ngôn ngữ thiết bị nếu không đọc được storage
  }

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'vi',
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false,
      },
    });
  }
}

/**
 * Đổi ngôn ngữ và lưu vào SecureStore
 */
export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(lang);
  await setItem(STORAGE_KEYS.LANGUAGE, lang);
}

export default i18n;
