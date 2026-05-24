import { Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { renderWithProviders, screen } from '@/test/test-utils'

import { useAuthStore } from '../model/auth-store'
import { RoleGuard } from './role-guard'

function AdminOnly() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <RoleGuard roles={['admin']}>
            <p>admin content</p>
          </RoleGuard>
        }
      />
      <Route path="/" element={<p>home page</p>} />
      <Route path="/login" element={<p>login page</p>} />
    </Routes>
  )
}

beforeEach(() => {
  window.localStorage.clear()
  useAuthStore.getState().logout()
})

afterEach(() => {
  useAuthStore.getState().logout()
})

describe('RoleGuard', () => {
  it('renders the children when the user has one of the allowed roles', () => {
    useAuthStore.getState().setSession({
      accessToken: 'mock',
      user: {
        id: 'u1',
        name: 'Demo',
        email: 'demo@example.com',
        role: 'admin',
        roles: ['admin'],
      },
    })

    renderWithProviders(<AdminOnly />, { route: '/admin' })
    expect(screen.getByText('admin content')).toBeInTheDocument()
  })

  it('redirects to the fallback when the user is missing the role', () => {
    useAuthStore.getState().setSession({
      accessToken: 'mock',
      user: {
        id: 'u1',
        name: 'Demo',
        email: 'demo@example.com',
        role: 'user',
        roles: ['user'],
      },
    })

    renderWithProviders(<AdminOnly />, { route: '/admin' })
    expect(screen.getByText('home page')).toBeInTheDocument()
  })

  it('redirects unauthenticated visitors to the login page', () => {
    renderWithProviders(<AdminOnly />, { route: '/admin' })
    expect(screen.getByText('login page')).toBeInTheDocument()
  })
})
