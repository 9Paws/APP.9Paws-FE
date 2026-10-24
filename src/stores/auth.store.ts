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

function parseJwtPayload(token: string): Record<string, any> | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonString = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setAuth: async ({ accessToken, refreshToken, user }) => {
        await Promise.all([
            setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
            setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
            setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
        ]);

        set({ user, isAuthenticated: true, isLoading: false });
    },

    updateUser: (fields) => {
        const user = get().user;
        if (user) {
            const updated = { ...user, ...fields };
            setItem(STORAGE_KEYS.USER, JSON.stringify(updated)).catch(() => {});
            set({ user: updated });
        }
    },

    logout: async () => {
        await Promise.all([
            removeItem(STORAGE_KEYS.ACCESS_TOKEN),
            removeItem(STORAGE_KEYS.REFRESH_TOKEN),
            removeItem(STORAGE_KEYS.USER),
        ]);

        set(clearAuthState);
    },

    initializeAuth: async () => {
        try {
            const [accessToken, userJson] = await Promise.all([
                getItem(STORAGE_KEYS.ACCESS_TOKEN),
                getItem(STORAGE_KEYS.USER),
            ]);

            let user: UserResponse | null = null;
            if (userJson) {
                try {
                    user = JSON.parse(userJson) as UserResponse;
                } catch {
                    // Ignore parse error
                }
            } else if (accessToken) {
                const payload = parseJwtPayload(accessToken);
                if (payload) {
                    user = {
                        id: (payload.userId as string) || (payload.sub as string) || 'user',
                        fullName: (payload.fullName as string) || (payload.name as string) || (payload.sub as string) || '',
                        email: (payload.email as string) || (payload.sub as string) || '',
                        emailVerified: true,
                    };
                    setItem(STORAGE_KEYS.USER, JSON.stringify(user)).catch(() => {});
                }
            }

            set({
                user,
                isAuthenticated: Boolean(accessToken),
                isLoading: false,
            });
        } catch {
            set(clearAuthState);
        }
    },
}));