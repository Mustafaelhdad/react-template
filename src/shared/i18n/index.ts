import i18next, { type i18n as I18nInstance, type Resource } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import ar from './ar.json'
import en from './en.json'

export const LANGUAGE_STORAGE_KEY = 'react-template:language'

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const RTL_LANGUAGES: ReadonlySet<SupportedLanguage> = new Set(['ar'])

const PROJECT_DEFAULT_LANGUAGE: SupportedLanguage = 'en'
const PROJECT_FALLBACK_LANGUAGE: SupportedLanguage = 'en'

const resources: Resource = {
  en: { translation: en },
  ar: { translation: ar },
} as const

type LanguageEnv = {
  readonly [key: string]: unknown
  readonly VITE_DEFAULT_LANGUAGE?: string
  readonly VITE_FALLBACK_LANGUAGE?: string
}

type LanguageStorage = Pick<Storage, 'getItem'> | null

type ResolveLanguageConfigOptions = {
  env?: LanguageEnv
  storage?: LanguageStorage
  projectDefaultLanguage?: SupportedLanguage
  projectFallbackLanguage?: SupportedLanguage
}

type CreateI18nOptions = ResolveLanguageConfigOptions & {
  appResources?: Resource
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

function resolveLanguage(
  value: string | undefined,
  fallback: SupportedLanguage,
  envName: 'VITE_DEFAULT_LANGUAGE' | 'VITE_FALLBACK_LANGUAGE',
): SupportedLanguage {
  if (!value) return fallback
  if (isSupportedLanguage(value)) return value

  throw new Error(
    `${envName} must be one of: ${SUPPORTED_LANGUAGES.join(', ')}. Received "${value}".`,
  )
}

function getBrowserStorage(): LanguageStorage {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function getPersistedLanguage(storage: LanguageStorage): SupportedLanguage | null {
  if (!storage) return null

  try {
    const value = storage.getItem(LANGUAGE_STORAGE_KEY)
    return value && isSupportedLanguage(value) ? value : null
  } catch {
    return null
  }
}

export function resolveLanguageConfig({
  env = import.meta.env,
  storage = getBrowserStorage(),
  projectDefaultLanguage = PROJECT_DEFAULT_LANGUAGE,
  projectFallbackLanguage = PROJECT_FALLBACK_LANGUAGE,
}: ResolveLanguageConfigOptions = {}) {
  const defaultLanguage = resolveLanguage(
    env.VITE_DEFAULT_LANGUAGE,
    projectDefaultLanguage,
    'VITE_DEFAULT_LANGUAGE',
  )
  const fallbackLanguage = resolveLanguage(
    env.VITE_FALLBACK_LANGUAGE,
    projectFallbackLanguage,
    'VITE_FALLBACK_LANGUAGE',
  )

  return {
    defaultLanguage,
    fallbackLanguage,
    initialLanguage: getPersistedLanguage(storage) ?? defaultLanguage,
  } as const
}

const languageConfig = resolveLanguageConfig()

export const DEFAULT_LANGUAGE: SupportedLanguage = languageConfig.defaultLanguage
export const FALLBACK_LANGUAGE: SupportedLanguage = languageConfig.fallbackLanguage
export const INITIAL_LANGUAGE: SupportedLanguage = languageConfig.initialLanguage

export function createI18n({
  appResources = resources,
  ...options
}: CreateI18nOptions = {}): I18nInstance {
  const config = resolveLanguageConfig(options)
  const instance = i18next.createInstance()

  void instance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: appResources,
      lng: config.initialLanguage,
      supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
      fallbackLng: config.fallbackLanguage,
      initAsync: false,
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage'],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
        caches: ['localStorage'],
      },
      returnNull: false,
    })

  return instance
}

export const i18n = createI18n()

export function getDirection(language: string): 'ltr' | 'rtl' {
  return isSupportedLanguage(language) && RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr'
}

export function getSupportedLanguage(
  language: string | undefined,
  fallback: SupportedLanguage = DEFAULT_LANGUAGE,
): SupportedLanguage {
  return language && isSupportedLanguage(language) ? language : fallback
}

export function applyLanguageAttributes(language = INITIAL_LANGUAGE) {
  if (typeof document === 'undefined') return

  const resolvedLanguage = getSupportedLanguage(language)
  const root = document.documentElement
  root.setAttribute('lang', resolvedLanguage)
  root.setAttribute('dir', getDirection(resolvedLanguage))
}

export default i18n
