import { STORAGE_KEYS } from '@/lib/constants';
import { getItem, removeItem, setItem } from '@/lib/secure-storage';
import type { AuthResponse, UserResponse } from '@/types';
import { create } from 'zustand';

interface AuthState {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setAuth: (authData: AuthResponse) => Promise<void>;
    updateUser: (fields: Partial<UserResponse>) => void;
    logout: () => Promise<void>;
    initializeAuth: () => Promise<void>;
}

const clearAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setAuth: async ({ accessToken, refreshToken, user }) => {
        await Promise.all([
            setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
            setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        ]);

        set({ user, isAuthenticated: true, isLoading: false });
    },

    updateUser: (fields) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...fields } });
    },

    logout: async () => {
        await Promise.all([
            removeItem(STORAGE_KEYS.ACCESS_TOKEN),
            removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        ]);

        set(clearAuthState);
    },

    initializeAuth: async () => {
        try {
            const accessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);
            set({
                isAuthenticated: Boolean(accessToken),
                isLoading: false,
            });
        } catch {
            set(clearAuthState);
        }
    },
}));