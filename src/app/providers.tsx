import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Toaster } from 'sonner'

import { i18n } from '@/shared/i18n'
import { DirectionProvider, ThemeProvider, useTheme } from '@/shared/lib'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

type AppProvidersProps = {
  children: ReactNode
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return <Toaster richColors position="top-right" theme={resolvedTheme} />
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <DirectionProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ThemedToaster />
          </QueryClientProvider>
        </ThemeProvider>
      </DirectionProvider>
    </I18nextProvider>
  )
}
