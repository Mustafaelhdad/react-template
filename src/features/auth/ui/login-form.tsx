import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { notify } from '@/shared/lib'
import { Button, FormError, Input } from '@/shared/ui'

import { login } from '../api/login'
import { loginSchema, type LoginFormValues } from '../lib/login-schema'
import { useAuthStore } from '../model/auth-store'

type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const setSession = useAuthStore((state) => state.setSession)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@example.com',
      password: 'password',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await login(values)

      setSession(session)
      notify.success('Signed in successfully')
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in'

      setError('root', { message })
      notify.error(message)
    }
  })

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <Input
          id="email"
          autoComplete="email"
          placeholder="demo@example.com"
          {...register('email')}
        />
        <FormError message={errors.email?.message} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="password"
          {...register('password')}
        />
        <FormError message={errors.password?.message} />
      </div>

      <FormError message={errors.root?.message} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        <LogIn className="size-4" aria-hidden="true" />
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
