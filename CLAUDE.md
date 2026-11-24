# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in the **9Paws** repository.

## Project Overview

**9Paws** is an Expo / React Native mobile app for personal expense tracking and smart group bill splitting.
- **Core Stack**: Expo SDK 58 (CNG), React Native 0.88.1, React 19, NativeWind v4, Zustand v5, TanStack Query v5, Axios.

---

## Essential Commands

```bash
# Development
npm start -c                 # Start dev server with clean cache (press 'a' for Android)
npx expo start --android      # Open Android emulator directly
npx expo start --ios          # Open iOS simulator directly

# Code Quality & Diagnostics (Zero error policy)
npm run lint                 # Run ESLint
npx tsc --noEmit             # TypeScript typecheck
npx expo-doctor              # Diagnose dependencies and configuration

# Dependencies (ALWAYS use expo install instead of bare npm/yarn add)
npx expo install <package>   # Resolves SDK-compatible version
npx expo install --fix       # Fix incompatible packages

# Build
npx eas-cli build --profile preview     # Internal test APK
npx eas-cli build --profile production  # Production APK
```

---

## Core Operational Rules

1. **Atomic & Semantic Commits Policy**:
   - Commit as you go: Immediately commit completed units of work.
   - Never use blanket `git add .` to batch unrelated changes into monolithic commits.
   - Stage only relevant files with explicit Conventional Commit messages (`feat`, `fix`, `chore`, etc.).
   - Describe high-level domain/feature intent rather than mechanical trivia (never write "delete trailing blank line" or "fix whitespace").

2. **Runtime Verification Feedback Loop**:
   - After completing code edits, run `npm run lint` and `npx tsc --noEmit`.
   - Run `npm start -c`, press `a` to debug on Android.
   - Inspect all terminal and LogBox output: Any warning or error that appears must be investigated and completely resolved before declaring the task done.

3. **Semantic Versioning Policy**:
   - Every feature (`feat`) bumps `MINOR` (e.g., `1.0.1` -> `1.1.0`).
   - Every bug fix (`fix`) bumps `PATCH` (e.g., `1.0.1` -> `1.0.2`).
   - Always synchronize `package.json` (`version`) with `app.json` (`version`, `versionCode`, and `buildNumber`).

4. **App Size & Asset Optimization Policy**:
   - Strictly prohibit wildcard icon imports (`import * as Icons`). Use named imports only.
   - Never add heavy redundant libraries (no `moment`, no `lodash`).
   - All static bitmaps must be compressed WebP/SVG under 150 KB.

5. **Clean Code & Formatting Hygiene**:
   - Never add redundant trailing empty lines at the end of files. Keep file endings clean.
   - Use early returns and guard clauses over nested `if/else`.
   - Strictly ban `any`, magic numbers, commented-out dead code, and leftover `console.log`.

---

## Detailed Rules & Context (`.claude/rules/`)

In-depth project rules are modularized into `.claude/rules/` and auto-loaded based on touched files:

- [`.claude/rules/clean-code.md`](.claude/rules/clean-code.md): Clean code principles, naming standards, formatting hygiene (no redundant trailing lines), and code smell elimination.
- [`.claude/rules/versioning.md`](.claude/rules/versioning.md): Semantic versioning, build counter increments (`versionCode`/`buildNumber`), and sync rules.
- [`.claude/rules/bundle-size-and-assets.md`](.claude/rules/bundle-size-and-assets.md): Strict bundle size limits, tree-shaking, Hermes, R8/ProGuard, and asset rules.
- [`.claude/rules/verification-loop.md`](.claude/rules/verification-loop.md): Runtime feedback loop procedure (`npm start -c -> press 'a' -> fix all warnings & errors`).
- [`.claude/rules/git-workflow.md`](.claude/rules/git-workflow.md): Atomic commit standards, Conventional Commits specification, 3-branch CI/CD pipeline (`dev`, `staging`, `releases`).
- [`.claude/rules/architecture.md`](.claude/rules/architecture.md): Directory structure, Auth flow, Axios client with 401 refresh queue, SecureStore, i18n, responsive design.
- [`.claude/rules/build-and-env.md`](.claude/rules/build-and-env.md): Environment variables (`.env`), EAS build profiles (`eas.json`).
- [`.claude/rules/compliance.md`](.claude/rules/compliance.md): Vietnamese legal compliance (PDPD Decree 13/2023, Decree 52/2024, Cybersecurity Law).

---

## Custom Slash Commands (`.claude/commands/`)

- `/check`: Runs `npx expo-doctor`, `npm run lint`, and `npx tsc --noEmit` in sequence.
- `/review`: Pre-commit security, type safety, and Conventional Commit message audit.
- `/bump-version`: Bumps and synchronizes app version across `package.json` and `app.json` (patch/minor/major).
- `/size-audit`: Audits package imports, asset weights, and bundle bloat risks.

---

## Agent Skills (`.claude/skills/`)

Modular intelligence skills loaded for specialized tasks:
- [`.claude/skills/bundle-optimizer.md`](.claude/skills/bundle-optimizer.md): APK & JS bundle size auditor, R8 dead code elimination, asset weight control.
- [`.claude/skills/senior-react-native-patterns.md`](.claude/skills/senior-react-native-patterns.md): Professional SE crash prevention, defensive chaining, InteractionManager, error boundaries.
- [`.claude/skills/ponytail.md`](.claude/skills/ponytail.md): Anti-overengineering ruleset (7-rung decision ladder, YAGNI, code reuse).
- [`.claude/skills/ui-ux-promax.md`](.claude/skills/ui-ux-promax.md): Mobile UI/UX design intelligence (touch targets, contrast ratios, micro-interactions, NativeWind styling).
- [`.claude/skills/swmansion-reanimated.md`](.claude/skills/swmansion-reanimated.md): Reanimated 4, Gesture Handler 3, and Worklet animation standards (120fps UI thread execution).
- [`.claude/skills/performance-optimization.md`](.claude/skills/performance-optimization.md): FlatList virtualization, expo-image caching, and atomic Zustand selectors.
- [`.claude/skills/resilient-api-query.md`](.claude/skills/resilient-api-query.md): Centralized Axios 401 refresh queue, TanStack Query v5 patterns, and Zod runtime schema validation.

---

## Key Files to Know

- `app.json` - Expo configuration (CNG plugins, app schemes)
- `tailwind.config.ts` - Theme colors, font definitions
- `src/app/_layout.tsx` - App entry layout, auth guards, biometric prompt
- `src/lib/api.ts` - Axios instance with auto Bearer & refresh queue
- `src/stores/auth.store.ts` - Auth session, JWT tokens, biometric state
- `src/i18n/index.ts` - Language detection and persistence