# API & Data Layer

The template ships an Axios client wired into the auth store, a normalized
error parser, React Query defaults, and a query-key factory pattern you can
copy into every feature.

## The Axios client

[`src/shared/api/client.ts`](../src/shared/api/client.ts) creates a single
`apiClient` configured from `env.apiBaseUrl`. Two interceptors are wired in:

- **Request** — attaches `Authorization: Bearer <token>` when the auth store
  has a token. The token is read via a small bridge module so `shared/api`
  never imports from a feature.
- **Response** — on `401`, calls `useAuthStore.logout()` and navigates to
  `/session-expired`. The bridge is registered once in
  [`src/app/init-api.ts`](../src/app/init-api.ts).

If you need a one-off client (different base URL, no credentials), create a
new `axios.create()` instance in the feature rather than mutating the shared
one.

## `parseApiError`

[`parseApiError(error)`](../src/shared/api/parse-error.ts) normalizes Axios
errors, thrown `Error` instances, strings, and unknown values into:

```ts
type ParsedApiError = { message: string; status?: number }
```

It prefers a server-provided message (`message`, `error`, or `detail` field
on the response body) and falls back to the Axios message, then a generic
default. Use it anywhere you need to render an error to a user.

## React Query defaults

Set in [`src/app/providers.tsx`](../src/app/providers.tsx):

| Option                 | Value    | Why                                                                  |
| ---------------------- | -------- | -------------------------------------------------------------------- |
| `staleTime`            | `30_000` | Cuts refetch chatter for the common "navigate away and back" pattern |
| `refetchOnWindowFocus` | `false`  | Avoids surprise refetches when the tab regains focus                 |
| `retry`                | `1`      | One retry is enough to recover from a transient blip; more is noisy  |

Override per-query when a screen needs different behavior (e.g. dashboards
that should poll).

## Query-key factory pattern

Each feature exports a single `<resource>Keys` object that is the source of
truth for that resource's query keys. The shape mirrors the granularity you
need to invalidate at:

```ts
// src/features/users/model/user-keys.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...userKeys.lists(), filters ?? {}] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}
```

Why this shape:

- `userKeys.all` — invalidate every users query (rarely needed, but a clean
  escape hatch).
- `userKeys.lists()` — invalidate every list variant after a mutation.
- `userKeys.list(filters)` — fetch one specific list.
- `userKeys.detail(id)` — fetch one record.

Inside hooks, always use the factory — never hand-write `['users', id]`
inline. That guarantees `invalidateQueries({ queryKey: userKeys.lists() })`
hits the right set after a mutation.

## Sample feature: `src/features/users`

A minimal end-to-end example you can copy:

- `api/users-api.ts` — `fetchUsers`, `fetchUser(id)`, `updateUser(id, payload)`
  hit `ENDPOINTS.users.*`.
- `model/user-keys.ts` — the factory shown above.
- `lib/use-users.ts` — `useUsers()`, `useUser(id)`, `useUpdateUser()` hooks.

`useUpdateUser` uses `useApiMutation` (below) so success toasts and error
toasts are wired automatically, and the `onSuccess` handler seeds the
detail cache and invalidates lists.

## `useApiMutation`

A thin wrapper around `useMutation` that adds:

- `successMessage` — shown via `notify.success` on success.
- `errorMessage` — shown via `notify.error` on failure; defaults to the
  message extracted by `parseApiError`.

```ts
const updateUser = useApiMutation<User, { id: string; payload: UpdateUserPayload }>({
  mutationFn: ({ id, payload }) => updateUser(id, payload),
  successMessage: 'User updated',
  onSuccess: (user) => {
    queryClient.setQueryData(userKeys.detail(user.id), user)
  },
})
```

Pass `errorMessage` to override the parsed error, or omit it to surface the
server's message directly.

## When to add an endpoint

Add the path to [`src/shared/api/endpoints.ts`](../src/shared/api/endpoints.ts)
when more than one caller needs it, or when the path is templated. One-off
calls inside a single feature can hardcode the path next to the request.
