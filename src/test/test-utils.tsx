import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'

import { i18n } from '@/shared/i18n'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

type TestProvidersProps = {
  children: ReactNode
  route?: string
}

export function TestProviders({ children, route = '/' }: TestProvidersProps) {
  const queryClient = createTestQueryClient()

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

type RenderWithProvidersOptions = RenderOptions & {
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { route, ...options }: RenderWithProvidersOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => <TestProviders route={route}>{children}</TestProviders>,
    ...options,
  })
}

export * from '@testing-library/react'
