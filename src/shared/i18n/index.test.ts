import { describe, expect, it } from 'vitest'

import {
  applyLanguageAttributes,
  createI18n,
  LANGUAGE_STORAGE_KEY,
  resolveLanguageConfig,
} from './index'

function storageWithLanguage(language: string | null): Pick<Storage, 'getItem'> {
  return {
    getItem: (key: string) => (key === LANGUAGE_STORAGE_KEY ? language : null),
  }
}

describe('resolveLanguageConfig', () => {
  it('uses the configured default language when no persisted choice exists', () => {
    const config = resolveLanguageConfig({
      env: { VITE_DEFAULT_LANGUAGE: 'ar' },
      storage: storageWithLanguage(null),
    })

    expect(config.defaultLanguage).toBe('ar')
    expect(config.initialLanguage).toBe('ar')
  })

  it('lets a persisted language override the project default', () => {
    const config = resolveLanguageConfig({
      env: { VITE_DEFAULT_LANGUAGE: 'ar' },
      storage: storageWithLanguage('en'),
    })

    expect(config.defaultLanguage).toBe('ar')
    expect(config.initialLanguage).toBe('en')
  })

  it('rejects unsupported env language values before i18next sees them', () => {
    expect(() =>
      resolveLanguageConfig({
        env: { VITE_DEFAULT_LANGUAGE: 'fr' },
        storage: storageWithLanguage(null),
      }),
    ).toThrow(/VITE_DEFAULT_LANGUAGE/)
  })
})

describe('createI18n', () => {
  it('boots with Arabic copy when Arabic is the configured default', () => {
    const instance = createI18n({
      env: { VITE_DEFAULT_LANGUAGE: 'ar' },
      storage: storageWithLanguage(null),
    })

    expect(instance.language).toBe('ar')
    expect(instance.t('common.signIn')).toBe('تسجيل الدخول')
  })

  it('does not fall back to English when the fallback language is Arabic', () => {
    const appResources = {
      en: { translation: { fallback: { onlyEnglish: 'English only' } } },
      ar: { translation: {} },
    }

    const instance = createI18n({
      appResources,
      env: { VITE_DEFAULT_LANGUAGE: 'ar', VITE_FALLBACK_LANGUAGE: 'ar' },
      storage: storageWithLanguage(null),
    })

    expect(instance.t('fallback.onlyEnglish')).toBe('fallback.onlyEnglish')
  })
})

describe('applyLanguageAttributes', () => {
  it('sets RTL document attributes for Arabic', () => {
    applyLanguageAttributes('ar')

    expect(document.documentElement.getAttribute('lang')).toBe('ar')
    expect(document.documentElement.getAttribute('dir')).toBe('rtl')
  })
})
