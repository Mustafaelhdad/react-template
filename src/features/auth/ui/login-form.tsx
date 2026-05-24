import { LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { notify, useZodForm } from '@/shared/lib'
import { Button, FormError, FormField } from '@/shared/ui'

import { login } from '../api/login'
import { loginSchema } from '../lib/login-schema'
import { useAuthStore } from '../model/auth-store'

type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation()
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
      notify.success(t('common.signedInSuccessfully'))
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('common.unableToSignIn')

      form.setError('root', { message })
      notify.error(message)
    }
  })

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <FormField
        control={form.control}
        name="email"
        label={t('login.email')}
        inputProps={{
          autoComplete: 'email',
          placeholder: 'demo@example.com',
        }}
      />

      <FormField
        control={form.control}
        name="password"
        label={t('login.password')}
        inputProps={{
          type: 'password',
          autoComplete: 'current-password',
          placeholder: 'password',
        }}
      />

      <FormError message={form.formState.errors.root?.message} />

      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        <LogIn className="size-4" aria-hidden="true" />
        {form.formState.isSubmitting ? t('common.signingIn') : t('common.signIn')}
      </Button>
    </form>
  )
}
