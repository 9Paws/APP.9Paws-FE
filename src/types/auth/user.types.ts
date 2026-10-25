interface UserResponse {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    emailVerified: boolean;
    currency?: string | null;
    language?: string | null;
    createdAt?: string | null;
}

export { UserResponse };
