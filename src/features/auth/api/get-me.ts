import type { User } from '@/entities'
import { apiClient, ENDPOINTS } from '@/shared/api'

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>(ENDPOINTS.auth.me)
  return data
}
