import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCopyToClipboard } from './use-copy-to-clipboard'

const originalClipboard = navigator.clipboard

function installClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    writable: true,
    value: { writeText },
  })
}

afterEach(() => {
  vi.useRealTimers()
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    writable: true,
    value: originalClipboard,
  })
})

describe('useCopyToClipboard', () => {
  it('writes to the clipboard and flips copied to true', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    installClipboard(writeText)

    const { result } = renderHook(() => useCopyToClipboard(50))

    await act(async () => {
      await result.current.copy('hello')
    })

    expect(writeText).toHaveBeenCalledWith('hello')
    expect(result.current.copied).toBe(true)
    expect(result.current.state).toBe('copied')

    await waitFor(() => expect(result.current.copied).toBe(false))
  })

  it('reports errors when the clipboard write rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    installClipboard(writeText)

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      const ok = await result.current.copy('hello')
      expect(ok).toBe(false)
    })

    expect(result.current.state).toBe('error')
    expect(result.current.error?.message).toBe('denied')
  })

  it('reset() returns to the idle state', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    installClipboard(writeText)

    const { result } = renderHook(() => useCopyToClipboard(0))

    await act(async () => {
      await result.current.copy('hello')
    })
    expect(result.current.copied).toBe(true)

    act(() => result.current.reset())
    expect(result.current.state).toBe('idle')
    expect(result.current.error).toBeNull()
  })
})
