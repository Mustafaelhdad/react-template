import { useCallback, useEffect, useState } from 'react'

import { storage } from '../storage'

type SetValue<TValue> = TValue | ((prev: TValue) => TValue)

/**
 * Persists state to `localStorage` under `key`. Reads the initial value
 * from storage if present; otherwise falls back to `initial`. Syncs
 * across tabs via the `storage` event.
 */
export function useLocalStorage<TValue>(
  key: string,
  initial: TValue,
): [TValue, (value: SetValue<TValue>) => void, () => void] {
  const [value, setValue] = useState<TValue>(() => {
    const stored = storage.get<TValue>(key)
    return stored === null ? initial : stored
  })

  const update = useCallback(
    (next: SetValue<TValue>) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (prev: TValue) => TValue)(prev) : next
        storage.set(key, resolved)
        return resolved
      })
    },
    [key],
  )

  const remove = useCallback(() => {
    storage.remove(key)
    setValue(initial)
  }, [key, initial])

  useEffect(() => {
    if (typeof window === 'undefined') return

    function onStorage(event: StorageEvent) {
      if (event.key !== key) return
      if (event.newValue === null) {
        setValue(initial)
        return
      }
      try {
        setValue(JSON.parse(event.newValue) as TValue)
      } catch {
        // ignore malformed payloads from other tabs
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, initial])

  return [value, update, remove]
}
