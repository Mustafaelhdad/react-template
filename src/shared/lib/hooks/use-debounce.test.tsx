import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from './use-debounce'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 200))
    expect(result.current).toBe('hello')
  })

  it('updates only after the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('b')
  })

  it('resets the timer when the value changes again', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    rerender({ value: 'c' })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe('c')
  })
})
