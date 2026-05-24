import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib'
import { Card, CardContent, buttonVariants } from '@/shared/ui'

export function NotFoundView() {
  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          The route does not exist in this template shell.
        </p>
        <Link to={ROUTES.home} className={cn(buttonVariants(), 'mt-6')}>
          Back home
        </Link>
      </CardContent>
    </Card>
  )
}
