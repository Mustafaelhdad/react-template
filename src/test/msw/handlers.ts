import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from '@/shared/api'
import { env } from '@/shared/config'

// The axios client prefixes every request with `env.apiBaseUrl` (default
// `/api`), so handlers must include that prefix too. Relative paths match
// any origin, so the same handler works in node (tests) and the browser
// (dev) regardless of how `VITE_API_BASE_URL` is configured locally.
function endpoint(path: string) {
  const base = env.apiBaseUrl.startsWith('http')
    ? new URL(env.apiBaseUrl).pathname.replace(/\/$/, '')
    : env.apiBaseUrl.replace(/\/$/, '')
  return `${base}${path}`
}

type LoginPayload = {
  email?: string
  password?: string
}

function getDisplayName(email: string) {
  const [name] = email.split('@')
  return name
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const handlers = [
  http.post(endpoint(ENDPOINTS.auth.login), async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as LoginPayload

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Email and password are required' },
        { status: 400 },
      )
    }

    if (body.email.toLowerCase() === 'error@example.com') {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    return HttpResponse.json({
      accessToken: 'mock-access-token',
      user: {
        id: 'demo-user',
        name: getDisplayName(body.email) || 'Demo User',
        email: body.email,
        role: 'admin',
        roles: ['admin', 'user'],
      },
    })
  }),
]
