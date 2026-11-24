Bump the application version according to SemVer rules:
1. Inspect the argument provided by the user (default to `patch` if unspecified, or `minor` / `major`).
2. Read the current version from `package.json`.
3. Calculate the new version string (e.g., `1.0.1` -> `1.0.2` for patch, `1.0.1` -> `1.1.0` for minor).
4. Update `package.json` with the new version.
5. Update `app.json`:
   - Set `expo.version` to match the new version string.
   - Increment `expo.android.versionCode` by 1.
   - Increment `expo.ios.buildNumber` by 1.
6. Verify changes with `git diff package.json app.json` and confirm sync.