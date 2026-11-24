Execute full quality verification pipeline for the Expo project:
1. Run `npx expo-doctor` to diagnose package and configuration compatibility.
2. Run `npm run lint` to enforce linter conventions and import resolution.
3. Run `npx tsc --noEmit` to verify TypeScript strict type safety.

Report all results clearly and propose root-cause fixes if any check fails.