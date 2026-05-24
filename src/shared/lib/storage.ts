function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export const storage = {
  get<TValue>(key: string): TValue | null {
    if (!canUseStorage()) {
      return null
    }

    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      return null
    }

    try {
      return JSON.parse(rawValue) as TValue
    } catch {
      return null
    }
  },

  set<TValue>(key: string, value: TValue) {
    if (!canUseStorage()) {
      return
    }

    window.localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string) {
    if (!canUseStorage()) {
      return
    }

    window.localStorage.removeItem(key)
  },
}
