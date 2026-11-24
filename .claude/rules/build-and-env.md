---
paths:
  - "eas.json"
  - "app.json"
  - ".env*"
---
# Build Profiles & Environment Variables

## Environment Variables

Configured in `.env` (template provided in `.env.example`):
- `EXPO_PUBLIC_API_BASE_URL` - Backend API endpoint (e.g., `https://api.domain.com/api/v1`)
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` - Google OAuth Web Client ID for idToken verification

> **Security Rule:** Never commit `.env` or files containing secret credentials. All `.env*.local` and `.env` are excluded via `.gitignore`.

---

## EAS Build Profiles (`eas.json`)

- **`development`**: Developer client for local debugging and native module testing.
- **`preview`**: Internal APK for QA testing and team distribution.
- **`production`**: Release APK optimized with production environment variables (`APP_VARIANT=production`).

### Build Commands:
```bash
npx eas-cli build --profile preview     # Internal test APK
npx eas-cli build --profile production  # Production APK
```