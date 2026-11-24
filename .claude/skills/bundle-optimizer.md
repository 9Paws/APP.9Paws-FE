---
name: bundle-optimizer
description: Professional Mobile SE Bundle & APK Size Auditor. Guides analyzing JS bundle output, identifying rogue heavy dependencies, stripping unused assets, and enforcing R8/ProGuard dead-code elimination.
---
# Bundle & APK Size Optimization Skill

## 1. Bundle Size Auditing Procedure

When auditing or reducing application size, execute this four-point check:

1. **Dependency Weight Check (`package.json`)**:
   - Inspect newly introduced packages. Look out for bloated modules that bundle their own duplicate copies of `react`, native dependencies, or uncompiled Babel runtimes.
   - Run `npm list <package>` to detect duplicate or deduped heavy libraries.

2. **Asset Directory Inspection (`./assets/`)**:
   - Scan `./assets/images/` and `./assets/fonts/` for oversized files.
   - Flag any PNG/JPEG exceeding 150 KB. Recommend converting to WebP or vector SVG.

3. **Wildcard & Barrel Import Detection**:
   - Search the codebase for `import * as` or barrel files re-exporting hundreds of unused icons or helpers.
   - Replace with direct, tree-shakeable named imports.

4. **Dead Code & Unused Modules**:
   - Identify unreferenced components, obsolete routes in `src/app/`, or unused hooks.
   - Delete dead code completely rather than commenting it out (git history preserves it).

---

## 2. Size Budget Guidelines for 9Paws

- **JS Bundle Target:** Keep raw production JS bundle under **3.5 MB** (Hermes bytecode under **2.0 MB**).
- **Release APK Target:** Universal APK under **30 MB** (or under **18 MB** per-ABI split APK).
- **Static Assets Target:** Entire `./assets/` directory under **2.5 MB**.