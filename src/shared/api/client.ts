import axios from 'axios'

import { env } from '@/shared/config'
import { captureError } from '@/shared/lib/monitoring'

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
    const isAxiosError = axios.isAxiosError(error)

    captureError(error, {
      source: 'axios',
      context: isAxiosError
        ? {
            method: error.config?.method,
            status: error.response?.status,
            url: error.config?.url,
          }
        : undefined,
    })

    if (isAxiosError && error.response?.status === 401) {
      handleUnauthorized()
    }
    return Promise.reject(error)
  },
)
