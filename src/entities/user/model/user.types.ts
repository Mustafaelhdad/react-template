export type UserRole = 'admin' | 'user'

export type User = {
  id: string
  name: string
  email: string
  /**
   * Primary role for the user. Kept singular for templates that only
   * need a binary admin/user split.
   */
  role: UserRole
  /**
   * Full role set, used by `<RoleGuard>` to gate routes. Always contains
   * the primary `role` plus any extras the backend returned.
   */
  roles: UserRole[]
}
