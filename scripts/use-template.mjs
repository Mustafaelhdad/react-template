#!/usr/bin/env node
/**
 * Rename and (optionally) clean this template for a new project.
 *
 * Usage:
 *   node scripts/use-template.mjs                              # prompts for a name
 *   node scripts/use-template.mjs --name="My App"              # non-interactive
 *   node scripts/use-template.mjs --name="My App" --clean      # also delete demo
 *   node scripts/use-template.mjs --name="My App" --layout=dashboard-topnav
 *   node scripts/use-template.mjs --name="My App" --default-language=ar
 *   node scripts/use-template.mjs --name="My App" --fallback-language=same-as-default
 *   node scripts/use-template.mjs --name="My App" --no-i18n    # also rip out i18n
 *
 * What it does:
 *   - rewrites package.json `name` to a slugified form of the new name
 *   - rewrites the title in index.html
 *   - rewrites the readable app name in README.md and .env.example
 *   - rewrites the auth persisted-storage key in
 *     src/features/auth/model/auth-store.ts
 *   - with --layout, chooses one of marketing / dashboard-sidebar /
 *     dashboard-topnav and rewrites the compile-time layout preset
 *   - with --default-language / --fallback-language, chooses the project
 *     primary locale and missing-translation fallback
 *   - with --clean, removes unused layout widgets and demo routes for the
 *     chosen layout while leaving a compiling app
 *   - with --no-i18n, uninstalls react-i18next + friends, deletes the i18n
 *     config / direction hook / language switcher, unwraps the providers,
 *     and rewrites every t('foo.bar') back to its primary-locale literal so the
 *     app builds without translations
 *
 * It does not touch git history. Run it once after using "Use this template"
 * on GitHub, commit the result, and move on.
 */

import { readFile, writeFile, rm, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

// --- arg parsing -----------------------------------------------------------

const args = process.argv.slice(2)
const flags = new Map()
for (const arg of args) {
  if (arg.startsWith('--')) {
    const [key, ...rest] = arg.slice(2).split('=')
    flags.set(key, rest.length > 0 ? rest.join('=') : true)
  }
}

const wantsClean = flags.get('clean') === true
const wantsNoI18n = flags.get('no-i18n') === true
let projectName = typeof flags.get('name') === 'string' ? flags.get('name') : null
let selectedLayout = typeof flags.get('layout') === 'string' ? flags.get('layout') : null
let selectedDefaultLanguage =
  typeof flags.get('default-language') === 'string' ? flags.get('default-language') : null
let selectedFallbackLanguage =
  typeof flags.get('fallback-language') === 'string'
    ? flags.get('fallback-language')
    : null

const DEFAULT_LAYOUT = 'dashboard-sidebar'
const LAYOUT_PRESETS = ['marketing', 'dashboard-sidebar', 'dashboard-topnav']
const DEFAULT_LANGUAGE = 'en'
const FALLBACK_LANGUAGE = 'en'
const LANGUAGE_PRESETS = ['en', 'ar']
const RTL_LANGUAGES = ['ar']
const SAME_AS_DEFAULT = 'same-as-default'

// --- helpers ---------------------------------------------------------------

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^[^a-z]+/, '')
}

async function exists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function patchFile(relPath, transform) {
  const full = path.join(repoRoot, relPath)
  if (!(await exists(full))) {
    return false
  }
  const before = await readFile(full, 'utf8')
  const after = transform(before)
  if (before === after) {
    return false
  }
  await writeFile(full, after)
  return true
}

async function prompt(question) {
  const rl = createInterface({ input, output })
  try {
    return (await rl.question(question)).trim()
  } finally {
    rl.close()
  }
}

function normalizeLayout(value) {
  if (!value) return null
  const normalized = String(value).trim()
  return LAYOUT_PRESETS.includes(normalized) ? normalized : null
}

function normalizeLanguage(value) {
  if (!value) return null
  const normalized = String(value).trim()
  return LANGUAGE_PRESETS.includes(normalized) ? normalized : null
}

