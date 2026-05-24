import { useCallback, useEffect, useRef } from 'react'

/**
 * Returns a stable getter that reports whether the component is still
 * mounted. Useful for guarding async callbacks against state updates
 * after unmount.
 */
export function useIsMounted(): () => boolean {
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return useCallback(() => mountedRef.current, [])
}
