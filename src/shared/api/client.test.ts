import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { registerMonitoring, resetMonitoring } from '@/shared/lib/monitoring'
import { server } from '@/test/msw/server'

import { setUnauthorizedHandler } from './auth-bridge'
import { apiClient } from './client'

describe('apiClient monitoring', () => {
  afterEach(() => {
    resetMonitoring()
    setUnauthorizedHandler(() => undefined)
  })

  it('captures response errors before rejecting them', async () => {
    const captureError = vi.fn()
    registerMonitoring({ captureError, captureEvent: vi.fn() })

    server.use(
      http.get('/api/monitoring-failure', () =>
        HttpResponse.json({ message: 'Server failed' }, { status: 500 }),
      ),
    )

    await expect(apiClient.get('/monitoring-failure')).rejects.toMatchObject({
      response: { status: 500 },
    })

    expect(captureError).toHaveBeenCalledWith(expect.any(Error), {
      source: 'axios',
      context: {
        method: 'get',
        status: 500,
        url: '/monitoring-failure',
      },
    })
  })

  it('still runs the unauthorized handler after capturing a 401', async () => {
    const captureError = vi.fn()
    const handleUnauthorized = vi.fn()
    registerMonitoring({ captureError, captureEvent: vi.fn() })
    setUnauthorizedHandler(handleUnauthorized)

    server.use(
      http.get('/api/private', () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      ),
    )

    await expect(apiClient.get('/private')).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(captureError).toHaveBeenCalledTimes(1)
    expect(handleUnauthorized).toHaveBeenCalledTimes(1)
  })
})
