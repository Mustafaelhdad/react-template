#!/usr/bin/env node
/**
 * Capture layout-preset screenshots for README.md.
 *
 * For each preset (`marketing`, `dashboard-sidebar`, `dashboard-topnav`)
 * the script rewrites `src/shared/config/layout.ts`, restarts the Vite
 * dev server with MSW enabled (so the mock /auth/login handler responds),
 * and saves PNGs at 320px and 1280px to `docs/assets/layout-presets/`.
 * Restores `LAYOUT` to `dashboard-sidebar` before exiting.
 *
 * Each preset gets a fresh Vite process so the file rewrite is read at
 * boot — that avoids HMR fighting an in-flight `page.evaluate()` with a
 * forced reload of the layout module.
 *
 * Playwright is not a permanent devDependency (kept that way per
 * Phase 22 — "Playwright is too heavy for the template"). Install it
 * transiently the first time you regenerate screenshots:
 *
 *   npm install --no-save playwright
 *   npx playwright install chromium
 *   node scripts/capture-layout-screenshots.mjs
 *
 * Re-run whenever the marketing / dashboard layouts change.
 */
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error(
    '\nplaywright is not installed. Run:\n' +
      '  npm install --no-save playwright\n' +
      '  npx playwright install chromium\n' +
      'and re-run this script.\n',
  )
  process.exit(1)
}

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const LAYOUT_FILE = join(ROOT, 'src/shared/config/layout.ts')
const OUTPUT_DIR = join(ROOT, 'docs/assets/layout-presets')
const PORT = 5188
const ORIGIN = `http://localhost:${PORT}`
const DEFAULT_LAYOUT = 'dashboard-sidebar'

const PRESETS = [
  { name: 'marketing', layout: 'marketing', path: '/', requiresAuth: false },
  {
    name: 'dashboard-sidebar',
    layout: 'dashboard-sidebar',
    path: '/dashboard',
    requiresAuth: true,
  },
  {
    name: 'dashboard-topnav',
    layout: 'dashboard-topnav',
    path: '/dashboard',
    requiresAuth: true,
  },
]

const VIEWPORTS = [
  { width: 320, height: 812 },
  { width: 1280, height: 800 },
]

async function setLayout(layout) {
  const file = await readFile(LAYOUT_FILE, 'utf8')
  const updated = file.replace(
    /export const LAYOUT: LayoutPreset = '[a-z-]+'/,
    `export const LAYOUT: LayoutPreset = '${layout}'`,
  )
  if (updated === file) {
    throw new Error(`Could not rewrite LAYOUT in ${LAYOUT_FILE}`)
  }
  await writeFile(LAYOUT_FILE, updated, 'utf8')
}

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {}
    await sleep(250)
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`)
}

function startVite() {
  const proc = spawn(
    'npm',
    ['run', 'dev', '--', '--port', String(PORT), '--strictPort'],
    {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, VITE_ENABLE_MSW: 'true' },
    },
  )
  // Surface fatal Vite output without spamming HMR chatter on every reload.
  proc.stderr.on('data', (chunk) => process.stderr.write(`[vite] ${chunk}`))
  return proc
}

async function stopVite(proc) {
  if (!proc || proc.killed) return
  await new Promise((resolve) => {
    proc.once('exit', resolve)
    proc.kill('SIGTERM')
    // Hard kill if it lingers.
    setTimeout(() => {
      if (!proc.killed) proc.kill('SIGKILL')
    }, 3_000).unref()
  })
}

async function login(page) {
  await page.goto(`${ORIGIN}/login`, { waitUntil: 'load' })
  await page.waitForLoadState('networkidle').catch(() => {})
  // Login form is pre-filled with demo@example.com / password. Submit it.
  await page.locator('form button[type="submit"]').click()
  await page.waitForURL(/\/dashboard$/, { timeout: 20_000 })
  await page.waitForLoadState('networkidle').catch(() => {})
}

// Hide screenshot noise: the dev-only `<BreakpointIndicator />` pill in
// the corner, and the sonner toast container (so the "Signed in
// successfully" toast from the login flow doesn't bleed into shots).
const SCREENSHOT_HIDE_CSS = `
  [data-sonner-toaster],
  .fixed.bottom-3.left-3,
  .fixed.bottom-3.right-3 {
    display: none !important;
  }
`

async function captureViewport(browser, preset, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  const page = await context.newPage()
  try {
    // Visit root so we can clear persisted state without racing HMR.
    await page.goto(ORIGIN, { waitUntil: 'load' })
    await page.waitForLoadState('networkidle').catch(() => {})
    await page.evaluate(() => localStorage.clear())

    if (preset.requiresAuth) {
      await login(page)
    } else {
      await page.goto(`${ORIGIN}${preset.path}`, { waitUntil: 'load' })
      await page.waitForLoadState('networkidle').catch(() => {})
    }

    await page.addStyleTag({ content: SCREENSHOT_HIDE_CSS })

    // Allow Tailwind transitions / fonts to settle.
    await sleep(750)

    const outPath = join(OUTPUT_DIR, `${preset.name}-${viewport.width}.png`)
    await page.screenshot({ path: outPath, fullPage: false })
    console.log(`  saved ${outPath} (${viewport.width}x${viewport.height})`)
  } finally {
    await context.close()
  }
}

async function capturePreset(browser, preset) {
  console.log(`\n=== Capturing preset: ${preset.name} ===`)
  await setLayout(preset.layout)

  const vite = startVite()
  const cleanup = async () => stopVite(vite)
  process.once('SIGINT', cleanup)

  try {
    await waitForServer(ORIGIN)
    for (const viewport of VIEWPORTS) {
      await captureViewport(browser, preset, viewport)
    }
  } finally {
    await cleanup()
    process.off('SIGINT', cleanup)
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  try {
    for (const preset of PRESETS) {
      await capturePreset(browser, preset)
    }
  } finally {
    await browser.close()
    await setLayout(DEFAULT_LAYOUT)
  }
}

main().catch(async (error) => {
  console.error(error)
  // Best-effort restore even on crash.
  try {
    await setLayout(DEFAULT_LAYOUT)
  } catch {}
  process.exitCode = 1
})
