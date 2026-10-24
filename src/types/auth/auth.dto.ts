import { UserResponse } from "./user.types";

// ==========================================
// 1. RESPONSE DTOs
// ==========================================

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: UserResponse;
}

export interface VerifyResetPasswordOtpResponse {
    email: string;
    resetToken: string;
}

// ==========================================
// 2. REQUEST DTOs
// ==========================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export type OtpType = "REGISTER" | "FORGOT_PASSWORD";
export interface ResendOtpRequest {
    email: string;
    type: OtpType;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    resetToken: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}