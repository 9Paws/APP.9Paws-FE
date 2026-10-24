export const APP_CONFIG = {
  DEFAULT_CURRENCY: 'VND',
  DEFAULT_LANGUAGE: 'vi',
  OTP_LENGTH: 6,
  OTP_COUNTDOWN_SECONDS: 105,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ninepaws_access_token',
  REFRESH_TOKEN: 'ninepaws_refresh_token',
  SAVED_EMAIL: 'ninepaws_saved_email',
  LANGUAGE: 'ninepaws_language',
} as const;
