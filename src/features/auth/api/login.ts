import { apiClient, ENDPOINTS } from '@/shared/api'

import type { AuthSession, LoginCredentials } from '../model/auth.types'

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>(ENDPOINTS.auth.login, credentials)
  return data
}
