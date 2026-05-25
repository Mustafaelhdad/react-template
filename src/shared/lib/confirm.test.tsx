import { act, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'

import { i18n } from '@/shared/i18n'

import { ConfirmProvider, useConfirm } from './confirm'

function wrapper({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ConfirmProvider>{children}</ConfirmProvider>
    </I18nextProvider>
  )
}

describe('useConfirm', () => {
  it('resolves with true when the confirm button is clicked', async () => {
    const { result } = renderHook(() => useConfirm(), { wrapper })

    let promise!: Promise<boolean>
    act(() => {
      promise = result.current({ title: 'Delete row?' })
    })

    const confirmButton = await screen.findByRole('button', { name: 'Confirm' })
    await userEvent.setup().click(confirmButton)

    await expect(promise).resolves.toBe(true)
  })

  it('resolves with false when the cancel button is clicked', async () => {
    const { result } = renderHook(() => useConfirm(), { wrapper })

    let promise!: Promise<boolean>
    act(() => {
      promise = result.current({ title: 'Discard?' })
    })

    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
    await userEvent.setup().click(cancelButton)

    await expect(promise).resolves.toBe(false)
  })

  it('uses caller-provided labels and renders the description', async () => {
    const { result } = renderHook(() => useConfirm(), { wrapper })

    act(() => {
      void result.current({
        title: 'Sign out?',
        description: 'You will need to sign in again.',
        confirmLabel: 'Sign out',
        cancelLabel: 'Stay',
        destructive: true,
      })
    })

    expect(await screen.findByText('Sign out?')).toBeInTheDocument()
    expect(screen.getByText('You will need to sign in again.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stay' })).toBeInTheDocument()
  })

  it('resolves with false when the dialog is dismissed via escape', async () => {
    const { result } = renderHook(() => useConfirm(), { wrapper })

    let promise!: Promise<boolean>
    act(() => {
      promise = result.current({ title: 'Confirm me' })
    })

    await screen.findByText('Confirm me')
    await userEvent.setup().keyboard('{Escape}')

    await expect(promise).resolves.toBe(false)
    await waitFor(() => {
      expect(screen.queryByText('Confirm me')).not.toBeInTheDocument()
    })
  })

  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useConfirm())).toThrow(
      /useConfirm must be used inside <ConfirmProvider>/,
    )
  })
})
