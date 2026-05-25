import { z } from 'zod'

const envSchema = z
  .object({
    MODE: z.string(),
    DEV: z.boolean(),
    PROD: z.boolean(),
    VITE_API_BASE_URL: z.string().url().optional().or(z.literal('')),
    VITE_APP_NAME: z.string().min(1).optional(),
    VITE_ENABLE_MSW: z.enum(['true', 'false']).optional(),
    VITE_SENTRY_DSN: z.string().url().optional().or(z.literal('')),
    VITE_ANALYTICS_KEY: z.string().optional(),
  })
  .passthrough()

const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${z.prettifyError(parsedEnv.error)}`)
}

export const env = {
  mode: parsedEnv.data.MODE,
  isDev: parsedEnv.data.DEV,
  isProd: parsedEnv.data.PROD,
  appName: parsedEnv.data.VITE_APP_NAME ?? 'React Template',
  apiBaseUrl: parsedEnv.data.VITE_API_BASE_URL || '/api',
  enableMsw: parsedEnv.data.VITE_ENABLE_MSW === 'true',
  sentryDsn: parsedEnv.data.VITE_SENTRY_DSN || undefined,
  analyticsKey: parsedEnv.data.VITE_ANALYTICS_KEY || undefined,
} as const
