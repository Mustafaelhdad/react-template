const DEMO_AUTH_KEY = 'react-template:demo-auth'

export const demoSession = {
  isAuthenticated() {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(DEMO_AUTH_KEY) === 'true'
  },
  signIn() {
    window.localStorage.setItem(DEMO_AUTH_KEY, 'true')
  },
  signOut() {
    window.localStorage.removeItem(DEMO_AUTH_KEY)
  },
}
