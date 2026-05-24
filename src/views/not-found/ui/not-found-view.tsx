import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'

export function NotFoundView() {
  return (
    <section className="mx-auto max-w-lg rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
      <p className="text-sm font-medium text-zinc-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950">
        Page not found
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        The route does not exist in this template shell.
      </p>
      <Link
        to={ROUTES.home}
        className="mt-6 inline-flex rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Back home
      </Link>
    </section>
  )
}
