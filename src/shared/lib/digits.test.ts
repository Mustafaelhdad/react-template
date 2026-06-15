import { describe, expect, it } from 'vitest'

import { sanitizeNumericInput, toEnglishDigits } from './digits'

describe('toEnglishDigits', () => {
  it('converts Arabic-Indic digits to ASCII', () => {
    expect(toEnglishDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789')
  })

  it('converts Extended Arabic-Indic (Persian) digits to ASCII', () => {
    expect(toEnglishDigits('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789')
  })

  it('leaves ASCII digits and other characters untouched', () => {
    expect(toEnglishDigits('Price: 123.45')).toBe('Price: 123.45')
  })
})

describe('sanitizeNumericInput', () => {
  it('strips non-digit characters by default', () => {
    expect(sanitizeNumericInput('abc123def')).toBe('123')
  })

  it('converts Arabic-Indic digits before stripping', () => {
    expect(sanitizeNumericInput('٠١٢٣')).toBe('0123')
  })

  it('strips decimal points when decimals are not allowed', () => {
    expect(sanitizeNumericInput('12.34')).toBe('1234')
  })

  it('keeps a single decimal point when decimals are allowed', () => {
    expect(sanitizeNumericInput('12.34.56', { allowDecimal: true })).toBe('12.3456')
  })

  it('strips a leading minus sign when negatives are not allowed', () => {
    expect(sanitizeNumericInput('-123')).toBe('123')
  })

  it('keeps a leading minus sign when negatives are allowed', () => {
    expect(sanitizeNumericInput('-123', { allowNegative: true })).toBe('-123')
  })

  it('handles Arabic-Indic digits with decimals and negatives together', () => {
    expect(
      sanitizeNumericInput('-١٢.٣', { allowDecimal: true, allowNegative: true }),
    ).toBe('-12.3')
  })
})
