import { useCallback, useEffect, useRef, useState } from 'react'

export type CopyState = 'idle' | 'copied' | 'error'

export type UseCopyToClipboardResult = {
  copy: (text: string) => Promise<boolean>
  copied: boolean
  state: CopyState
  error: Error | null
  reset: () => void
}

/**
 * Copies text to the clipboard and surfaces a transient `copied` flag
 * that flips back to `false` after `resetAfterMs` (default 2s). Falls
 * back to a hidden `<textarea>` + `execCommand` when the async API is
 * unavailable (e.g. insecure context).
 */
export function useCopyToClipboard(resetAfterMs = 2000): UseCopyToClipboardResult {
  const [state, setState] = useState<CopyState>('idle')
  const [error, setError] = useState<Error | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => clearTimer, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setState('idle')
    setError(null)
  }, [clearTimer])

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      clearTimer()
      try {
        if (
          typeof navigator !== 'undefined' &&
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
        ) {
          await navigator.clipboard.writeText(text)
        } else if (typeof document !== 'undefined') {
          const area = document.createElement('textarea')
          area.value = text
          area.setAttribute('readonly', '')
          area.style.position = 'absolute'
          area.style.left = '-9999px'
          document.body.appendChild(area)
          area.select()
          const ok = document.execCommand('copy')
          document.body.removeChild(area)
          if (!ok) throw new Error('execCommand("copy") returned false')
        } else {
          throw new Error('Clipboard is not available in this environment')
        }

        setState('copied')
        setError(null)
        if (resetAfterMs > 0) {
          timeoutRef.current = window.setTimeout(() => {
            setState('idle')
            timeoutRef.current = null
          }, resetAfterMs)
        }
        return true
      } catch (err) {
        setState('error')
        setError(err instanceof Error ? err : new Error(String(err)))
        return false
      }
    },
    [resetAfterMs, clearTimer],
  )

  return { copy, copied: state === 'copied', state, error, reset }
}
