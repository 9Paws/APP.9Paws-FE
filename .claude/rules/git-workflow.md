---
paths:
  - "**"
---
# Git Workflow & Commit Guidelines

## 1. Atomic Commits Policy (Strictly Enforced)

- **Commit as you go**: As soon as a specific logical unit, module, or bug fix is completed and verified, commit it immediately.
- **Never make monolithic commits**: Never run `git add .` to dump disparate changes across multiple domains into a single commit.
- **Granular staging**: Stage only the specific files relevant to the completed task (`git add <file1> <file2>`).
- **Isolation of concerns**: Keep dependency updates, refactoring, new features, and bug fixes in separate, dedicated commits for transparency and bisectability.

---

## 2. Semantic & Meaningful Commit Messages (Intent over Trivia)

- **Describe value, not mechanical trivia**:
  - Commit messages must express the semantic, purposeful intent and value of the change.
  - **Never** write trivial, cosmetic commit messages describing mechanical trivia (e.g., do NOT write "delete trailing blank line", "remove empty line at end of file", or "clean up whitespace").
  - For example, when updating documentation or guidelines, write `docs(readme): update project documentation and specifications for v1.0.1` rather than describing the formatting cleanup.
  - Always focus on the domain, feature, version, or architectural intent.

---

## 3. Conventional Commits Specification

Format: `<type>(<scope>): <description>`

### Types:
- `feat`: New feature or user-facing functionality
- `fix`: Bug fix
- `chore`: Tooling, configuration, or dependency updates
- `ci`: CI/CD workflows and pipeline scripts
- `docs`: Documentation updates
- `refactor`: Code reorganization without behavioral modifications
- `style`: Formatting, whitespace, or lint-only fixes

### Examples:
- `feat(auth): integrate google sign-in sdk`
- `fix(i18n): synchronize initialization to prevent language flicker`
- `chore(deps): align expo sdk 58 compatible modules`
- `ci(cd): fix yaml indentation in staging pipeline`

---

## 4. Three-Branch CI/CD Pipeline (GitHub Actions)

1. **`dev` (Active Development)**
   - Pull Requests trigger `ci-dev-gate.yml`.
   - Gate checks: `npm run lint`, `npx tsc --noEmit`, `npx expo-doctor`.
   - Zero error policy: All checks must pass before merging.

2. **`staging` (Quality Assurance & Internal Distribution)**
   - Merge into `staging` triggers `cd-staging.yml`.
   - Builds internal preview APK via EAS Cloud.
   - Automatically distributes QR code and download links to QA testers.

3. **`releases` (Production Deployment)**
   - Merge into `releases` triggers `cd-release.yml`.
   - Gemini AI analyzes the last 15 commits to determine version bump (minor/patch).
   - Generates Vietnamese release changelog.
   - Bumps version in `app.json` + `package.json`, tags release as `vX.Y.Z`.
   - EAS Cloud builds production APK and attaches assets to GitHub Release.