import { useState } from 'react'

/**
 * Returns the previous value of `value` from the prior render, or
 * `undefined` on the first render.
 */
export function usePrevious<TValue>(value: TValue): TValue | undefined {
  const [tracked, setTracked] = useState<{
    current: TValue
    previous: TValue | undefined
  }>(() => ({ current: value, previous: undefined }))

  if (!Object.is(tracked.current, value)) {
    setTracked({ current: value, previous: tracked.current })
  }

  return Object.is(tracked.current, value) ? tracked.previous : tracked.current
}