async function resolveLayout() {
  if (selectedLayout) {
    const normalized = normalizeLayout(selectedLayout)
    if (!normalized) {
      console.error(
        `Invalid --layout value "${selectedLayout}". Expected one of: ${LAYOUT_PRESETS.join(
          ', ',
        )}.`,
      )
      process.exit(1)
    }
    return normalized
  }

  if (input.isTTY) {
    const answer = await prompt(
      `Layout preset (${LAYOUT_PRESETS.join(' | ')}) [${DEFAULT_LAYOUT}]: `,
    )
    const normalized = answer ? normalizeLayout(answer) : DEFAULT_LAYOUT
    if (!normalized) {
      console.error(
        `Invalid layout "${answer}". Expected one of: ${LAYOUT_PRESETS.join(', ')}.`,
      )
      process.exit(1)
    }
    return normalized
  }

  return DEFAULT_LAYOUT
}

async function resolveDefaultLanguage() {
  if (selectedDefaultLanguage) {
    const normalized = normalizeLanguage(selectedDefaultLanguage)
    if (!normalized) {
      console.error(
        `Invalid --default-language value "${selectedDefaultLanguage}". Expected one of: ${LANGUAGE_PRESETS.join(
          ', ',
        )}.`,
      )
      process.exit(1)
    }
    return normalized
  }

  if (!wantsNoI18n && input.isTTY) {
    const answer = await prompt(
      `Primary language (${LANGUAGE_PRESETS.join(' | ')}) [${DEFAULT_LANGUAGE}]: `,
    )
    const normalized = answer ? normalizeLanguage(answer) : DEFAULT_LANGUAGE
    if (!normalized) {
      console.error(
        `Invalid language "${answer}". Expected one of: ${LANGUAGE_PRESETS.join(', ')}.`,
      )
      process.exit(1)
    }
    return normalized
  }

  return DEFAULT_LANGUAGE
}

function resolveFallbackLanguage(defaultLanguage) {
  if (!selectedFallbackLanguage) return FALLBACK_LANGUAGE
  if (selectedFallbackLanguage === SAME_AS_DEFAULT) return defaultLanguage

  const normalized = normalizeLanguage(selectedFallbackLanguage)
  if (!normalized) {
    console.error(
      `Invalid --fallback-language value "${selectedFallbackLanguage}". Expected one of: ${[
        ...LANGUAGE_PRESETS,
        SAME_AS_DEFAULT,
      ].join(', ')}.`,
    )
    process.exit(1)
  }
  return normalized
}

function getByPath(obj, dotted) {
  return dotted.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) return acc[key]
    return undefined
  }, obj)
}

function getDirection(language) {
  return RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'
}

