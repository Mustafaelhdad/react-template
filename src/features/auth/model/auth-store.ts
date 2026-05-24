import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AuthSession } from './auth.types'

const AUTH_STORAGE_KEY = 'react-template:auth'

type AuthState = {
  user: AuthSession['user'] | null
  accessToken: string | null
  isAuthenticated: boolean
}

type AuthActions = {
  setSession: (session: AuthSession) => void
  logout: () => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: (session) => {
        set({
          user: session.user,
          accessToken: session.accessToken,
          isAuthenticated: true,
        })
      },
      logout: () => {
        set(initialState)
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
