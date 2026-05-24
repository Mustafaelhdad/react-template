import type { User } from '@/entities'
import { apiClient, ENDPOINTS } from '@/shared/api'

export type UpdateUserPayload = Partial<Pick<User, 'name' | 'email' | 'role'>>

export async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>(ENDPOINTS.users.list)
  return data
}

export async function fetchUser(id: string): Promise<User> {
  const { data } = await apiClient.get<User>(ENDPOINTS.users.detail(id))
  return data
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const { data } = await apiClient.patch<User>(ENDPOINTS.users.detail(id), payload)
  return data
}
