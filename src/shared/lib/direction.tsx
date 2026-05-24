import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { getDirection } from '@/shared/i18n'

export type Direction = 'ltr' | 'rtl'

/**
 * Keeps `<html dir>` and `<html lang>` in sync with the active i18next
 * language. Mount once near the root, above any component that reads
 * `useDirection()`.
 */
export function DirectionProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const direction = getDirection(i18n.language)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.setAttribute('dir', direction)
    root.setAttribute('lang', i18n.language)
  }, [direction, i18n.language])

  return <>{children}</>
}

/**
 * Returns the current writing direction derived from the active i18next
 * language. Components can use this to flip directional iconography or
 * apply asymmetric spacing where Tailwind logical properties don't suffice.
 */
export function useDirection(): Direction {
  const { i18n } = useTranslation()
  return getDirection(i18n.language)
}
