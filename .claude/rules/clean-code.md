---
paths:
  - "src/**"
  - "**/*.ts"
  - "**/*.tsx"
---
# Clean Code & Code Craftsmanship Rules

High-standard Clean Code guidelines for React Native and TypeScript development.

---

## 1. File Formatting & Hygiene

- **No Redundant Trailing Lines:**
  - Do not append multiple trailing blank lines at the end of files. End files cleanly without unnecessary blank lines.
  - Trim trailing whitespace on all lines.
- **Import Ordering & Hygiene:**
  - Remove all unused imports immediately.
  - Group imports in clean blocks:
    1. React and React Native built-ins (`react`, `react-native`)
    2. Third-party packages (`expo-*`, `@tanstack/*`, `lucide-react-native`, `zustand`)
    3. Internal absolute alias modules (`@/components/...`, `@/services/...`, `@/stores/...`, `@/lib/...`)
    4. Relative imports (`./...`, `../...`)
    5. Types (`import type { ... }`)

---

## 2. Meaningful Naming & Readability

- **Variables & Booleans:**
  - Name variables to reveal intent (`isSubmitting`, `hasBiometricEnabled`, `canSplitBill`). Avoid vague names (`temp`, `data2`, `flag`, `val`).
  - Booleans must start with `is`, `has`, `should`, or `can`.
- **Functions & Handlers:**
  - Functions must clearly state their action: `fetchExpenseDetails`, `calculateEqualSplit`, `validatePassword`.
  - Component props for events: use `onEvent` (`onPress`, `onSelectCategory`).
  - Implementation functions: use `handleEvent` (`handlePress`, `handleSelectCategory`).
- **No Magic Numbers or Strings:**
  - Centralize magic values, timeouts, and storage keys into constants (`src/lib/constants.ts`):
    ```typescript
    // BAD
    if (retryCount > 3) { ... }
    // GOOD
    if (retryCount > MAX_LOGIN_RETRIES) { ... }
    ```

---

## 3. Function & Component Design (SRP & Modularity)

- **Single Responsibility Principle (SRP):**
  - A function or component should do one thing and do it well.
  - If a screen component exceeds ~200 lines, extract reusable sub-components (`components/`) or custom business logic hooks (`hooks/`).
- **Guard Clauses & Early Returns:**
  - Avoid deep nesting of `if/else` ladders. Return early as soon as validation fails:
    ```typescript
    // BAD
    function processPayment(user, amount) {
      if (user) {
        if (amount > 0) {
          if (user.hasBalance) {
            // deeply nested logic
          }
        }
      }
    }

    // GOOD
    function processPayment(user, amount) {
      if (!user) return;
      if (amount <= 0) return;
      if (!user.hasBalance) return;
      // straightforward business logic
    }
    ```
- **Pure Helpers:**
  - Extract pure calculations (e.g., currency formatting, bill split division, date parsing) into pure utility functions outside of React component render cycles.

---

## 4. Elimination of Clutter & Code Smells

- **No Commented-Out Dead Code:**
  - Never leave blocks of commented-out code in files. Git preserves full history; delete dead code.
- **No Leftover Debugging Code:**
  - Remove all `console.log`, `debugger`, and temporary test alerts before committing.
- **Explicit Types over `any`:**
  - Never use `any`. Use strict TypeScript interfaces, unions, generics, or `unknown` with type guards.
- **Keep JSX Clean:**
  - Avoid complex inline ternaries or inline mathematical equations within JSX children. Extract them into descriptive helper variables:
    ```tsx
    // BAD
    <Text>{user && user.age > 18 ? (balance > 0 ? format(balance) : 'Zero') : 'Restricted'}</Text>

    // GOOD
    const isEligible = user && user.age > 18;
    const formattedBalance = balance > 0 ? format(balance) : 'Zero';
    <Text>{isEligible ? formattedBalance : 'Restricted'}</Text>
    ```