---
name: ponytail
description: Anti-overengineering ruleset. Enforces the "laziest senior developer" mindset: eliminates bloat, prevents premature abstractions, and maximizes code reuse before writing any new code.
---
# Ponytail: Anti-Overengineering & Simplicity Skill

> **Core Philosophy:** "The best code is the code you never had to write. The second best code is the smallest, clearest amount of code that completely solves the problem."

## The 7-Rung Decision Ladder

Before writing any new function, class, file, or utility, evaluate these 7 rungs sequentially:

1. **Does this requirement actually need to exist? (YAGNI)**
   - Challenge unnecessary features, speculative abstractions, and "just-in-case" configurations.
   - If the user did not explicitly ask for it and it is not an essential requirement, do not build it.

2. **Is it already in the codebase?**
   - Search `src/components/ui/`, `src/lib/`, `src/hooks/`, and existing services before creating anything new.
   - Reuse existing buttons, inputs, modals, toast stores, and secure storage wrappers instead of creating variations.

3. **Does the language/platform standard library already do it?**
   - Use built-in JavaScript/TypeScript/Node methods (e.g., `Array.prototype.find`, `Intl.NumberFormat`, `URLSearchParams`, `crypto.randomUUID`) instead of pulling in micro-libraries or writing helper functions.

4. **Does the native platform / Expo provide a solution?**
   - Check if an installed Expo package (`expo-clipboard`, `expo-secure-store`, `expo-localization`, `expo-image`) already solves this natively before writing custom native bridge or JS workarounds.

5. **Is it supported by an already-installed dependency?**
   - Check `package.json`: We already have `zustand`, `lucide-react-native`, `axios`, `zod`, `i18next`, `@tanstack/react-query`. Leverage their built-in capabilities rather than adding new dependencies.

6. **Can it be expressed cleanly in 1 to 5 lines?**
   - Inline clear, readable logic directly where it is used. Do not create single-use utility files or one-line wrapper functions.

7. **Only then: Write the minimal code that works.**
   - Write clean, straightforward code. Avoid deep inheritance, over-parameterized factories, and unnecessary design pattern gymnastics.

---

## Non-Negotiable Guardrails (Never Cut Corners Here)

Ponytail is lazy about **unnecessary architecture**, NOT about safety or correctness:
- **Security & Token Safety:** Never bypass authentication checks, token refreshes, or secure storage.
- **Data Integrity & Validation:** Always validate external inputs and API payloads using Zod schemas.
- **Error & Exception Handling:** Always handle network failures, 401 unauthenticated states, and device permission denials gracefully.
- **Accessibility & UX:** Always preserve accessible touch targets, color contrast, and clear user feedback.