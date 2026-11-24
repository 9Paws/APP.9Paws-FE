---
name: ui-ux-promax
description: Mobile UI/UX Design Intelligence for React Native & NativeWind. Enforces mobile-first design systems, touch targets, contrast ratios, micro-interactions, responsive safe areas, and cohesive theme aesthetics.
---
# UI/UX Pro Max: Mobile Design Intelligence Skill

## 1. Mobile-First Layout & Touch Rules

- **Minimum Touch Targets:**
  - Interactive elements (buttons, icons, list items, checkboxes) must have a touchable area of at least **44x44pt (iOS)** and **48x48dp (Android)**.
  - For small icons (16-20px), wrap them in a container with `p-2` or `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}`.
- **Safe Area Insets (Notch & Dynamic Island):**
  - Always consume safe area insets via `react-native-safe-area-context` (`useSafeAreaInsets` or `SafeAreaView`).
  - Never hardcode status bar or navigation bar heights (e.g., avoid `paddingTop: 44`).
- **Keyboard Protection:**
  - Form screens must be wrapped inside `KeyboardAvoidingView` (with `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`) and scrollable containers so inputs are never obstructed by the soft keyboard.

---

## 2. Typography & Hierarchy (BeVietnamPro)

- Use the configured `BeVietnamPro` font family across the app.
- Clear hierarchy:
  - **Hero / Display:** `text-3xl font-bold tracking-tight` (titles, key balance display)
  - **Heading 1:** `text-2xl font-bold` (screen headers)
  - **Heading 2:** `text-xl font-semibold` (card sections, modal headers)
  - **Body Regular:** `text-base font-normal leading-relaxed` (primary text, input labels)
  - **Caption / Meta:** `text-xs font-medium text-neutral-500` (timestamps, helper tips)

---

## 3. Styling & Color Tokens (NativeWind)

- **Palette & Contrast:**
  - Maintain WCAG AA compliant contrast ratio (minimum 4.5:1 for body text, 3:1 for large headers).
  - Use semantic Tailwind classes: `bg-primary`, `text-primary`, `bg-card`, `border-border`, `text-muted`.
- **Card & Elevation Patterns:**
  - Use subtle borders (`border border-neutral-100 dark:border-neutral-800`) paired with soft shadows (`shadow-sm` or `shadow-md`).
  - Rounded corners: `rounded-2xl` for cards, `rounded-xl` for buttons/inputs, `rounded-full` for chips/pills.
- **Glassmorphism & Depth:**
  - For floating navigation bars and modals, leverage `expo-glass-effect` or semi-transparent backgrounds with backdrop blur (`bg-white/80 backdrop-blur-md`).

---

## 4. Micro-Interactions & Feedback

- **Haptic & Visual Feedback:**
  - Every button press should provide visual active feedback (e.g., `active:scale-[0.98] active:opacity-90` or `Pressable` with animated scale).
- **Empty & Error States:**
  - Never leave a blank white/black screen. Always show meaningful empty states with an illustration/icon, a supportive message, and a clear call-to-action (CTA).
- **Skeleton Shimmers:**
  - Display skeleton placeholders during data fetching instead of disruptive full-screen spinners.