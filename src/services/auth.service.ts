import { api } from "@/lib/api";
import type {
    AuthResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    GoogleLoginRequest,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    ResendOtpRequest,
    ResetPasswordRequest,
    SingleResponse,
    SuccessResponse,
    VerifyOtpRequest,
    VerifyResetPasswordOtpResponse,
} from '@/types';

const authService = {
    // 1. Đăng nhập bằng Email & Mật khẩu
    login: async (payload: LoginRequest) => {
        const response = await api.post<SingleResponse<AuthResponse>>('/auth/login', payload);
        return response.data;
    },

    // 2. Đăng ký tài khoản (Server trả về SuccessResponse, chờ verify OTP)
    register: async (payload: RegisterRequest) => {
        const response = await api.post<SuccessResponse>('/auth/register', payload);
        return response.data;
    },

    // 3. Xác thực OTP đăng ký (Server trả về AuthResponse kèm tokens)
    verifyRegistrationOtp: async (payload: VerifyOtpRequest) => {
        const response = await api.post<SingleResponse<AuthResponse>>(
            '/auth/verify-registration-otp',
            payload
        );
        return response.data;
    },

    // 4. Gửi lại mã OTP (type: 'REGISTER' | 'FORGOT_PASSWORD')
    resendOtp: async (payload: ResendOtpRequest) => {
        const response = await api.post<SuccessResponse>('/auth/resend-otp', payload);
        return response.data;
    },

    // 5. Cấp lại token thủ công
    refreshToken: async (payload: RefreshTokenRequest) => {
        const response = await api.post<SingleResponse<AuthResponse>>(
            '/auth/refresh-token',
            payload
        );
        return response.data;
    },

    // 6. Đăng xuất (Truyền refreshToken trong body)
    logout: async (refreshToken: string) => {
        const response = await api.post<SuccessResponse>('/auth/logout', { refreshToken });
        return response.data;
    },

    // 7. Đăng xuất tất cả thiết bị
    logoutAll: async () => {
        const response = await api.post<SuccessResponse>('/auth/logout-all');
        return response.data;
    },

    // 8. Quên mật khẩu
    forgotPassword: async (payload: ForgotPasswordRequest) => {
        const response = await api.post<SuccessResponse>('/auth/forgot-password', payload);
        return response.data;
    },

    // 9. Xác thực OTP quên mật khẩu (Nhận resetToken)
    verifyForgotPasswordOtp: async (payload: VerifyOtpRequest) => {
        const response = await api.post<SingleResponse<VerifyResetPasswordOtpResponse>>(
            '/auth/verify-forgot-password-otp',
            payload
        );
        return response.data;
    },

    // 10. Đặt lại mật khẩu mới
    resetPassword: async (payload: ResetPasswordRequest) => {
        const response = await api.post<SuccessResponse>('/auth/reset-password', payload);
        return response.data;
    },

    // 11. Đổi mật khẩu trong Cài đặt
    changePassword: async (payload: ChangePasswordRequest) => {
        const response = await api.post<SuccessResponse>('/auth/change-password', payload);
        return response.data;
    },

    // 12. Đăng nhập bằng Google ID Token
    googleLogin: async (payload: GoogleLoginRequest) => {
        const response = await api.post<SingleResponse<AuthResponse>>('/auth/google', payload);
        return response.data;
    },
};

export { authService };
