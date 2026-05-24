import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders, screen, waitFor } from '@/test/test-utils'

import { useAuthStore } from '../model/auth-store'
import { LoginForm } from './login-form'

describe('LoginForm', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useAuthStore.getState().logout()
  })

  it('validates the email and password fields', async () => {
    const user = userEvent.setup()

    renderWithProviders(<LoginForm />)

    await user.clear(screen.getByLabelText(/email/i))
    await user.clear(screen.getByLabelText(/password/i))
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(
      screen.getByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('saves the mock auth session after a successful login', async () => {
    const user = userEvent.setup()
    const handleSuccess = vi.fn()

    renderWithProviders(<LoginForm onSuccess={handleSuccess} />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1)
    })

    expect(useAuthStore.getState()).toMatchObject({
      isAuthenticated: true,
      accessToken: 'mock-access-token',
      user: {
        email: 'demo@example.com',
        name: 'Demo',
        role: 'admin',
      },
    })
  })
})
