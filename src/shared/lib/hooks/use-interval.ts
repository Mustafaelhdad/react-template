import { useEffect, useRef } from 'react'

/**
 * Calls `callback` every `delay` ms. Pass `delay = null` to pause.
 * The callback ref updates between ticks, so closures over fresh state
 * stay correct without resetting the timer.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = window.setInterval(() => callbackRef.current(), delay)
    return () => window.clearInterval(id)
  }, [delay])
}
