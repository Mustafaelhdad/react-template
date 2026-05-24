import type { AuthSession, LoginCredentials } from '../model/auth.types'

const MOCK_LOGIN_DELAY_MS = 300

function getDisplayName(email: string) {
  const [name] = email.split('@')

  return name
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  await new Promise((resolve) => window.setTimeout(resolve, MOCK_LOGIN_DELAY_MS))

  if (credentials.email.toLowerCase() === 'error@example.com') {
    throw new Error('Invalid email or password')
  }

  return {
    accessToken: 'mock-access-token',
    user: {
      id: 'demo-user',
      name: getDisplayName(credentials.email) || 'Demo User',
      email: credentials.email,
      role: 'admin',
    },
  }
}
