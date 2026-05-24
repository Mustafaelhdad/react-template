import { useCallback, useEffect, useMemo, useRef } from 'react'

type AnyFn = (...args: never[]) => unknown

export type DebouncedCallback<TFn extends AnyFn> = ((
  ...args: Parameters<TFn>
) => void) & {
  cancel: () => void
  flush: () => void
}

/**
 * Returns a stable debounced wrapper around `callback`. Subsequent calls
 * within `delay` ms reset the timer. The wrapper exposes `cancel` to drop
 * any pending call and `flush` to invoke it immediately.
 */
export function useDebouncedCallback<TFn extends AnyFn>(
  callback: TFn,
  delay: number,
): DebouncedCallback<TFn> {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<number | null>(null)
  const pendingArgsRef = useRef<Parameters<TFn> | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    pendingArgsRef.current = null
  }, [])

  const flush = useCallback(() => {
    if (timeoutRef.current === null || pendingArgsRef.current === null) return
    window.clearTimeout(timeoutRef.current)
    const args = pendingArgsRef.current
    timeoutRef.current = null
    pendingArgsRef.current = null
    callbackRef.current(...args)
  }, [])

  useEffect(() => cancel, [cancel])

  return useMemo(() => {
    const debounced = ((...args: Parameters<TFn>) => {
      pendingArgsRef.current = args
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null
        const finalArgs = pendingArgsRef.current
        pendingArgsRef.current = null
        if (finalArgs) callbackRef.current(...finalArgs)
      }, delay)
    }) as DebouncedCallback<TFn>

    debounced.cancel = cancel
    debounced.flush = flush
    return debounced
  }, [delay, cancel, flush])
}
