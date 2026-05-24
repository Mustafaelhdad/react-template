/**
 * Query-key factory for the `users` feature.
 *
 * Pattern: a single root tuple per resource, with progressively narrower
 * tuples for each scope. Calling `userKeys.all` invalidates every query in
 * the feature; `userKeys.lists()` invalidates all list variants;
 * `userKeys.detail(id)` invalidates a single record.
 *
 * Use the same shape for new features — it keeps invalidations precise and
 * makes keys discoverable from a single export.
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...userKeys.lists(), filters ?? {}] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}
