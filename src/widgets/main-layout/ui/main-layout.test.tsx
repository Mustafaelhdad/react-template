import { render, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AppProviders } from '@/app/providers'
import { registerMonitoring, resetMonitoring } from '@/shared/lib/monitoring'

import { MainLayout } from './main-layout'

function ThrowingView(): never {
  throw new Error('View exploded')
}

describe('MainLayout error boundary', () => {
  afterEach(() => {
    resetMonitoring()
    vi.restoreAllMocks()
  })

  it('captures errors thrown by route views', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const captureError = vi.fn()
    registerMonitoring({ captureError, captureEvent: vi.fn() })

    const router = createMemoryRouter([
      {
        element: <MainLayout />,
        children: [{ index: true, element: <ThrowingView /> }],
      },
    ])

    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    await waitFor(() => {
      expect(captureError).toHaveBeenCalledWith(expect.any(Error), {
        source: 'react-route-error-boundary',
      })
    })
  })
})
