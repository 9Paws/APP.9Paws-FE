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
        const savedAvatar = await getItem(STORAGE_KEYS.AVATAR);
        const enrichedUser: UserResponse = {
            ...user,
            avatarUrl: user.avatarUrl || savedAvatar || null,
            createdAt: user.createdAt || new Date().toISOString(),
        };
        await Promise.all([
            setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
            setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
            setItem(STORAGE_KEYS.USER, JSON.stringify(enrichedUser)),
        ]);

        set({ user: enrichedUser, isAuthenticated: true, isLoading: false });
    },

    updateUser: (fields) => {
        const user = get().user;
        if (user) {
            const updated = { ...user, ...fields };
            if (fields.avatarUrl) {
                setItem(STORAGE_KEYS.AVATAR, fields.avatarUrl).catch(() => {});
            }
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
            const [accessToken, userJson, savedAvatar] = await Promise.all([
                getItem(STORAGE_KEYS.ACCESS_TOKEN),
                getItem(STORAGE_KEYS.USER),
                getItem(STORAGE_KEYS.AVATAR),
            ]);

            let user: UserResponse | null = null;
            if (userJson) {
                try {
                    user = JSON.parse(userJson) as UserResponse;
                    if (user && savedAvatar && !user.avatarUrl) {
                        user.avatarUrl = savedAvatar;
                    }
                    if (user && !user.createdAt) {
                        user.createdAt = new Date().toISOString();
                        setItem(STORAGE_KEYS.USER, JSON.stringify(user)).catch(() => {});
                    }
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
                        avatarUrl: savedAvatar || null,
                        emailVerified: true,
                        createdAt: (payload.createdAt as string) || (payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString()),
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
