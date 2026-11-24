---
name: senior-react-native-patterns
description: Senior Software Engineer (SE) patterns for production React Native apps. Enforces defensive coding, crash-prevention boundaries, interaction scheduling, and memory leak elimination.
---
# Senior React Native Engineering Patterns

Production-grade mobile patterns applied by experienced React Native / Expo Software Engineers:

---

## 1. Defensive Coding & Crash Elimination

Mobile apps must never crash due to network inconsistency or unexpected payload shapes:

- **Safe Array Iteration:**
  - ❌ `items.map(...)` (Crashes with `TypeError: items is not a function` if `items` is null/undefined)
  - ✅ `(items ?? []).map(...)` or `items?.map(...)`
- **Defensive Property Access:**
  - Always use optional chaining: `user?.profile?.avatarUrl`
  - Fallback defaults with nullish coalescing: `const displayBalance = user?.balance ?? 0;`
- **JSON Parsing Safety:**
  - Wrap any `JSON.parse()` reading from storage or sockets in a `try/catch` block with safe fallback return values.

---

## 2. InteractionManager & Fluid Screen Transitions

Avoid running heavy compute or eager background fetches during native screen transitions (which causes dropped frames and stuttering animations):

```tsx
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';

export function ComplexExpenseScreen() {
  useEffect(() => {
    // Wait until transition animation finishes before triggering heavy calculations
    const task = InteractionManager.runAfterInteractions(() => {
      loadDetailedAnalytics();
    });

    return () => task.cancel();
  }, []);

  return <View className="flex-1 bg-background">{/* UI */}</View>;
}
```

---

## 3. Memory Leak Prevention

- **Timer Cleanup:**
  - Always clear `setTimeout`, `setInterval`, or requestAnimationFrame inside `useEffect` cleanup.
- **AbortController on Network Requests:**
  - Cancel in-flight network requests when components unmount to prevent setting state on unmounted trees.
- **Event Listeners & Subscriptions:**
  - Always remove AppState listeners, NetInfo subscriptions, or keyboard listeners in cleanup:
    ```tsx
    useEffect(() => {
      const subscription = AppState.addEventListener('change', handleAppStateChange);
      return () => subscription.remove();
    }, []);
    ```

---

## 4. Error Boundaries for Isolated Screen Resilience

Wrap major feature modules and complex chart screens with functional error boundaries:
- If a chart rendering engine encounters bad data, it should render an inline "Unable to load chart" fallback rather than crashing the entire application back to the phone's home screen.