---
name: resilient-api-query
description: Robust API communication and state synchronization patterns using Axios, 401 token refresh queue, TanStack Query v5, and Zod runtime schema validation.
---
# Resilient API & Server State Skill

## 1. Axios Architecture & Interceptor Hygiene (`src/lib/api.ts`)

- **Centralized Client:** Every network call must go through the configured Axios instance in `src/lib/api.ts`.
- **401 Token Refresh Queue:**
  - When an access token expires, all concurrent requests that receive a 401 must be placed into a retry queue (`failedQueue`).
  - Exactly **one** refresh request is dispatched to `/auth/refresh` using the stored refresh token.
  - If refresh succeeds: All queued requests are resolved with the new access token and retried.
  - If refresh fails: Secure storage is cleared, the user session is reset via `auth.store.ts`, and the router navigates to `/(auth)/login`.
- **No Infinite Loops:** The token refresh call must use a separate vanilla axios instance to avoid triggering the 401 interceptor recursively.

---

## 2. TanStack Query v5 Best Practices

- **Query Key Conventions:**
  - Always structure query keys as hierarchical arrays:
    ```tsx
    export const expenseKeys = {
      all: ['expenses'] as const,
      lists: () => [...expenseKeys.all, 'list'] as const,
      list: (filters: ExpenseFilters) => [...expenseKeys.lists(), filters] as const,
      details: () => [...expenseKeys.all, 'detail'] as const,
      detail: (id: string) => [...expenseKeys.details(), id] as const,
    };
    ```
- **Stale Time Configuration:**
  - Do not keep `staleTime: 0` for all queries. Set reasonable stale times (e.g., `5 * 60 * 1000` for user profile and settings, `30 * 1000` for group expenses) to minimize unnecessary network traffic.
- **Optimistic Updates:**
  - For frequent user actions (e.g., adding an expense, toggling split status), use `onMutate` to optimistically update the query cache, `onError` to rollback cache via context snapshot, and `onSettled` to invalidate and re-fetch.

---

## 3. Runtime Type Validation with Zod

- Always validate external backend payloads at the network boundary:
  ```tsx
  import { z } from 'zod';

  export const ExpenseSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    amount: z.number().positive(),
    currency: z.string().default('VND'),
    createdAt: z.string(),
  });

  export type Expense = z.infer<typeof ExpenseSchema>;
  ```
- Use `ExpenseSchema.safeParse(response.data)` to handle unexpected API schema changes gracefully without crashing the React component tree.