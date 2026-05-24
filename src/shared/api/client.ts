import axios from 'axios'

import { env } from '@/shared/config'

import { getAuthToken, handleUnauthorized } from './auth-bridge'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized()
    }
    return Promise.reject(error)
  },
)
