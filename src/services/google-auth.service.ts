import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform, TurboModuleRegistry } from 'react-native';
import i18n from '@/i18n';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

function getNativeGoogleSigninModule() {
    if (isExpoGo || Platform.OS === 'web') {
        return null;
    }

    try {
        // Chỉ require khi TurboModule 'RNGoogleSignin' thực sự tồn tại trong binary native
        const isRegistered = TurboModuleRegistry?.get?.('RNGoogleSignin');
        if (!isRegistered) {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pkg = require('@react-native-google-signin/google-signin');
        return pkg?.GoogleSignin ?? null;
    } catch {
        return null;
    }
}

export const statusCodes = {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
};

export const googleAuthService = {
    // 1. Cấu hình Google Sign-In SDK (chỉ chạy khi có Native Binary)
    configure: () => {
        const GoogleSignin = getNativeGoogleSigninModule();
        if (!GoogleSignin) {
            return;
        }

        const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
        try {
            GoogleSignin.configure({
                webClientId: webClientId && !webClientId.includes('your-google-web-client-id') ? webClientId : undefined,
                offlineAccess: true,
                scopes: ['profile', 'email'],
            });
        } catch (error) {
            console.warn('[GoogleAuthService] configure failed:', error);
        }
    },

    // 2. Kiểm tra SDK có khả dụng trên thiết bị hiện tại không
    isAvailable: (): boolean => {
        return !!getNativeGoogleSigninModule();
    },

    // 3. Thực hiện đăng nhập và lấy Google ID Token
    signIn: async (): Promise<{ idToken: string; user?: any }> => {
        const GoogleSignin = getNativeGoogleSigninModule();
        if (!GoogleSignin) {
            throw new Error(
                `GOOGLE_NATIVE_UNAVAILABLE: ${i18n.t('common.googleNativeUnavailable')}`
            );
        }

        const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
        if (!webClientId || webClientId.includes('your-google-web-client-id')) {
            throw new Error(`GOOGLE_CONFIG_MISSING: ${i18n.t('common.googleConfigMissing')}`);
        }

        // Tự động re-configure trước khi gọi signIn để đảm bảo webClientId luôn được nạp đầy đủ
        try {
            GoogleSignin.configure({
                webClientId,
                offlineAccess: true,
                scopes: ['profile', 'email'],
            });
        } catch (confErr) {
            console.warn('[GoogleAuthService] configure in signIn failed:', confErr);
        }

        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();

            // SDK v13+ cấu trúc token nằm trong response.data.idToken
            const idToken = response.data?.idToken ?? (response as any).idToken;

            if (!idToken) {
                throw new Error(`GOOGLE_TOKEN_NOT_FOUND: ${i18n.t('common.googleTokenNotFound')}`);
            }

            return {
                idToken,
                user: response.data?.user ?? (response as any).user,
            };
        } catch (error: any) {
            if (
                error?.code === '10' ||
                error?.code === 'DEVELOPER_ERROR' ||
                error?.message?.includes('DEVELOPER_ERROR')
            ) {
                throw new Error(`DEVELOPER_ERROR: ${i18n.t('common.googleDeveloperError')}`);
            }
            throw error;
        }
    },

    // 4. Đăng xuất phiên Google hiện tại
    signOut: async () => {
        const GoogleSignin = getNativeGoogleSigninModule();
        if (!GoogleSignin) {
            return;
        }
        try {
            await GoogleSignin.signOut();
        } catch {
            // Ignore sign-out errors
        }
    },

    statusCodes,
};
