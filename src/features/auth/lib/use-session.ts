import { useQuery } from '@tanstack/react-query'

import { getMe } from '../api/get-me'
import { authKeys } from '../model/auth-keys'
import { useAuthStore } from '../model/auth-store'

const SESSION_STALE_TIME = 5 * 60 * 1000

/**
 * Resolves the current user's session via `/auth/me`.
 *
 * Seeded with the persisted user from `useAuthStore` as `initialData`, so an
 * authenticated reload renders immediately instead of waiting on the
 * network. The 5-minute `staleTime` and disabled `refetchOnReconnect` keep
 * that endpoint from being re-hit on every mount or network blip — session
 * data rarely changes.
 *
 * `useAuthStore` stays the single source of truth for `user`: the fetched
 * value is written back into the store as part of `queryFn` rather than
 * mirrored afterwards via a separate effect.
 */
export function useSessionQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const persistedUser = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const user = await getMe()
      setUser(user)
      return user
    },
    enabled: isAuthenticated,
    initialData: persistedUser ?? undefined,
    staleTime: SESSION_STALE_TIME,
    refetchOnReconnect: false,
  })
}
