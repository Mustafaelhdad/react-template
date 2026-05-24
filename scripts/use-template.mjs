#!/usr/bin/env node
/**
 * Rename and (optionally) clean this template for a new project.
 *
 * Usage:
 *   node scripts/use-template.mjs                              # prompts for a name
 *   node scripts/use-template.mjs --name="My App"              # non-interactive
 *   node scripts/use-template.mjs --name="My App" --clean      # also delete demo
 *   node scripts/use-template.mjs --name="My App" --no-i18n    # also rip out i18n
 *
 * What it does:
 *   - rewrites package.json `name` to a slugified form of the new name
 *   - rewrites the title in index.html
 *   - rewrites the readable app name in README.md and .env.example
 *   - rewrites the auth persisted-storage key in
 *     src/features/auth/model/auth-store.ts
 *   - with --clean, removes the demo `home` and `dashboard` views, the
 *     `app-sidebar` widget, and leaves placeholders so the app still builds
 *   - with --no-i18n, uninstalls react-i18next + friends, deletes the i18n
 *     config / direction hook / language switcher, unwraps the providers,
 *     and rewrites every t('foo.bar') back to its English literal so the
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

function getByPath(obj, dotted) {
  return dotted.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) return acc[key]
    return undefined
  }, obj)
}

// --- i18n strip ------------------------------------------------------------

async function stripI18n() {
  const enPath = path.join(repoRoot, 'src/shared/i18n/en.json')
  if (!(await exists(enPath))) {
    console.log('  (i18n already absent — nothing to strip)')
    return
  }
  const en = JSON.parse(await readFile(enPath, 'utf8'))

  // Files that use t() / useTranslation() and need codemodding.
  const targets = [
    'src/views/home/ui/home-view.tsx',
    'src/views/login/ui/login-view.tsx',
    'src/views/dashboard/ui/dashboard-view.tsx',
    'src/views/not-found/ui/not-found-view.tsx',
    'src/features/auth/ui/login-form.tsx',
    'src/widgets/navbar/ui/navbar.tsx',
    'src/widgets/app-sidebar/ui/app-sidebar.tsx',
  ]

  const resolveStatic = (key) => {
    const value = getByPath(en, key)
    if (typeof value !== 'string') {
      throw new Error(
        `--no-i18n: cannot resolve t('${key}') — key missing or not a string in en.json`,
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
      // Replace dynamic t(`prefix.${var}`) with an inline record access so
      // the same key-based map keeps working without i18next.
      text = text.replace(
        /t\(\s*`([^`$]+)\.\$\{([^}]+)\}`\s*\)/g,
        (_match, prefix, varExpr) => {
          const parent = getByPath(en, prefix)
          if (!parent || typeof parent !== 'object') {
            throw new Error(
              `--no-i18n: cannot resolve template literal t(\`${prefix}.\${${varExpr}}\`) — ` +
                `'${prefix}' is missing or not an object in en.json`,
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
      text = text.replace(/t\(\s*(['"])([^'"]+)\1\s*\)/g, (_match, _q, key) =>
        JSON.stringify(resolveStatic(key)),
      )
      return text
    })
    if (changed) changedFiles.push(rel)
  }

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

  // Drop the direction export from shared/lib's barrel.
  await patchFile('src/shared/lib/index.ts', (text) =>
    text.replace(
      /^export \{ DirectionProvider, useDirection, type Direction \} from '\.\/direction'\n/m,
      '',
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
    'src/test/test-utils.tsx',
    'src/shared/lib/index.ts',
    'package.json',
  ]
  await runPrettier(filesToFormat)
}

function runPrettier(files) {
  return new Promise((resolve) => {
    const child = spawn(
      'npx',
      ['--no-install', 'prettier', '--write', '--log-level', 'warn', ...files],
      { cwd: repoRoot, stdio: 'inherit' },
    )
    child.on('error', () => resolve())
    child.on('exit', () => resolve())
  })
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

  const slug = slugify(projectName) || 'new-react-app'
  console.log(`\nProject name : ${projectName}`)
  console.log(`Package slug : ${slug}`)
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

  // 7. theme module + FOUC script — persisted-storage key
  await patchFile('src/shared/lib/theme.tsx', (text) =>
    text.replaceAll('react-template:theme', `${slug}:theme`),
  )
  await patchFile('index.html', (text) =>
    text.replaceAll('react-template:theme', `${slug}:theme`),
  )

  // 8. Optional: strip i18n (run before --clean so it codemods existing files).
  if (wantsNoI18n) {
    await stripI18n()
  }

  // 9. Optional: nuke the demo content
  if (wantsClean) {
    const toRemove = [
      'src/views/home',
      'src/views/dashboard',
      'src/views/ui-kit',
      'src/widgets/app-sidebar',
      'src/widgets/dashboard-layout',
    ]
    for (const rel of toRemove) {
      const full = path.join(repoRoot, rel)
      if (await exists(full)) {
        await rm(full, { recursive: true, force: true })
        console.log(`Removed ${rel}`)
      }
    }
    console.log(
      '\nDemo views/widgets removed. You will need to update:' +
        '\n  - src/views/index.ts' +
        '\n  - src/widgets/index.ts' +
        '\n  - src/app/router.tsx' +
        '\nto remove references to the deleted modules.\n',
    )
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
