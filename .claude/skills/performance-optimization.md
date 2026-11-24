---
name: performance-optimization
description: Mobile Performance Auditing and Profiling. Guides optimizing React Native re-renders, list virtualization (FlatList), memory management, image caching with expo-image, and Zustand selector efficiency.
---
# React Native & Expo: Mobile Performance Optimization Skill

## 1. List Virtualization & Rendering Large Data

When rendering lists of transactions, friends, or expense items:
- **`keyExtractor`**: Always supply a stable, unique string ID. Never use the array index (`(item, index) => index.toString()`), as it breaks element reconciliation on item deletion or insertion.
- **Windowing Parameters for `FlatList`**:
  ```tsx
  <FlatList
    data={items}
    keyExtractor={(item) => item.id}
    renderItem={renderItem}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    windowSize={5}
    removeClippedSubviews={Platform.OS === 'android'}
    getItemLayout={(data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })}
  />
  ```
- **List Item Components**:
  - Wrap the `renderItem` component in `React.memo` with a custom comparison function if props rarely change.
  - Avoid defining inline arrow functions inside `renderItem` props (e.g., `onPress={() => handlePress(item.id)}`). Instead, pass the ID to the item component and handle invocation internally.

---

## 2. Image Optimization with `expo-image`

Never use the legacy React Native `Image` component. Always use `expo-image`:
- **Caching**: Ensure `cachePolicy="memory-disk"` is specified for remote avatars and expense receipts.
- **Placeholders**: Provide a low-resolution blurhash or placeholder color to prevent layout jump while loading:
  ```tsx
  import { Image } from 'expo-image';

  <Image
    source={{ uri: imageUrl }}
    placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
    contentFit="cover"
    transition={200}
    cachePolicy="memory-disk"
    className="w-12 h-12 rounded-full"
  />
  ```

---

## 3. State Management & Zustand Selectors

Prevent full-component re-renders when only a single slice of global state changes:

- ❌ **Bad (Re-renders on ANY store update):**
  ```tsx
  const { user, token, settings, updateProfile } = useAuthStore();
  ```
- ✅ **Good (Atomic Selectors - only re-renders when `user` changes):**
  ```tsx
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  ```

---

## 4. JS Thread Hygiene

- Do not perform expensive synchronous calculations (e.g., massive bill splitting math with hundreds of users) during render passes.
- Wrap heavy calculations in `useMemo`.
- Never leave active `setInterval` timers un-cleared in `useEffect` cleanup return functions.