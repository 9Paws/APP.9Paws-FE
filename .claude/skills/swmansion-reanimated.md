---
name: swmansion-reanimated
description: Software Mansion Animation & Gesture Mastery for Reanimated 4, Gesture Handler 3, and Worklets. Guides building fluid 120fps UI thread animations, physics-based interactions, and performant gesture pipelines without JavaScript thread stutter.
---
# Software Mansion: Reanimated 4 & Gesture Handler Skill

## 1. Golden Rules of Reanimated 4

- **Run Everything on the UI Thread:**
  - All animation calculations, interpolations, and physics simulations must execute inside worklet functions on the UI thread.
  - Never trigger animations via `setState` inside `setInterval` or standard React state loops.
- **`useAnimatedStyle` Best Practices:**
  - Keep `useAnimatedStyle` focused purely on transform and opacity properties whenever possible (these are GPU-accelerated and do not trigger native layout recalculations).
  - Animate `transform: [{ translateX }, { scale }]` rather than animating `left`, `top`, `width`, or `height` directly.
- **Shared Values (`useSharedValue`):**
  - Shared values represent reactive animated state. Modify `value.value` directly or wrap with `withSpring()`, `withTiming()`, or `withSequence()`.
  - Prefer `withSpring` with physics damping for natural, organic mobile touch interactions over stiff linear timings.

---

## 2. Gesture Handler v3 Modern API (`Gesture.Pan()`)

Always use the modern, chainable `Gesture` API from `react-native-gesture-handler`:

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function SwipeableCard() {
  const translationX = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translationX.value;
    })
    .onUpdate((event) => {
      translationX.value = prevTranslationX.value + event.translationX;
    })
    .onEnd(() => {
      // Spring back or snap to threshold
      translationX.value = withSpring(0, { damping: 15, stiffness: 120 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle} className="p-4 bg-white rounded-2xl shadow-sm">
        {/* Card Content */}
      </Animated.View>
    </GestureDetector>
  );
}
```

---

## 3. Worklets & Thread Separation

- When invoking JavaScript functions from worklets, explicitly mark UI worklet callbacks with `'worklet';` directive or use `runOnJS` from `react-native-reanimated`.
- Never execute heavy asynchronous I/O, storage reads, or complex JSON parsing inside worklets.

---

## 4. Layout Animations & Entering/Exiting

- Use Reanimated's built-in entering and exiting animations for list items, notifications, and modal popups:
  ```tsx
  import Animated, { FadeInUp, FadeOutDown, LinearTransition } from 'react-native-reanimated';

  <Animated.View
    entering={FadeInUp.springify().damping(14)}
    exiting={FadeOutDown.duration(200)}
    layout={LinearTransition.springify()}
  >
    {/* List item */}
  </Animated.View>
  ```