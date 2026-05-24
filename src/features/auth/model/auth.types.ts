import type { User } from '@/entities'

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthSession = {
  user: User
  accessToken: string
}
