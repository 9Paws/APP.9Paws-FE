---
paths:
  - "src/**"
  - "app.json"
---
# Runtime Verification & Feedback Loop Policy

Every task involving code modifications must undergo a strict verification feedback loop before completion:

```
[Write / Edit Code]
        │
        ▼
[Static Checks: lint & typecheck]
        │
        ▼
[Runtime Verification: npm start -c -> press 'a' for Android]
        │
        ▼
[Inspect Terminal Output & LogBox]
   ├── Any Warnings or Errors detected? ──► YES ──► Fix root cause ──► Re-verify
   │
   └── Clean Terminal (0 warnings, 0 errors)? ──► NO ISSUES ──► Ready to Commit
```

---

## Step-by-Step Verification Procedure

### 1. Static Verification
Before launching the runtime, run the automated checks:
```bash
npm run lint         # Zero lint error policy
npx tsc --noEmit     # Zero TypeScript type error policy
```

### 2. Runtime Debugging on Android
Start the development server with a fresh cache:
```bash
npm start -c
```
- Press **`a`** in the terminal to launch/connect the Android emulator or physical device.
- Interact with the modified screens and simulate user actions.

### 3. Terminal Log & Warning Clearance
- Continuously monitor the terminal output while the dev server is active and after it stops.
- **Zero-Tolerance for Terminal Warnings/Errors**:
  - Any deprecation warning, React Hook dependency warning, unhandled promise rejection, Metro bundling warning, or component exception appearing in the terminal **must be resolved**.
  - Do not ignore YellowBox warnings or Metro console logs.
- Apply fixes and re-execute the cycle until the terminal log remains completely clean and stable.