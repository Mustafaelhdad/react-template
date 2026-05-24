import { LogIn } from 'lucide-react'

import { notify, useZodForm } from '@/shared/lib'
import { Button, FormError, FormField } from '@/shared/ui'

import { login } from '../api/login'
import { loginSchema } from '../lib/login-schema'
import { useAuthStore } from '../model/auth-store'

type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const setSession = useAuthStore((state) => state.setSession)
  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: 'demo@example.com',
      password: 'password',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const session = await login(values)

      setSession(session)
      notify.success('Signed in successfully')
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in'

      form.setError('root', { message })
      notify.error(message)
    }
  })

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <FormField
        control={form.control}
        name="email"
        label="Email"
        inputProps={{
          autoComplete: 'email',
          placeholder: 'demo@example.com',
        }}
      />

      <FormField
        control={form.control}
        name="password"
        label="Password"
        inputProps={{
          type: 'password',
          autoComplete: 'current-password',
          placeholder: 'password',
        }}
      />

      <FormError message={form.formState.errors.root?.message} />

      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        <LogIn className="size-4" aria-hidden="true" />
        {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