function formatTsObject(obj) {
  const entries = Object.entries(obj).map(
    ([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`,
  )
  return `{\n${entries.join('\n')}\n}`
}

// --- i18n strip ------------------------------------------------------------

async function stripI18n() {
  const language = selectedDefaultLanguage || DEFAULT_LANGUAGE
  const translationsPath = path.join(repoRoot, `src/shared/i18n/${language}.json`)
  if (!(await exists(translationsPath))) {
    console.log('  (i18n already absent — nothing to strip)')
    return
  }
  const translations = JSON.parse(await readFile(translationsPath, 'utf8'))

  // Files that use t() / useTranslation() and need codemodding.
  const targets = [
    'src/views/home/ui/home-view.tsx',
    'src/views/login/ui/login-view.tsx',
    'src/views/dashboard/ui/dashboard-view.tsx',
    'src/views/not-found/ui/not-found-view.tsx',
    'src/views/error/ui/error-view.tsx',
    'src/views/session-expired/ui/session-expired-view.tsx',
    'src/features/auth/ui/login-form.tsx',
    'src/widgets/app-sidebar/ui/app-sidebar.tsx',
    'src/widgets/breadcrumbs/ui/breadcrumbs.tsx',
    'src/widgets/marketing-layout/ui/marketing-layout.tsx',
    'src/widgets/dashboard-sidebar-layout/ui/dashboard-sidebar-layout.tsx',
    'src/widgets/dashboard-topnav-layout/ui/dashboard-topnav-layout.tsx',
    'src/shared/ui/confirm-dialog.tsx',
  ]

  const resolveStatic = (key) => {
    const value = getByPath(translations, key)
    if (typeof value !== 'string') {
      throw new Error(
        `--no-i18n: cannot resolve t('${key}') — key missing or not a string in ${language}.json`,
      )
    }
    return value
  }
  // JSX text only allows raw chars when free of these — otherwise we keep
  // the braces and write `{"value"}` so the file still parses.
  const jsxSafe = (value) => !/[<>{}&]/.test(value)

  const changedFiles = []
  for (const rel of targets) {
    const changed = await patchFile(rel, (text) => {
      // Remove `import { useTranslation } from 'react-i18next'` line.
      text = text.replace(/^import \{ useTranslation \} from 'react-i18next'\n/m, '')
      // Remove `const { t } = useTranslation()` declaration (any indent).
      text = text.replace(/^[ \t]*const \{ t \} = useTranslation\(\)\n/gm, '')
      // Drop the LanguageSwitcher import + JSX usage (navbar only).
      text = text.replace(
        /^import \{ LanguageSwitcher \} from '@\/widgets\/language-switcher'\n/m,
        '',
      )
      text = text.replace(/^[ \t]*<LanguageSwitcher \/>\n/gm, '')
      text = text.replace(/\bt\(item\.labelKey\)/g, 'item.fallbackLabel')
      // Replace dynamic t(`prefix.${var}`) with an inline record access so
      // the same key-based map keeps working without i18next.
      text = text.replace(
        /(?<![\w$])t\(\s*`([^`$]+)\.\$\{([^}]+)\}`\s*\)/g,
        (_match, prefix, varExpr) => {
          const parent = getByPath(translations, prefix)
          if (!parent || typeof parent !== 'object') {
            throw new Error(
              `--no-i18n: cannot resolve template literal t(\`${prefix}.\${${varExpr}}\`) — ` +
                `'${prefix}' is missing or not an object in ${language}.json`,
            )
          }
          const inline = JSON.stringify(parent)
          return `(${inline} as Record<string, string>)[${varExpr.trim()}]`
        },
      )
      // Pass 1 — JSX attribute: `name={t('foo.bar')}` → `name="value"`.
      text = text.replace(
        /([A-Za-z_][\w-]*)=\{\s*t\(\s*(['"])([^'"]+)\2\s*\)\s*\}/g,
        (_match, attr, _q, key) => `${attr}=${JSON.stringify(resolveStatic(key))}`,
      )
      // Pass 2 — JSX text expression: `{t('foo.bar')}` → bare text when safe.
      text = text.replace(/\{\s*t\(\s*(['"])([^'"]+)\1\s*\)\s*\}/g, (_match, _q, key) => {
        const value = resolveStatic(key)
        return jsxSafe(value) ? value : `{${JSON.stringify(value)}}`
      })
      // Pass 3 — bare JS call: `notify.info(t('foo.bar'))` → string literal.
      text = text.replace(/(?<![\w$])t\(\s*(['"])([^'"]+)\1\s*\)/g, (_match, _q, key) =>
        JSON.stringify(resolveStatic(key)),
      )
      return text
    })
    if (changed) changedFiles.push(rel)
  }

  await patchFile('src/widgets/breadcrumbs/ui/breadcrumbs.tsx', (text) =>
    text
      .replace(
        "import { ROUTE_LABELS, ROUTES } from '@/shared/config'",
        "import { ROUTE_FALLBACK_LABELS, ROUTES } from '@/shared/config'",
      )
      .replace(
        'function buildCrumbs(pathname: string, t: (key: string) => string): Crumb[] {',
        'function buildCrumbs(pathname: string): Crumb[] {',
      )
      .replace(
        "label: t(ROUTE_LABELS[''] ?? 'nav.home'),",
        "label: ROUTE_FALLBACK_LABELS[''] ?? 'Home',",
      )
      .replace(
        'const key = ROUTE_LABELS[segment]',
        'const label = ROUTE_FALLBACK_LABELS[segment]',
      )
      .replace(
        'label: key ? t(key) : humanize(segment),',
        'label: label ?? humanize(segment),',
      )
      .replace(
        'const crumbs = useMemo(() => buildCrumbs(pathname, t), [pathname, t])',
        'const crumbs = useMemo(() => buildCrumbs(pathname), [pathname])',
      ),
  )

  const routeFallbackLabels = {
    '': resolveStatic('nav.home'),
    dashboard: resolveStatic('nav.dashboard'),
    'ui-kit': resolveStatic('sidebar.uiKit'),
    login: resolveStatic('common.signIn'),
    'session-expired': resolveStatic('sessionExpired.title'),
    error: resolveStatic('error.title'),
  }

  await patchFile('src/shared/config/routes.ts', (text) =>
    text.replace(
      /export const ROUTE_FALLBACK_LABELS: Record<string, string> = \{[\s\S]*?\n\}/,
      `export const ROUTE_FALLBACK_LABELS: Record<string, string> = ${formatTsObject(
        routeFallbackLabels,
      )}`,
    ),
  )

  // Unwrap providers.tsx.
  await patchFile('src/app/providers.tsx', (text) => {
    text = text.replace(/^import \{ I18nextProvider \} from 'react-i18next'\n/m, '')
    text = text.replace(/^import \{ i18n \} from '@\/shared\/i18n'\n/m, '')
    text = text.replace(/\bDirectionProvider,\s*/g, '')
    text = text.replace(/,\s*DirectionProvider\b/g, '')
    // Strip <I18nextProvider> + <DirectionProvider> wrappers (any whitespace).
    text = text.replace(/^[ \t]*<I18nextProvider[^>]*>\n/gm, '')
    text = text.replace(/^[ \t]*<\/I18nextProvider>\n/gm, '')
    text = text.replace(/^[ \t]*<DirectionProvider>\n/gm, '')
    text = text.replace(/^[ \t]*<\/DirectionProvider>\n/gm, '')
    return text
  })

  // Unwrap test-utils.tsx.
  await patchFile('src/test/test-utils.tsx', (text) => {
    text = text.replace(/^import \{ I18nextProvider \} from 'react-i18next'\n/m, '')
    text = text.replace(/^import \{ i18n \} from '@\/shared\/i18n'\n/m, '')
    // Also drop the now-empty blank line between the removed imports.
    text = text.replace(/\n\n\n+/g, '\n\n')
    text = text.replace(/^[ \t]*<I18nextProvider[^>]*>\n/gm, '')
    text = text.replace(/^[ \t]*<\/I18nextProvider>\n/gm, '')
    return text
  })

  await patchFile('src/shared/lib/confirm.test.tsx', (text) => {
    text = text.replace(/^import \{ I18nextProvider \} from 'react-i18next'\n/m, '')
    text = text.replace(/^import \{ i18n \} from '@\/shared\/i18n'\n/m, '')
    text = text.replace(
      /return \(\n\s*<I18nextProvider i18n=\{i18n\}>\n\s*<ConfirmProvider>\{children\}<\/ConfirmProvider>\n\s*<\/I18nextProvider>\n\s*\)/,
      'return <ConfirmProvider>{children}</ConfirmProvider>',
    )
    text = text.replace(
      "screen.findByRole('button', { name: 'Confirm' })",
      `screen.findByRole('button', { name: ${JSON.stringify(resolveStatic('common.confirm'))} })`,
    )
    text = text.replace(
      "screen.findByRole('button', { name: 'Cancel' })",
      `screen.findByRole('button', { name: ${JSON.stringify(resolveStatic('common.cancel'))} })`,
    )
    return text
  })

  await patchFile('src/main.tsx', (text) =>
    text
      .replace(/^import \{ applyLanguageAttributes \} from '@\/shared\/i18n'\n/m, '')
      .replace(/^\s*applyLanguageAttributes\(\)\n\n/m, ''),
  )

  // Drop the direction export from shared/lib's barrel.
  await patchFile('src/shared/lib/index.ts', (text) =>
    text.replace(
      /^export \{ DirectionProvider, useDirection, type Direction \} from '\.\/direction'\n/m,
      '',
    ),
  )

  await patchFile('index.html', (text) =>
    text
      .replace(
        /<html lang="[^"]*"(?: dir="[^"]*")?>/,
        `<html lang="${language}" dir="${getDirection(language)}">`,
      )
      .replace(
        /\n    <!-- i18n bootstrap:start -->[\s\S]*?<!-- i18n bootstrap:end -->\n/,
        '\n',
      ),
  )

  // Uninstall i18n dependencies from package.json.
  await patchFile('package.json', (text) => {
    const pkg = JSON.parse(text)
    for (const dep of ['i18next', 'react-i18next', 'i18next-browser-languagedetector']) {
      if (pkg.dependencies) delete pkg.dependencies[dep]
      if (pkg.devDependencies) delete pkg.devDependencies[dep]
    }
    return JSON.stringify(pkg, null, 2) + '\n'
  })

  // Delete i18n directories and files.
  const toRemove = [
    'src/shared/i18n',
    'src/shared/lib/direction.tsx',
    'src/shared/lib/direction.test.tsx',
    'src/widgets/language-switcher',
  ]
  for (const rel of toRemove) {
    const full = path.join(repoRoot, rel)
    if (await exists(full)) {
      await rm(full, { recursive: true, force: true })
      console.log(`Removed ${rel}`)
    }
  }

  // Tidy up the codemod output — strips stray blank lines, normalizes
  // quotes, and re-indents JSX. Best-effort: skip silently if prettier or
  // its dependencies aren't installed yet.
  const filesToFormat = [
    ...changedFiles,
    'src/app/providers.tsx',
    'src/main.tsx',
    'src/test/test-utils.tsx',
    'src/shared/lib/confirm.test.tsx',
    'src/shared/lib/index.ts',
    'src/shared/config/routes.ts',
    'index.html',
    'package.json',
  ]
  await runPrettier(filesToFormat)
}

async function runPrettier(files) {
  const existingFiles = []
  for (const file of files) {
    if (await exists(path.join(repoRoot, file))) {
      existingFiles.push(file)
    }
  }
  if (existingFiles.length === 0) return

  return new Promise((resolve) => {
    const child = spawn(
      'npx',
      ['--no-install', 'prettier', '--write', '--log-level', 'warn', ...existingFiles],
      { cwd: repoRoot, stdio: 'inherit' },
    )
    child.on('error', () => resolve())
    child.on('exit', () => resolve())
  })
}

async function removePaths(paths) {
  for (const rel of paths) {
    const full = path.join(repoRoot, rel)
    if (await exists(full)) {
      await rm(full, { recursive: true, force: true })
      console.log(`Removed ${rel}`)
    }
  }
}

async function writeProjectFile(relPath, contents) {
  await writeFile(path.join(repoRoot, relPath), contents)
}

async function writeCleanRouter(layout) {
  if (layout === 'marketing') {
    await writeProjectFile(
      'src/app/router.tsx',
      `/* eslint-disable react-refresh/only-export-components --
 * The router file mixes the route tree (a non-component export) with
 * lazy() component declarations. Fast refresh isn't meaningful here.
 */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { MainLayout } from '@/widgets/main-layout'

const HomeView = lazy(() => import('@/views/home').then((m) => ({ default: m.HomeView })))
const UiKitView = lazy(() =>
  import('@/views/ui-kit').then((m) => ({ default: m.UiKitView })),
)
const NotFoundView = lazy(() =>
  import('@/views/not-found').then((m) => ({ default: m.NotFoundView })),
)
const ErrorView = lazy(() =>
  import('@/views/error').then((m) => ({ default: m.ErrorView })),
)
const MarketingLayout = lazy(() =>
  import('@/widgets/marketing-layout').then((m) => ({ default: m.MarketingLayout })),
)

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <MarketingLayout />,
        children: [
          {
            index: true,
            element: <HomeView />,
          },
          {
            path: 'ui-kit',
            element: <UiKitView />,
          },
          {
            path: 'error',
            element: <ErrorView />,
          },
          {
            path: '*',
            element: <NotFoundView />,
          },
        ],
      },
    ],
  },
])
`,
    )
    return
  }

  const layoutModule =
    layout === 'dashboard-topnav' ? 'dashboard-topnav-layout' : 'dashboard-sidebar-layout'
  const layoutExport =
    layout === 'dashboard-topnav' ? 'DashboardTopnavLayout' : 'DashboardSidebarLayout'

  await writeProjectFile(
    'src/app/router.tsx',
    `/* eslint-disable react-refresh/only-export-components --
 * The router file mixes the route tree (a non-component export) with
 * lazy() component declarations. Fast refresh isn't meaningful here.
 */
import { lazy } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { ProtectedRoute } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import { Container } from '@/shared/ui'
import { MainLayout } from '@/widgets/main-layout'

const LoginView = lazy(() =>
  import('@/views/login').then((m) => ({ default: m.LoginView })),
)
const UiKitView = lazy(() =>
  import('@/views/ui-kit').then((m) => ({ default: m.UiKitView })),
)
const NotFoundView = lazy(() =>
  import('@/views/not-found').then((m) => ({ default: m.NotFoundView })),
)
const SessionExpiredView = lazy(() =>
  import('@/views/session-expired').then((m) => ({ default: m.SessionExpiredView })),
)
const ErrorView = lazy(() =>
  import('@/views/error').then((m) => ({ default: m.ErrorView })),
)
const ${layoutExport} = lazy(() =>
  import('@/widgets/${layoutModule}').then((m) => ({ default: m.${layoutExport} })),
)
const DashboardView = lazy(() =>
  import('@/views/dashboard').then((m) => ({ default: m.DashboardView })),
)

function PublicPageLayout() {
  return (
    <Container as="main" className="py-6 sm:py-8 lg:py-10">
      <Outlet />
    </Container>
  )
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <PublicPageLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.dashboard} replace />,
          },
          {
            path: 'login',
            element: <LoginView />,
          },
          {
            path: 'session-expired',
            element: <SessionExpiredView />,
          },
          {
            path: 'error',
            element: <ErrorView />,
          },
          {
            path: '*',
            element: <NotFoundView />,
          },
        ],
      },
      {
        element: <${layoutExport} />,
        children: [
          {
            path: 'ui-kit',
            element: <UiKitView />,
          },
        ],
      },
      {
        element: (
          <ProtectedRoute>
            <${layoutExport} />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <DashboardView />,
          },
        ],
      },
    ],
  },
])
`,
  )
}

async function writeCleanHome(layout) {
  if (layout !== 'marketing') return

  await writeProjectFile(
    'src/views/home/ui/home-view.tsx',
    `import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { Card, CardContent, CardHeader, CardTitle, buttonVariants } from '@/shared/ui'

const capabilityItems = [
  'Marketing-ready layout shell',
  'Responsive UI primitives',
  'Feature-sliced folders',
  'Quality checks wired in',
] as const

export function HomeView() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8">
      <div className="space-y-6">
        <div className="inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          React + Vite starter
        </div>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50">
            A reusable frontend template for project starts.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 lg:text-lg dark:text-zinc-400">
            Use this marketing shell as the public starting point for a product,
            portfolio, or content-focused project.
          </p>
        </div>
        <Link to={ROUTES.uiKit} className={buttonVariants()}>
          View UI kit
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template shell</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 sm:p-6">
          {capabilityItems.map((item) => (
            <div
              key={item}
              className="flex min-h-11 items-center gap-3 rounded-md border border-zinc-200 px-3 py-3 dark:border-zinc-800"
            >
              <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {item}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
`,
  )
}

async function writeCleanBarrels(layout) {
  const widgets =
    layout === 'marketing'
      ? `export { BreakpointIndicator } from './breakpoint-indicator'
export { MarketingLayout } from './marketing-layout'
export { MainLayout } from './main-layout'
export { ThemeToggle } from './theme-toggle'
`
      : layout === 'dashboard-topnav'
        ? `export { BreakpointIndicator } from './breakpoint-indicator'
export { DashboardTopnavLayout } from './dashboard-topnav-layout'
export { MainLayout } from './main-layout'
export { ThemeToggle } from './theme-toggle'
`
        : `export { AppSidebar } from './app-sidebar'
export { BreakpointIndicator } from './breakpoint-indicator'
export { DashboardSidebarLayout } from './dashboard-sidebar-layout'
export { MainLayout } from './main-layout'
export { ThemeToggle } from './theme-toggle'
`

  const views =
    layout === 'marketing'
      ? `export { ErrorView } from './error'
export { HomeView } from './home'
export { NotFoundView } from './not-found'
export { UiKitView } from './ui-kit'
`
      : `export { DashboardView } from './dashboard'
export { ErrorView } from './error'
export { LoginView } from './login'
export { NotFoundView } from './not-found'
export { SessionExpiredView } from './session-expired'
export { UiKitView } from './ui-kit'
`

  await writeProjectFile('src/widgets/index.ts', widgets)
  await writeProjectFile('src/views/index.ts', views)
}

async function writeCleanAppTest(layout) {
  const expected = layout === 'marketing' ? 'reusable frontend template' : 'sign in'

  await writeProjectFile(
    'src/app/App.test.tsx',
    `import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './App'

describe('App', () => {
  it('renders the initial route', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /${expected}/i }),
    ).toBeInTheDocument()
  })
})
`,
  )
}

async function cleanLayoutPreset(layout) {
  const commonDeleted = ['src/widgets/navbar', 'src/widgets/dashboard-layout']
  const byLayout = {
    marketing: [
      'src/features/auth',
      'src/views/login',
      'src/views/dashboard',
      'src/views/session-expired',
      'src/widgets/app-sidebar',
      'src/widgets/dashboard-sidebar-layout',
      'src/widgets/dashboard-topnav-layout',
    ],
    'dashboard-sidebar': [
      'src/views/home',
      'src/widgets/marketing-layout',
      'src/widgets/dashboard-topnav-layout',
    ],
    'dashboard-topnav': [
      'src/views/home',
      'src/widgets/marketing-layout',
      'src/widgets/dashboard-sidebar-layout',
      'src/widgets/app-sidebar',
    ],
  }

  await removePaths([...commonDeleted, ...byLayout[layout]])
  await writeCleanRouter(layout)
  await writeCleanHome(layout)
  await writeCleanBarrels(layout)
  await writeCleanAppTest(layout)

  if (layout === 'marketing') {
    await writeProjectFile(
      'src/app/init-api.ts',
      `// Marketing-only projects have no auth session wiring by default.
export {}
`,
    )
    await patchFile('src/features/index.ts', (text) =>
      text
        .replace(
          /^export \{ LoginForm, ProtectedRoute, login, loginSchema, useAuthStore \} from '\.\/auth'\n/m,
          '',
        )
        .replace(
          /^export type \{ AuthSession, LoginCredentials \} from '\.\/auth'\n/m,
          '',
        ),
    )
  }

  await runPrettier([
    'src/app/router.tsx',
    'src/app/App.test.tsx',
    'src/views/index.ts',
    'src/widgets/index.ts',
    'src/views/home/ui/home-view.tsx',
    'src/app/init-api.ts',
    'src/features/index.ts',
  ])
}

async function configureI18n(defaultLanguage, fallbackLanguage, slug) {
  await patchFile('src/shared/i18n/index.ts', (text) =>
    text
      .replace(
        /const PROJECT_DEFAULT_LANGUAGE: SupportedLanguage = '[^']+'/,
        `const PROJECT_DEFAULT_LANGUAGE: SupportedLanguage = '${defaultLanguage}'`,
      )
      .replace(
        /const PROJECT_FALLBACK_LANGUAGE: SupportedLanguage = '[^']+'/,
        `const PROJECT_FALLBACK_LANGUAGE: SupportedLanguage = '${fallbackLanguage}'`,
      )
      .replaceAll('react-template:language', `${slug}:language`),
  )

  await patchFile('index.html', (text) =>
    text
      .replaceAll('react-template:language', `${slug}:language`)
      .replace(
        /<html lang="[^"]*"(?: dir="[^"]*")?>/,
        `<html lang="${defaultLanguage}" dir="${getDirection(defaultLanguage)}">`,
      )
      .replace(
        /var projectDefaultLanguage = '[^']+'/,
        `var projectDefaultLanguage = '${defaultLanguage}'`,
      )
      .replace(
        /document\.documentElement\.setAttribute\('lang', '[^']+'\)\n\s*document\.documentElement\.setAttribute\('dir', '[^']+'\)/,
        `document.documentElement.setAttribute('lang', '${defaultLanguage}')\n          document.documentElement.setAttribute('dir', '${getDirection(
          defaultLanguage,
        )}')`,
      ),
  )

  await patchFile('docs/i18n.md', (text) =>
    text
      .replaceAll('react-template:language', `${slug}:language`)
      .replace(
        /Primary locale \(`DEFAULT_LANGUAGE`\): `[^`]+`/,
        `Primary locale (\`DEFAULT_LANGUAGE\`): \`${defaultLanguage}\``,
      )
      .replace(
        /Fallback locale \(`FALLBACK_LANGUAGE`\): `[^`]+`/,
        `Fallback locale (\`FALLBACK_LANGUAGE\`): \`${fallbackLanguage}\``,
      ),
  )

  await runPrettier(['src/shared/i18n/index.ts', 'index.html', 'docs/i18n.md'])
}

// --- main ------------------------------------------------------------------

async function main() {
  if (!projectName) {
    projectName = await prompt('Project name (e.g. "My Awesome App"): ')
  }
  if (!projectName) {
    console.error('No project name provided. Aborting.')
    process.exit(1)
  }

  selectedLayout = await resolveLayout()
  selectedDefaultLanguage = await resolveDefaultLanguage()
  selectedFallbackLanguage = resolveFallbackLanguage(selectedDefaultLanguage)
  const slug = slugify(projectName) || 'new-react-app'
  console.log(`\nProject name : ${projectName}`)
  console.log(`Package slug : ${slug}`)
  console.log(`Layout       : ${selectedLayout}`)
  console.log(`Language     : ${selectedDefaultLanguage}`)
  console.log(`Fallback     : ${selectedFallbackLanguage}`)
  console.log(`Clean demos  : ${wantsClean ? 'yes' : 'no'}`)
  console.log(`Strip i18n   : ${wantsNoI18n ? 'yes' : 'no'}\n`)

  // 1. package.json — name + reset version + clear description
  await patchFile('package.json', (text) => {
    const pkg = JSON.parse(text)
    pkg.name = slug
    pkg.version = '0.1.0'
    pkg.private = true
    if (pkg.description) pkg.description = ''
    return JSON.stringify(pkg, null, 2) + '\n'
  })

  // 2. index.html — <title>
  await patchFile('index.html', (text) =>
    text.replace(/<title>[^<]*<\/title>/, `<title>${projectName}</title>`),
  )

  // 3. README.md — first H1 + any "React Template" mentions to project name
  await patchFile('README.md', (text) =>
    text
      .replace(/^# React Template\b.*$/m, `# ${projectName}`)
      .replaceAll('react-template', slug)
      .replaceAll('React Template', projectName),
  )

  // 4. .env.example — VITE_APP_NAME
  await patchFile('.env.example', (text) =>
    text.replace(/VITE_APP_NAME=.*/g, `VITE_APP_NAME="${projectName}"`),
  )

  // 5. auth store — persisted-storage key
  await patchFile('src/features/auth/model/auth-store.ts', (text) =>
    text.replaceAll('react-template:auth', `${slug}:auth`),
  )

  // 6. env.ts — default app name fallback
  await patchFile('src/shared/config/env.ts', (text) =>
    text.replace(/'React Template'/g, `'${projectName}'`),
  )

  // 7. layout preset — compile-time shell selection
  await patchFile('src/shared/config/layout.ts', (text) =>
    text.replace(
      /export const LAYOUT: LayoutPreset = '[^']+'/,
      `export const LAYOUT: LayoutPreset = '${selectedLayout}'`,
    ),
  )

  // 8. i18n defaults + first-paint language bootstrap
  await configureI18n(selectedDefaultLanguage, selectedFallbackLanguage, slug)

  // 9. theme module + FOUC script — persisted-storage key
  await patchFile('src/shared/lib/theme.tsx', (text) =>
    text.replaceAll('react-template:theme', `${slug}:theme`),
  )
  await patchFile('index.html', (text) =>
    text.replaceAll('react-template:theme', `${slug}:theme`),
  )

  // 10. Optional: strip i18n (run before --clean so it codemods existing files).
  if (wantsNoI18n) {
    await stripI18n()
  }

  // 11. Optional: nuke unused layout/demo content for the chosen preset.
  if (wantsClean) {
    await cleanLayoutPreset(selectedLayout)
  }

  console.log('Done. Next steps:')
  console.log('  1. Review the diff (`git diff`).')
  if (wantsNoI18n) {
    console.log('  2. Run `npm install` to drop the i18n packages.')
    console.log('  3. Commit: `git add -A && git commit -m "chore: rename template"`.')
    console.log('  4. Remove this script if you no longer need it.')
  } else {
    console.log('  2. Commit: `git add -A && git commit -m "chore: rename template"`.')
    console.log('  3. Remove this script if you no longer need it.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
