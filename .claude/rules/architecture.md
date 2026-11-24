---
paths:
  - "src/**"
---
# Architecture & Design Patterns

## Tech Stack
- **Framework**: Expo SDK 58 (CNG - Continuous Native Generation)
- **Navigation**: Expo Router v4 (file-based, type-safe)
- **Styling**: NativeWind v4 + Tailwind CSS 3.4 (utility-first)
- **State**: Zustand v5 (lightweight, modular stores)
- **Data Fetching**: Axios + TanStack Query v5 (auto token refresh queue)
- **Auth**: JWT (access/refresh) + Google Sign-In SDK
- **Security**: expo-secure-store + expo-local-authentication (Face ID/Touch ID)
- **i18n**: i18next + react-i18next + expo-localization (auto device-locale sync)
- **Fonts**: BeVietnamPro (via @expo-google-fonts)
- **Icons**: lucide-react-native

## Project Structure
```
src/
├── app/                    # Expo Router screens & route handlers
│   ├── _layout.tsx         # Root: Splash, Auth Guard, Biometrics, i18n init
│   ├── index.tsx           # Redirects to /(tabs) or /(auth)/login
│   ├── (auth)/             # Auth stack: login, register, forgot-password, otp
│   ├── (tabs)/             # Main tab navigator: overview, history, add, split, profile
│   ├── about.tsx           # About screen
│   └── edit-profile.tsx    # Profile editing
├── components/
│   ├── ui/                 # Reusable atoms/molecules (Button, Input, Toast, AnimatedSplashScreen, etc.)
│   └── icons/              # GlowTabIcons for tab bar
├── hooks/
│   ├── useResponsive.ts    # Responsive padding/typography calculations
│   └── useCountdown.ts     # OTP countdown timer
├── i18n/
│   ├── index.ts            # i18n config, auto device-locale detection (vi/en)
│   └── locales/            # en.json, vi.json
├── lib/
│   ├── api.ts              # Axios instance with request/response interceptors (auto Bearer token, 401 refresh queue)
│   ├── constants.ts        # APP_CONFIG, STORAGE_KEYS
│   ├── secure-storage.ts   # Wrapper over expo-secure-store (web fallback to localStorage)
│   ├── validators.ts       # Zod schemas for forms
│   └── suppress-warnings.ts# Filter deprecation warnings in dev
├── services/
│   ├── auth.service.ts     # Auth API calls (login, register, OTP, refresh, Google, password reset)
│   ├── google-auth.service.ts # Google Sign-In SDK configuration
│   ├── notification.service.ts # Push notification permissions/handling
│   └── user.service.ts     # User profile API
├── stores/
│   ├── auth.store.ts       # Zustand: user session, tokens, biometric unlock
│   ├── toast.store.ts      # Global toast notifications
│   └── settings.store.ts   # App settings (reminders, biometric, currency)
└── types/                  # TypeScript definitions (Auth, User, API responses, Common)
```

## Key Architectural Patterns

### 1. Auth Flow (`src/app/_layout.tsx` → `src/stores/auth.store.ts`)
1. Splash screen displays (minimum 1.4s) with animated Miu Miu mascot.
2. Fonts load + i18n init + auth initialization in parallel.
3. `initializeAuth()`: reads tokens from SecureStore, validates JWT, restores user.
4. If authenticated + biometric enabled → Face ID/Touch ID prompt.
5. Route to `/(tabs)` or `/(auth)/login`.

### 2. API Client (`src/lib/api.ts`)
- **Request interceptor**: auto-attaches Bearer access token from storage.
- **Response interceptor**: on 401, queues requests, triggers token refresh once, retries queue.
- Uses a separate axios instance for refresh calls to avoid recursive interceptor loops.

### 3. Secure Storage (`src/lib/secure-storage.ts`)
- Platform-aware: `expo-secure-store` on native, `localStorage` on web.
- Keys must be centralized in `STORAGE_KEYS` (`access_token`, `refresh_token`, `user`, `biometric_enabled`, etc.).

### 4. Internationalization (`src/i18n/index.ts`)
- Auto-detects device locale: `vi` → Vietnamese, fallback → English.
- Persists user language choice in SecureStore.
- Synchronous initialization on app start via `initI18n()`.

### 5. Responsive Design (`src/hooks/useResponsive.ts`)
- Computes layout padding and font scale dynamically based on screen width.
- Tab layout centers content at max 500px width on tablet/large screens (>640px).