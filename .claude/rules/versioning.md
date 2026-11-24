---
paths:
  - "package.json"
  - "app.json"
---
# Semantic Versioning & App Release Rules

Whenever modifying the application to introduce a feature (`feat`) or a bug fix (`fix`), you must bump the application version following standard Semantic Versioning (SemVer) and sync both configuration files.

---

## 1. SemVer Increment Criteria

- **`PATCH` bump (e.g., `1.0.1` -> `1.0.2`)**:
  - Bug fixes (`fix(...)`)
  - Patch-level dependency or security updates (`chore(deps)`)
  - Small UI tweaks or performance adjustments (`refactor(...)`, `style(...)`)
- **`MINOR` bump (e.g., `1.0.1` -> `1.1.0`)**:
  - New user-facing features (`feat(...)`)
  - New screens, route additions, or new service integrations
  - Backwards-compatible architecture improvements
- **`MAJOR` bump (e.g., `1.1.0` -> `2.0.0`)**:
  - Breaking changes or complete app overhaul
  - Incompatible API migrations or redesign of core storage/auth contracts

---

## 2. Synchronization Checklist (Both Files Must Match)

When bumping version, update **both** files in the same commit:

1. **`package.json`**:
   ```json
   {
     "version": "1.0.2"
   }
   ```
2. **`app.json`**:
   ```json
   {
     "expo": {
       "version": "1.0.2",
       "android": {
         "versionCode": 3
       },
       "ios": {
         "buildNumber": "3"
       }
     }
   }
   ```

> **Build Counter Rule:**
> - Android `versionCode` must always be an **incrementing integer** (e.g., 2 -> 3). Google Play strictly rejects APK/AAB uploads with identical or decreasing `versionCode`.
> - iOS `buildNumber` must also be incremented as a string (e.g., `"2"` -> `"3"`).

---

## 3. Commit Integration

Include the version bump directly in the atomic commit of the feature or fix:
```bash
git add package.json app.json <feature-files>
git commit -m "feat(split): add custom tip calculator with version bump to v1.1.0"
```