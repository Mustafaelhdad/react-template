import { useAuthStore } from '@/features/auth'
import { setAuthTokenProvider, setUnauthorizedHandler } from '@/shared/api'
import { ROUTES } from '@/shared/config'

import { router } from './router'

setAuthTokenProvider(() => useAuthStore.getState().accessToken)

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout()
  void router.navigate(ROUTES.sessionExpired)
})
