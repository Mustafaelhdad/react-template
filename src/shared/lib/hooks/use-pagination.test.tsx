import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { usePagination } from './use-pagination'

describe('usePagination', () => {
  it('computes pageCount and bounds for the first page', () => {
    const { result } = renderHook(() => usePagination({ total: 95, perPage: 10 }))
    expect(result.current.pageCount).toBe(10)
    expect(result.current.page).toBe(1)
    expect(result.current.startIndex).toBe(0)
    expect(result.current.endIndex).toBe(10)
    expect(result.current.hasPrev).toBe(false)
    expect(result.current.hasNext).toBe(true)
  })

  it('next() and prev() move through pages', () => {
    const { result } = renderHook(() => usePagination({ total: 30, perPage: 10 }))
    act(() => result.current.next())
    expect(result.current.page).toBe(2)
    act(() => result.current.next())
    expect(result.current.page).toBe(3)
    expect(result.current.hasNext).toBe(false)
    act(() => result.current.next())
    expect(result.current.page).toBe(3)
    act(() => result.current.prev())
    expect(result.current.page).toBe(2)
  })

  it('clamps setPage to valid range', () => {
    const { result } = renderHook(() => usePagination({ total: 30, perPage: 10 }))
    act(() => result.current.setPage(99))
    expect(result.current.page).toBe(3)
    act(() => result.current.setPage(-5))
    expect(result.current.page).toBe(1)
  })

  it('handles an empty list with pageCount = 1', () => {
    const { result } = renderHook(() => usePagination({ total: 0, perPage: 10 }))
    expect(result.current.pageCount).toBe(1)
    expect(result.current.startIndex).toBe(0)
    expect(result.current.endIndex).toBe(0)
    expect(result.current.hasNext).toBe(false)
  })

  it('first() and last() jump to bounds', () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, perPage: 10, initialPage: 3 }),
    )
    act(() => result.current.last())
    expect(result.current.page).toBe(5)
    act(() => result.current.first())
    expect(result.current.page).toBe(1)
  })
})
