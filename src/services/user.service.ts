import { api } from '@/lib/api';
import type {
    GoogleLoginRequest,
    LinkGoogleAccountResponse,
    SingleResponse,
    UpdateProfileRequest,
    UpdateSettingsRequest,
    UserProfileResponse,
    UserSettingsDto,
} from '@/types';

export const userService = {
    // 1. Lấy thông tin cá nhân và cài đặt người dùng
    getProfile: async () => {
        const response = await api.get<SingleResponse<UserProfileResponse>>('/users/me');
        return response.data;
    },

    // 2. Cập nhật thông tin profile (họ tên, số điện thoại)
    updateProfile: async (payload: UpdateProfileRequest) => {
        const response = await api.put<SingleResponse<UserProfileResponse>>('/users/me', payload);
        return response.data;
    },

    // 3. Liên kết tài khoản Google bằng idToken
    linkGoogle: async (payload: GoogleLoginRequest) => {
        const response = await api.post<SingleResponse<LinkGoogleAccountResponse>>(
            '/users/me/link-google',
            payload
        );
        return response.data;
    },

    // 4. Cập nhật cài đặt người dùng (biometric, reminder, currency, language)
    updateSettings: async (payload: UpdateSettingsRequest) => {
        const response = await api.patch<SingleResponse<UserSettingsDto>>(
            '/users/me/settings',
            payload
        );
        return response.data;
    },
};
