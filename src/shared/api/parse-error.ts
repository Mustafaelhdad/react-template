import axios from 'axios'

export type ParsedApiError = {
  message: string
  status?: number
}

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.'

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
      message: serverMessage ?? error.message ?? DEFAULT_MESSAGE,
      status,
    }
  }

  if (error instanceof Error && error.message) {
    return { message: error.message }
  }

  if (typeof error === 'string' && error.trim()) {
    return { message: error }
  }

  return { message: DEFAULT_MESSAGE }
}
