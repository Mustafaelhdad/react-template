import axios from 'axios'

import { i18n } from '@/shared/i18n'

export type ParsedApiError = {
  message: string
  status?: number
}

// Common server-side messages (e.g. from Laravel/Sanctum) mapped to translation
// keys so users see a localized message instead of raw backend text.
const KNOWN_MESSAGE_KEYS = new Map<string, string>([
  ['CSRF token mismatch.', 'errors.csrfMismatch'],
  ['Network Error', 'errors.networkError'],
  ['Unauthenticated.', 'errors.unauthenticated'],
  ['Invalid email or password', 'errors.invalidCredentials'],
])

function localizeMessage(message: string): string {
  const key = KNOWN_MESSAGE_KEYS.get(message.trim())
  return key ? i18n.t(key) : message
}

function getDefaultMessage(): string {
  return i18n.t('errors.default')
}

function extractServerMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const record = data as Record<string, unknown>
  const candidates = [record.message, record.error, record.detail]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate
    }
  }
  return undefined
}

export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const serverMessage = extractServerMessage(error.response?.data)
    return {
      message: localizeMessage(serverMessage ?? error.message ?? getDefaultMessage()),
      status,
    }
  }

  if (error instanceof Error && error.message) {
    return { message: localizeMessage(error.message) }
  }

  if (typeof error === 'string' && error.trim()) {
    return { message: localizeMessage(error) }
  }

  return { message: getDefaultMessage() }
}
