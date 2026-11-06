import { create } from 'zustand';
import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { STORAGE_KEYS } from '@/lib/constants';
import { getItem, setItem } from '@/lib/secure-storage';
import { getPushPermissions } from '@/services/notification.service';

export interface WalletItem {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'cash';
  balance: number;
  badge?: string;
}

interface SettingsState {
  isLoaded: boolean;
  faceIdEnabled: boolean;
  isBiometricSupported: boolean;
  pushNotificationEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  currentCurrency: string;
  wallets: WalletItem[];

  loadSettings: () => Promise<void>;
  setFaceIdEnabled: (enabled: boolean) => Promise<void>;
  setPushNotificationEnabled: (enabled: boolean) => Promise<void>;
  setReminder: (enabled: boolean, time?: string) => Promise<void>;
  setCurrentCurrency: (currency: string) => Promise<void>;
  setWallets: (wallets: WalletItem[]) => Promise<void>;
  addWallet: (wallet: WalletItem) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isLoaded: false,
  faceIdEnabled: false,
  isBiometricSupported: true,
  pushNotificationEnabled: false,
  reminderEnabled: false,
  reminderTime: '21:00',
  currentCurrency: 'VND',
  wallets: [],

  loadSettings: async () => {
    try {
      const [
        hasHardware,
        isEnrolled,
        bioVal,
        pushGranted,
        reminderVal,
        reminderTimeVal,
        currencyVal,
        walletsVal,
      ] = await Promise.all([
        LocalAuthentication.hasHardwareAsync().catch(() => false),
        LocalAuthentication.isEnrolledAsync().catch(() => false),
        getItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
        Platform.OS === 'web'
          ? getItem(STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED).then((v) => v === 'true')
          : getPushPermissions().catch(() => false),
        getItem(STORAGE_KEYS.REMINDER_ENABLED),
        getItem(STORAGE_KEYS.REMINDER_TIME),
        getItem(STORAGE_KEYS.CURRENCY),
        getItem(STORAGE_KEYS.WALLETS),
      ]);

      const isBiometricSupported = hasHardware && isEnrolled;
      const faceIdEnabled = isBiometricSupported && bioVal === 'true';

      const pushNotificationEnabled = Boolean(pushGranted);
      // Reminder requires push notifications to be active
      const reminderEnabled = Boolean(pushGranted) && reminderVal === 'true';
      const reminderTime = reminderTimeVal || '21:00';
      const currentCurrency = currencyVal || 'VND';

      let wallets: WalletItem[] = [];
      if (walletsVal) {
        try {
          const parsed = JSON.parse(walletsVal);
          if (Array.isArray(parsed)) {
            wallets = parsed;
          }
        } catch {
          // ignore parse error
        }
      }

      set({
        isLoaded: true,
        faceIdEnabled,
        isBiometricSupported,
        pushNotificationEnabled,
        reminderEnabled,
        reminderTime,
        currentCurrency,
        wallets,
      });
    } catch {
      set({ isLoaded: true });
    }
  },

  setFaceIdEnabled: async (enabled) => {
    set({ faceIdEnabled: enabled });
    await setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
  },

  setPushNotificationEnabled: async (enabled) => {
    const reminderEnabled = enabled ? get().reminderEnabled : false;
    set({ pushNotificationEnabled: enabled, reminderEnabled });
    await Promise.all([
      setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS_ENABLED, enabled ? 'true' : 'false'),
      setItem(STORAGE_KEYS.REMINDER_ENABLED, reminderEnabled ? 'true' : 'false'),
    ]);
  },

  setReminder: async (enabled, time) => {
    const finalTime = time || get().reminderTime;
    set({ reminderEnabled: enabled, reminderTime: finalTime });
    await Promise.all([
      setItem(STORAGE_KEYS.REMINDER_ENABLED, enabled ? 'true' : 'false'),
      setItem(STORAGE_KEYS.REMINDER_TIME, finalTime),
    ]);
  },

  setCurrentCurrency: async (currency) => {
    set({ currentCurrency: currency });
    await setItem(STORAGE_KEYS.CURRENCY, currency);
  },

  setWallets: async (wallets) => {
    set({ wallets });
    await setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  },

  addWallet: async (wallet) => {
    const nextWallets = [...get().wallets, wallet];
    set({ wallets: nextWallets });
    await setItem(STORAGE_KEYS.WALLETS, JSON.stringify(nextWallets));
  },
}));
