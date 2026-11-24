---
paths:
  - "assets/**"
  - "src/**"
  - "package.json"
---
# App Size & Asset Optimization Rules (Professional Mobile SE)

Every byte matters on mobile. Follow these strict engineering rules to keep APK and bundle footprint at the absolute minimum.

---

## 1. Strict Tree-Shaking & Import Discipline

- ❌ **NEVER use wildcard or barrel imports from large icon libraries:**
  ```tsx
  // BANNED: Pulls in the entire icon library (adds 2MB+ uncompressed to bundle)
  import * as Icons from 'lucide-react-native';
  ```
- ✅ **ALWAYS use direct named imports:**
  ```tsx
  import { Check, ArrowLeft, Plus } from 'lucide-react-native';
  ```
- ❌ **NEVER install heavy utility libraries for simple tasks:**
  - Do NOT install `moment.js` or `date-fns` (moment adds 300KB+). Use built-in `Intl.DateTimeFormat` or custom formatters.
  - Do NOT install `lodash`. Use modern JavaScript methods (`Array.prototype.map`, `flatMap`, `reduce`, `Object.fromEntries`).

---

## 2. Asset Weight & Compression Standards

- **Vector Graphics over Bitmaps:**
  - Prefer vector SVG components (`react-native-svg`) for icons, illustrations, and logos.
- **Bitmap Format & Compression:**
  - For unavoidable bitmap images (illustrations, banners), convert to **WebP** format.
  - No image asset in `./assets/` may exceed **150 KB** in size.
  - Run lossless or near-lossless compression on any new PNG/JPEG added to `./assets/`.
- **Font Subsetting:**
  - Only bundle font weights strictly used in the UI (`Regular`, `Medium`, `SemiBold`, `Bold`). Do not include `Thin`, `Black`, or italic weights unless explicitly required.

---

## 3. Android APK Native Footprint (`withAndroidOptimizations.js`)

Ensure the project's native build configuration preserves:
- **`reactNativeArchitectures`**: Restrict to `armeabi-v7a,arm64-v8a` for release. Strip `x86` and `x86_64` (saves ~15-20MB on APK size).
- **R8 / ProGuard Minification**:
  - `android.enableMinifyInReleaseBuilds=true`
  - `android.enableShrinkResourcesInReleaseBuilds=true`
  - `android.enableR8.fullMode=true`
- **Hermes Bytecode Precompilation**: Hermes must be enabled to compile JS into bytecode at build time, eliminating the JS parser overhead.

---

## 4. Code Splitting & Async Routes (Expo Router)

- Leverage Expo Router's async routes (`extra.router.asyncRoutes: { web: true }`) to split screens into deferred chunks.
- Modals, complex charts (`react-native-gifted-charts`), or heavy third-party SDKs should be loaded only when the corresponding screen is navigated to.