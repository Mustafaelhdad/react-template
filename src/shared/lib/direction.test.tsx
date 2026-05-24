import { act, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { i18n } from '@/shared/i18n'

import { DirectionProvider, useDirection } from './direction'

function wrapper({ children }: { children: React.ReactNode }) {
  return <DirectionProvider>{children}</DirectionProvider>
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
  document.documentElement.removeAttribute('dir')
  document.documentElement.removeAttribute('lang')
})

afterEach(async () => {
  await i18n.changeLanguage('en')
})

describe('useDirection', () => {
  it('returns ltr for English', () => {
    const { result } = renderHook(() => useDirection(), { wrapper })
    expect(result.current).toBe('ltr')
  })

  it('returns rtl for Arabic and updates when the language changes', async () => {
    const { result } = renderHook(() => useDirection(), { wrapper })

    expect(result.current).toBe('ltr')

    await act(async () => {
      await i18n.changeLanguage('ar')
    })

    expect(result.current).toBe('rtl')
  })
})

describe('DirectionProvider', () => {
  it('sets <html dir> and <html lang> to match the active language', async () => {
    render(
      <DirectionProvider>
        <p>child</p>
      </DirectionProvider>,
    )

    expect(screen.getByText('child')).toBeInTheDocument()
    expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    expect(document.documentElement.getAttribute('lang')).toBe('en')

    await act(async () => {
      await i18n.changeLanguage('ar')
    })

    expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    expect(document.documentElement.getAttribute('lang')).toBe('ar')
  })
})
