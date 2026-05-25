#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const ASSETS_DIR = join(ROOT, 'dist', 'assets')
const MAX_GZIP_BYTES = Number(process.env.BUNDLE_SIZE_LIMIT_KB ?? 500) * 1024

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`
}

let dirStat
try {
  dirStat = await stat(ASSETS_DIR)
} catch {
  console.error(`bundle-size: ${ASSETS_DIR} not found — run \`npm run build\` first.`)
  process.exit(1)
}

if (!dirStat.isDirectory()) {
  console.error(`bundle-size: ${ASSETS_DIR} is not a directory.`)
  process.exit(1)
}

const files = (await readdir(ASSETS_DIR)).filter((f) => f.endsWith('.js'))

if (files.length === 0) {
  console.error('bundle-size: no JS chunks found in dist/assets/.')
  process.exit(1)
}

const results = await Promise.all(
  files.map(async (name) => {
    const buf = await readFile(join(ASSETS_DIR, name))
    const gzipped = gzipSync(buf).length
    return { name, raw: buf.length, gzipped }
  }),
)

results.sort((a, b) => b.gzipped - a.gzipped)

const offenders = results.filter((r) => r.gzipped > MAX_GZIP_BYTES)

console.log(`Bundle size budget: ${formatKb(MAX_GZIP_BYTES)} per chunk (gzip)`)
for (const r of results) {
  const flag = r.gzipped > MAX_GZIP_BYTES ? ' OVER BUDGET' : ''
  console.log(`  ${r.name}  raw ${formatKb(r.raw)}  gzip ${formatKb(r.gzipped)}${flag}`)
}

if (offenders.length > 0) {
  console.error(
    `\nbundle-size: ${offenders.length} chunk(s) exceed the ${formatKb(MAX_GZIP_BYTES)} gzip budget.`,
  )
  process.exit(1)
}

console.log('\nbundle-size: all chunks within budget.')
