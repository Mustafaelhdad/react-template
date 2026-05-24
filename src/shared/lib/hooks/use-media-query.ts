import { useCallback, useSyncExternalStore } from 'react'

function isSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
}

/**
 * Returns whether the given media query currently matches. Subscribes to
 * `matchMedia` change events so the value stays in sync with the viewport.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!isSupported()) return () => undefined
      const list = window.matchMedia(query)
      list.addEventListener('change', notify)
      return () => list.removeEventListener('change', notify)
    },
    [query],
  )

  const getSnapshot = useCallback(() => {
    if (!isSupported()) return false
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
