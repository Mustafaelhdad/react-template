import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

import { storage } from './storage'

const THEME_STORAGE_KEY = 'react-template:theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function subscribeSystem(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getSystemDark() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(DARK_QUERY).matches
}

function applyToDom(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
}

type ThemeProviderProps = {
  children: ReactNode
  /**
   * Theme used on first render before localStorage is consulted. Should
   * match the inline script in `index.html`.
   */
  defaultTheme?: Theme
}

/**
 * Mounts a theme context backed by localStorage. The inline script in
 * `index.html` is what prevents FOUC on first paint — this provider keeps
 * the `<html class="dark">` toggle in sync afterwards.
 */
export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = storage.get<Theme>(THEME_STORAGE_KEY)
    return stored ?? defaultTheme
  })

  // System preference, observed via matchMedia. Subscribed even when the
  // user has chosen 'light' or 'dark' explicitly — it's a tiny store and
  // keeps the resolution branchless.
  const systemDark = useSyncExternalStore(subscribeSystem, getSystemDark, () => false)

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === 'system') return systemDark ? 'dark' : 'light'
    return theme
  }, [theme, systemDark])

  // Single side effect: keep the `<html>` class in sync with the resolved
  // theme. No state writes inside the effect body.
  useEffect(() => {
    applyToDom(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((next: Theme) => {
    storage.set(THEME_STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }
  return ctx
}
