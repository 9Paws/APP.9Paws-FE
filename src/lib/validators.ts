import { z } from 'zod';
import i18n from '@/i18n';

// Regex chuẩn từ Spring Boot OpenAPI Spec của 9Paws
// Yêu cầu: tối thiểu 8 ký tự, gồm chữ in hoa, chữ in thường và chữ số
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const OTP_REGEX = /^\d{6}$/;

// Zod v4: `message` chỉ nhận chuỗi (đã deprecated), dùng `error` (error map) để hỗ trợ i18n
const t = (key: string) => i18n.t(key);

// -----------------------------------------------------------------------------
// 1. Schema cho Màn hình Đăng nhập
// -----------------------------------------------------------------------------
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { error: () => t('validation.emailRequired') })
        .email({ error: () => t('validation.emailInvalid') }),
    password: z
        .string()
        .min(1, { error: () => t('validation.passwordRequired') }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// -----------------------------------------------------------------------------
// 2. Schema cho Màn hình Đăng ký
// -----------------------------------------------------------------------------
export const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(1, { error: () => t('validation.fullNameRequired') })
            .max(100, { error: () => t('validation.fullNameMaxLength') }),
        email: z
            .string()
            .min(1, { error: () => t('validation.emailRequired') })
            .email({ error: () => t('validation.emailInvalid') }),
        password: z
            .string()
            .min(8, { error: () => t('validation.passwordMinLength') })
            .regex(PASSWORD_REGEX, { error: () => t('validation.passwordPattern') }),
        confirmPassword: z
            .string()
            .min(1, { error: () => t('validation.confirmPasswordRequired') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: () => t('validation.passwordsMismatch'),
        path: ['confirmPassword'], // Báo lỗi tại ô confirmPassword
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

// -----------------------------------------------------------------------------
// 3. Schema cho Màn hình OTP
// -----------------------------------------------------------------------------
export const otpSchema = z.object({
    otp: z
        .string()
        .length(6, { error: () => t('validation.otpLength') })
        .regex(OTP_REGEX, { error: () => t('validation.otpDigitsOnly') }),
});

export type OtpFormData = z.infer<typeof otpSchema>;

// -----------------------------------------------------------------------------
// 4. Schemas cho Màn hình Quên mật khẩu
// -----------------------------------------------------------------------------
export const forgotPasswordEmailSchema = z.object({
    email: z
        .string()
        .min(1, { error: () => t('validation.emailRequired') })
        .email({ error: () => t('validation.emailInvalid') }),
});

export type ForgotPasswordEmailFormData = z.infer<typeof forgotPasswordEmailSchema>;

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, { error: () => t('validation.passwordMinLength') })
            .regex(PASSWORD_REGEX, { error: () => t('validation.passwordPattern') }),
        confirmPassword: z
            .string()
            .min(1, { error: () => t('validation.confirmPasswordRequired') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: () => t('validation.passwordsMismatch'),
        path: ['confirmPassword'],
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
