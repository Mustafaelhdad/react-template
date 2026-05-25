# Build & Performance

The template ships with three build-side tools out of the box:

- [`vite-plugin-svgr`](https://github.com/pd4d10/vite-plugin-svgr) for
  importing SVGs as React components.
- [`rollup-plugin-visualizer`](https://github.com/btd/rollup-plugin-visualizer)
  behind `npm run build:analyze` for inspecting bundle composition.
- A bundle-size budget script (`npm run size:check`) wired into CI that
  fails the build if any JS chunk exceeds the gzip budget.

It also pins vendor chunks (React, React Router, React Query) into stable
`manualChunks` so hash diffs from app code don't bust the vendor cache.

## SVGs as React components

`vite-plugin-svgr` is registered in [vite.config.ts](../vite.config.ts).
TypeScript types come from `vite-plugin-svgr/client`, referenced from
[src/vite-env.d.ts](../src/vite-env.d.ts).

Use the `?react` query suffix to import the SVG as a component:

```tsx
import Logo from '@/shared/assets/logo.svg?react'

export function Header() {
  return <Logo className="h-8 w-8 text-primary" aria-hidden />
}
```

Without the suffix, Vite's default behavior still applies — the import
returns a URL string suitable for `<img src={...} />`:

```tsx
import logoUrl from '@/shared/assets/logo.svg'
;<img src={logoUrl} alt="logo" />
```

Treating `?react` as opt-in keeps the boundary explicit: only files that
need to be rendered inline are parsed by SVGR.

## Analyzing the bundle

```bash
npm run build:analyze
```

This sets `ANALYZE=true`, which conditionally enables the visualizer
plugin and writes `stats.html` to the project root. The browser opens
automatically with a treemap view; `stats.html` is gitignored.

Use it when:

- A new dependency has been added and you want to see its real cost.
- A chunk is over budget (see below) and you need to know what's in it.
- You're considering code-splitting and want to find the heavy modules.

## Stable vendor chunks

The Vite config sets `build.rollupOptions.output.manualChunks`:

```ts
manualChunks: {
  react: ['react', 'react-dom'],
  router: ['react-router-dom'],
  query: ['@tanstack/react-query'],
}
```

Pinning these into named groups means routine app-code changes don't
rotate the hashes on the vendor chunks. Returning visitors keep hitting
the same cached files for React, the router, and React Query.

Add new entries here as the dependency surface grows (UI libs, charts,
date libraries are good candidates). Keep groups coarse — a chunk per
package usually creates more requests than it saves.

## Bundle-size budget

```bash
npm run build
npm run size:check
```

The script ([scripts/check-bundle-size.mjs](../scripts/check-bundle-size.mjs))
gzips every `dist/assets/*.js` chunk and fails the build if any of them
exceeds the budget. CI runs it right after `npm run build`
([.github/workflows/ci.yml](../.github/workflows/ci.yml)).

The default budget is **500 kB gzipped per chunk** — permissive on
purpose; the goal is to catch a regression like "the whole app shipped as
one 2 MB blob," not to micro-optimize. Tighten it once the app is
established.

Override the budget per run with `BUNDLE_SIZE_LIMIT_KB`:

```bash
BUNDLE_SIZE_LIMIT_KB=300 npm run size:check
```

When a chunk goes over, `npm run build:analyze` is the next step —
usually it's a heavy dependency that needs lazy-loading or a tree-shake
fix.

## PWA setup (opt-in, not installed)

The template does **not** install `vite-plugin-pwa` by default — most
projects don't need it, and the manifest/icon work is a one-time setup
that's easier to do once the brand is set. When you do need it:

```bash
npm install -D vite-plugin-pwa
```

Then wire it into [vite.config.ts](../vite.config.ts):

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'My App',
        short_name: 'MyApp',
        theme_color: '#ffffff',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
      },
    }),
  ],
})
```

Drop `pwa-192x192.png` and `pwa-512x512.png` into `public/`, then run
`npm run build` and `npm run preview` to test the service worker in a
real browser. See the
[vite-plugin-pwa docs](https://vite-pwa-org.netlify.app/) for the full
configuration surface (offline strategies, manifest options, prompt UI).
