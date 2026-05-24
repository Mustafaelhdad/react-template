import { describe, expect, it } from 'vitest'

import {
  emailSchema,
  matchesPassword,
  passwordSchema,
  phoneSchema,
  requiredString,
  urlSchema,
} from './validators'

describe('emailSchema', () => {
  it('accepts a valid address', () => {
    expect(emailSchema.safeParse('user@example.com').success).toBe(true)
  })
  it('rejects an invalid address', () => {
    const result = emailSchema.safeParse('not-an-email')
    expect(result.success).toBe(false)
  })
})

describe('passwordSchema', () => {
  it('accepts a complex enough password', () => {
    expect(passwordSchema.safeParse('Abcdefg1').success).toBe(true)
  })
  it('rejects a password missing an uppercase letter', () => {
    const result = passwordSchema.safeParse('abcdefg1')
    expect(result.success).toBe(false)
  })
  it('rejects a short password', () => {
    expect(passwordSchema.safeParse('Ab1').success).toBe(false)
  })
})

describe('phoneSchema', () => {
  it('accepts a plus-prefixed number with spaces', () => {
    expect(phoneSchema.safeParse('+1 555 123 4567').success).toBe(true)
  })
  it('rejects letters', () => {
    expect(phoneSchema.safeParse('abc12345').success).toBe(false)
  })
})

describe('urlSchema', () => {
  it('accepts a https URL', () => {
    expect(urlSchema.safeParse('https://example.com').success).toBe(true)
  })
  it('rejects raw text', () => {
    expect(urlSchema.safeParse('example').success).toBe(false)
  })
})

describe('requiredString', () => {
  it('rejects whitespace-only strings', () => {
    expect(requiredString().safeParse('   ').success).toBe(false)
  })
  it('accepts non-empty input', () => {
    expect(requiredString().safeParse('ok').success).toBe(true)
  })
})

describe('matchesPassword', () => {
  it('returns true when both fields match', () => {
    const check = matchesPassword<{ password: string; confirm: string }>(
      'password',
      'confirm',
    )
    expect(check({ password: 'Abcdefg1', confirm: 'Abcdefg1' })).toBe(true)
    expect(check({ password: 'Abcdefg1', confirm: 'other' })).toBe(false)
  })
})
