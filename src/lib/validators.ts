import { z } from 'zod';

// Regex chuẩn từ Spring Boot OpenAPI Spec của 9Paws
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
export const OTP_REGEX = /^\d{6}$/;

// -----------------------------------------------------------------------------
// 1. Schema cho Màn hình Đăng nhập
// -----------------------------------------------------------------------------
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Địa chỉ email không đúng định dạng'),
    password: z
        .string()
        .min(1, 'Vui lòng nhập mật khẩu'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// -----------------------------------------------------------------------------
// 2. Schema cho Màn hình Đăng ký
// -----------------------------------------------------------------------------
export const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(1, 'Vui lòng nhập họ và tên')
            .max(100, 'Họ và tên tối đa 100 ký tự'),
        email: z
            .string()
            .min(1, 'Vui lòng nhập email')
            .email('Địa chỉ email không đúng định dạng'),
        password: z
            .string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .regex(PASSWORD_REGEX, 'Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số'),
        confirmPassword: z
            .string()
            .min(1, 'Vui lòng xác nhận lại mật khẩu'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword'], // Báo lỗi tại ô confirmPassword
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

// -----------------------------------------------------------------------------
// 3. Schema cho Màn hình OTP
// -----------------------------------------------------------------------------
export const otpSchema = z.object({
    otp: z
        .string()
        .length(6, 'Mã OTP phải có đúng 6 chữ số')
        .regex(OTP_REGEX, 'Mã OTP chỉ bao gồm các chữ số'),
});

export type OtpFormData = z.infer<typeof otpSchema>;

// -----------------------------------------------------------------------------
// 4. Schemas cho Màn hình Quên mật khẩu
// -----------------------------------------------------------------------------
export const forgotPasswordEmailSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Địa chỉ email không đúng định dạng'),
});

export type ForgotPasswordEmailFormData = z.infer<typeof forgotPasswordEmailSchema>;

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .regex(PASSWORD_REGEX, 'Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số'),
        confirmPassword: z
            .string()
            .min(1, 'Vui lòng xác nhận lại mật khẩu'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword'],
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;