import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app'
import { env } from '@/shared/config'
import { applyLanguageAttributes } from '@/shared/i18n'

import './index.css'

async function enableMocking() {
  // `import.meta.env.DEV` resolves to a literal at build time so the
  // dynamic import below is tree-shaken out of production bundles.
  if (!import.meta.env.DEV) return
  if (!env.enableMsw) return

  const { worker } = await import('@/test/msw/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

void enableMocking().then(() => {
  applyLanguageAttributes()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
