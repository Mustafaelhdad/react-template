import { describe, expect, it } from 'vitest'

import { userKeys } from './user-keys'

describe('userKeys', () => {
  it('roots every key under the same tuple', () => {
    expect(userKeys.list()[0]).toBe(userKeys.all[0])
    expect(userKeys.detail('1')[0]).toBe(userKeys.all[0])
  })

  it('separates lists from details', () => {
    expect(userKeys.lists()).not.toEqual(userKeys.details())
  })

  it('encodes filters in the list key', () => {
    expect(userKeys.list({ role: 'admin' })).toEqual(['users', 'list', { role: 'admin' }])
  })

  it('produces a stable detail key', () => {
    expect(userKeys.detail('abc')).toEqual(['users', 'detail', 'abc'])
  })
})
