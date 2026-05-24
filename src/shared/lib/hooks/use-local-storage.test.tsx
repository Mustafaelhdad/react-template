import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useLocalStorage } from './use-local-storage'

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('useLocalStorage', () => {
  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))
    expect(result.current[0]).toBe(0)
  })

  it('reads an existing value from storage', () => {
    window.localStorage.setItem('count', JSON.stringify(7))
    const { result } = renderHook(() => useLocalStorage('count', 0))
    expect(result.current[0]).toBe(7)
  })

  it('persists updates to storage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => result.current[1](5))
    expect(result.current[0]).toBe(5)
    expect(window.localStorage.getItem('count')).toBe(JSON.stringify(5))

    act(() => result.current[1]((prev) => prev + 1))
    expect(result.current[0]).toBe(6)
  })

  it('remove() clears storage and resets to initial', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))
    act(() => result.current[1](42))
    expect(window.localStorage.getItem('count')).toBe(JSON.stringify(42))

    act(() => result.current[2]())
    expect(result.current[0]).toBe(0)
    expect(window.localStorage.getItem('count')).toBeNull()
  })

  it('syncs to changes from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'count',
          newValue: JSON.stringify(99),
        }),
      )
    })

    expect(result.current[0]).toBe(99)
  })
})
