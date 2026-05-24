#!/usr/bin/env node
/**
 * Rename and (optionally) clean this template for a new project.
 *
 * Usage:
 *   node scripts/use-template.mjs                       # prompts for a name
 *   node scripts/use-template.mjs --name="My App"       # non-interactive
 *   node scripts/use-template.mjs --name="My App" --clean   # also delete demo
 *
 * What it does:
 *   - rewrites package.json `name` to a slugified form of the new name
 *   - rewrites the title in index.html
 *   - rewrites the readable app name in README.md and .env.example
 *   - rewrites the auth persisted-storage key in
 *     src/features/auth/model/auth-store.ts
 *   - with --clean, removes the demo `home` and `dashboard` views, the
 *     `app-sidebar` widget, and leaves placeholders so the app still builds
 *
 * It does not touch git history. Run it once after using "Use this template"
 * on GitHub, commit the result, and move on.
 */

import { readFile, writeFile, rm, stat } from 'node:fs/promises'
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
  console.log(`Clean demos  : ${wantsClean ? 'yes' : 'no'}\n`)

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

  // 7. Optional: nuke the demo content
  if (wantsClean) {
    const toRemove = [
      'src/views/home',
      'src/views/dashboard',
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
  console.log('  2. Commit: `git add -A && git commit -m "chore: rename template"`.')
  console.log('  3. Remove this script if you no longer need it.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
