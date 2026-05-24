import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useInterval } from './use-interval'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useInterval', () => {
  it('calls the callback on each tick', () => {
    const spy = vi.fn()
    renderHook(() => useInterval(spy, 100))

    act(() => {
      vi.advanceTimersByTime(350)
    })
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('pauses when delay is null', () => {
    const spy = vi.fn()
    renderHook(() => useInterval(spy, null))

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(spy).not.toHaveBeenCalled()
  })

  it('uses the latest callback without resetting the timer', () => {
    const first = vi.fn()
    const second = vi.fn()

    const { rerender } = renderHook(({ cb }) => useInterval(cb, 100), {
      initialProps: { cb: first },
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(first).toHaveBeenCalledTimes(1)

    rerender({ cb: second })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(second).toHaveBeenCalledTimes(1)
    expect(first).toHaveBeenCalledTimes(1)
  })

  it('clears the interval on unmount', () => {
    const spy = vi.fn()
    const { unmount } = renderHook(() => useInterval(spy, 100))
    unmount()
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(spy).not.toHaveBeenCalled()
  })
})
