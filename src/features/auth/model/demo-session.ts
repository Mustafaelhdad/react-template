import { storage } from '@/shared/lib'

const DEMO_AUTH_KEY = 'react-template:demo-auth'

export const demoSession = {
  isAuthenticated() {
    return storage.get<boolean>(DEMO_AUTH_KEY) === true
  },
  signIn() {
    storage.set(DEMO_AUTH_KEY, true)
  },
  signOut() {
    storage.remove(DEMO_AUTH_KEY)
  },
}
