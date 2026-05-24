import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import ar from './ar.json'
import en from './en.json'

export const LANGUAGE_STORAGE_KEY = 'react-template:language'

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const RTL_LANGUAGES: ReadonlySet<SupportedLanguage> = new Set(['ar'])

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const

if (!i18n.isInitialized) {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
        caches: ['localStorage'],
      },
      returnNull: false,
    })
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

export function getDirection(language: string): 'ltr' | 'rtl' {
  return isSupportedLanguage(language) && RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr'
}

export { i18n }
export default i18n
