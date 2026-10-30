export interface UserSettingsDto {
    biometricEnabled?: boolean;
    dailyReminderEnabled?: boolean;
    dailyReminderTime?: string;
    currency?: string;
    language?: string;
}

export interface UserResponse {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    emailVerified: boolean;
    currency?: string | null;
    language?: string | null;
    createdAt?: string | null;
    isGoogleLinked?: boolean;
    authProvider?: 'LOCAL' | 'GOOGLE';
    companionDays?: number;
    settings?: UserSettingsDto;
}

export interface UserProfileResponse {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    authProvider?: 'LOCAL' | 'GOOGLE';
    isGoogleLinked?: boolean;
    emailVerified?: boolean;
    companionDays?: number;
    settings?: UserSettingsDto;
    createdAt?: string;
}

export interface UpdateProfileRequest {
    fullName: string;
    phoneNumber?: string | null;
}

export interface UpdateSettingsRequest {
    biometricEnabled?: boolean;
    dailyReminderEnabled?: boolean;
    dailyReminderTime?: string;
    currency?: string;
    language?: string;
}

export interface GoogleLoginRequest {
    idToken: string;
}

export interface LinkGoogleAccountResponse {
    isGoogleLinked: boolean;
    email: string;
}
