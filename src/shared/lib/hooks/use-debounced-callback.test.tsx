import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedCallback } from './use-debounced-callback'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebouncedCallback', () => {
  it('invokes the callback once after the delay', () => {
    const spy = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(spy, 200))

    act(() => {
      result.current('a')
      result.current('b')
      result.current('c')
    })

    expect(spy).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('c')
  })

  it('uses the latest callback reference', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, rerender } = renderHook(({ cb }) => useDebouncedCallback(cb, 200), {
      initialProps: { cb: first },
    })

    act(() => result.current('x'))
    rerender({ cb: second })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledWith('x')
  })

  it('cancel() drops the pending call', () => {
    const spy = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(spy, 200))

    act(() => result.current('a'))
    act(() => result.current.cancel())
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(spy).not.toHaveBeenCalled()
  })

  it('flush() invokes the pending call immediately', () => {
    const spy = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(spy, 200))

    act(() => result.current('a'))
    act(() => result.current.flush())

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('a')

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('cancels pending calls on unmount', () => {
    const spy = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(spy, 200))

    act(() => result.current('a'))
    unmount()
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(spy).not.toHaveBeenCalled()
  })
})
