import type { AuthResponse, SingleResponse } from '@/types';
import axios, { create, InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from './constants';
import { getItem, removeItem, setItem } from './secure-storage';
import { useLoadingStore } from '@/stores/loading.store';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

declare module 'axios' {
    interface AxiosRequestConfig {
        /** Bỏ qua overlay loading toàn cục cho request này */
        skipGlobalLoading?: boolean;
        /** Request này đã được tính vào bộ đếm loading toàn cục */
        _globalLoadingTracked?: boolean;
    }
}

export const api = create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// =============================================================================
// 1. REQUEST INTERCEPTOR: Tự động đính kèm Bearer token vào Header
// =============================================================================
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const accessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =============================================================================
// 1.1 GLOBAL LOADING: Đếm số request đang chạy để hiện overlay singleton
// =============================================================================
api.interceptors.request.use(
    (config) => {
        if (!config.skipGlobalLoading) {
            useLoadingStore.getState().beginRequest();
            config._globalLoadingTracked = true;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =============================================================================
// 2. RESPONSE INTERCEPTOR: Tự động Refresh Token khi gặp lỗi 401 Unauthorized
// =============================================================================
let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Log chi tiết lỗi mạng khi gặp sự cố để dễ theo dõi trong quá trình kiểm thử
        if (error.response) {
            console.warn(
                `[API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} -> Status ${error.response.status}`
            );
        } else if (error.request) {
            console.warn(
                `[API Network Error] Unable to reach the API server: ${error.message}`
            );
        }

        // Chỉ kích hoạt khi bị 401 và không phải là request refresh hay login
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh-token') &&
            !originalRequest.url?.includes('/auth/login')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await getItem(STORAGE_KEYS.REFRESH_TOKEN);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Gọi API refresh bằng axios gốc (độc lập, không đi qua interceptor này nữa)
                const response = await axios.post<SingleResponse<AuthResponse>>(
                    `${BASE_URL}/auth/refresh-token`,
                    { refreshToken }
                );

                const newAuthData = response.data.data;
                await setItem(STORAGE_KEYS.ACCESS_TOKEN, newAuthData.accessToken);
                await setItem(STORAGE_KEYS.REFRESH_TOKEN, newAuthData.refreshToken);

                processQueue(null, newAuthData.accessToken);

                originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Refresh thất bại: Xoá token đã lưu
                await removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                await removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// =============================================================================
// 3. GLOBAL LOADING: Giảm bộ đếm khi request hoàn tất
// Đặt cuối cùng để request retry sau 401 vẫn giữ overlay liên tục,
// tránh hiện/ẩn liên tục gây nhấp nháy.
// =============================================================================
api.interceptors.response.use(
    (response) => {
        if (response.config?._globalLoadingTracked) {
            useLoadingStore.getState().endRequest();
        }
        return response;
    },
    (error) => {
        if (error.config?._globalLoadingTracked) {
            useLoadingStore.getState().endRequest();
        }
        return Promise.reject(error);
    }
);
