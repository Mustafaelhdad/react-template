import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useDisclosure } from './use-disclosure'

describe('useDisclosure', () => {
  it('defaults to closed', () => {
    const { result } = renderHook(() => useDisclosure())
    expect(result.current.isOpen).toBe(false)
  })

  it('honors the initial value', () => {
    const { result } = renderHook(() => useDisclosure(true))
    expect(result.current.isOpen).toBe(true)
  })

  it('open / close / toggle work as expected', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)

    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.setOpen(false))
    expect(result.current.isOpen).toBe(false)
  })
})
