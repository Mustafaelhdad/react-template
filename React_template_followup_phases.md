# React Template — Follow-up Phases

## Purpose

The base setup (Phases 1–9 in [React_template_setup_phases.md](React_template_setup_phases.md))
is complete: Vite + React 19 + TS, Tailwind v4, FSD architecture, mock auth,
testing, Husky, CI.

This file lists everything still missing — both gaps in the original plan and
common items that get rebuilt in every new project on top of this template. The
goal is to land them in the template **once** so future projects start with them
already wired.

Work each phase one at a time. Each phase is independent and has its own
acceptance check.

---

## Phase 11: Project Identity & Developer Experience

Status: Completed

Everything that should already be in the repo to make starting a new project
from this template trivial.

Tasks:

- Add `.nvmrc` pinned to Node `24` (matches CI).
- Add `"engines"` field to [package.json](package.json) (`node >=24`, `npm >=10`).
- Add `.editorconfig` (UTF-8, LF, 2 spaces, trim trailing whitespace, final newline).
- Add `.vscode/extensions.json` recommending: ESLint, Prettier, Tailwind CSS
  IntelliSense, EditorConfig, Vitest Explorer.
- Add `.vscode/settings.json` with format-on-save, ESLint as formatter for
  JS/TS, Tailwind class regex, `typescript.tsdk: "node_modules/typescript/lib"`.
- Add `.github/PULL_REQUEST_TEMPLATE.md` with sections: Summary, Test Plan,
  Screenshots, Risk.
- Add `.github/ISSUE_TEMPLATE/bug_report.md` and `feature_request.md`.
- Add `.github/CODEOWNERS` (left blank with comment so users fill in).
- Add `.github/dependabot.yml` (weekly npm, weekly github-actions).
- Add `CONTRIBUTING.md` with conventions: branch naming, commit style,
  testing expectations.
- Add `scripts/use-template.mjs`: prompts for project name, rewrites
  `package.json` name, replaces `react-template` in README and `index.html`,
  clears persisted-storage key in [src/features/auth](src/features/auth), removes the demo views
  on `--clean` flag.

Acceptance:

- `node -v` matches `.nvmrc`.
- New project can be initialized via `npm run init` (the new script) in under a
  minute.
- `npm run lint && npm run type-check` still pass.

---

## Phase 12: Conventional Commits & Release Hygiene

Status: Completed

Tasks:

- Install `@commitlint/cli` and `@commitlint/config-conventional` as dev deps.
- Add `commitlint.config.cjs` extending `@commitlint/config-conventional`.
- Add Husky `commit-msg` hook: `npx --no -- commitlint --edit "$1"`.
- Add `CHANGELOG.md` placeholder.
- (Optional, document only) note about adopting `release-please` later.

Acceptance:

- Committing `bad: msg` fails locally.
- Committing `feat: add foo` passes.

---

## Phase 13: UI Primitives Expansion

Status: Completed

> Follow-up: every primitive added here must be re-audited for mobile
> behavior in **Phase 26 (Responsive Foundation)** — touch targets, narrow
> viewports, portal placement, etc.

Current primitives: `Button`, `Input`, `Card`, `FormError`, `LoadingScreen`. The
following are needed in nearly every project — add them as headless,
Tailwind-styled components in [src/shared/ui](src/shared/ui), no Radix dependency unless noted.

Tasks (add one component file each, with a `.test.tsx`):

- `label.tsx`
- `textarea.tsx`
- `checkbox.tsx`
- `radio-group.tsx`
- `switch.tsx`
- `select.tsx` (native first; document upgrading to Radix later)
- `dialog.tsx` (consider Radix `@radix-ui/react-dialog` since rolling your own
  is fiddly)
- `dropdown-menu.tsx` (Radix)
- `tabs.tsx` (Radix or custom)
- `tooltip.tsx` (Radix)
- `badge.tsx`
- `avatar.tsx`
- `skeleton.tsx`
- `spinner.tsx`
- `separator.tsx`
- `pagination.tsx`
- `empty-state.tsx`
- `error-state.tsx`
- `data-table.tsx` (light wrapper; document upgrading to TanStack Table later)

Notes:

- Re-export each from [src/shared/ui/index.ts](src/shared/ui/index.ts).
- Keep API consistent with existing `Button` (CVA variants, `cn()` for class
  merging).
- Add a `Storybook`-style demo page at `src/views/ui-kit` that renders every
  primitive — useful sanity check, kept out of production builds via route
  guard or removed by the `use-template --clean` script.

Acceptance:

- All primitives render in the demo view.
- `npm run test:run` covers at least one interaction per primitive.

---

## Phase 14: Forms Infrastructure

Status: Completed

Tasks:

- Add `<FormField>` wrapper in [src/shared/ui](src/shared/ui) that ties RHF `Controller`
  - `Label` + input + `FormError` together.
- Add common Zod schemas in `src/shared/lib/validators.ts`: `emailSchema`,
  `passwordSchema` (length, complexity), `phoneSchema`, `urlSchema`,
  `requiredString`.
- Add a `useZodForm` thin helper around `useForm({ resolver: zodResolver })` so
  every form doesn't repeat the boilerplate.
- Add a file-upload primitive (drag & drop + click) with preview support.

Acceptance:

- Login form refactored to use `<FormField>` and `useZodForm` and is shorter.
- Tests for both still pass.

---

## Phase 15: Theming & Dark Mode

Status: Completed

Tasks:

- Add `ThemeProvider` in [src/app/providers.tsx](src/app/providers.tsx) backed by `localStorage`
  (key `react-template:theme`) with `'light' | 'dark' | 'system'`.
- Apply theme via `class="dark"` on `<html>` and Tailwind `darkMode: 'class'`.
- Add `useTheme()` hook in [src/shared/lib](src/shared/lib).
- Add `ThemeToggle` widget for the navbar.
- Audit all existing primitives for dark-mode classes.

Acceptance:

- Toggling theme flips colors and persists across reloads.
- No FOUC (theme applied before first paint — read from localStorage in
  `index.html` inline script).

---

## Phase 16: Internationalization (i18n) + RTL

Status: Pending

Tasks:

- Install `i18next` and `react-i18next`.
- Add `src/shared/i18n/` with `index.ts`, `en.json`, `ar.json` (or chosen
  second language).
- Wire `I18nextProvider` into [src/app/providers.tsx](src/app/providers.tsx).
- Add `useDirection()` hook that returns `'ltr' | 'rtl'` and sets
  `dir` attribute on `<html>`.
- Add language switcher widget.
- Verify all primitives render correctly in RTL.

Acceptance:

- Switching language updates copy + direction immediately.
- Login + dashboard views render correctly in RTL.

---

## Phase 17: Routing & Layout Enhancements

Status: Pending

Tasks:

- Convert each view in [src/views](src/views) to `React.lazy` and wrap in `<Suspense>`
  with `LoadingScreen` fallback in [src/app/router.tsx](src/app/router.tsx).
- Add a route-level `<ErrorBoundary>` (use `react-error-boundary`) at the
  router level + a top-level boundary in [src/app/App.tsx](src/app/App.tsx).
- Add a `ScrollToTop` hook/component that scrolls on pathname change.
- Add `<RoleGuard>` component (`<ProtectedRoute roles={['admin']}>`) wired to
  the mock auth user object (extend the user type with `roles: string[]`).
- Add breadcrumbs widget driven by the route tree.
- Add an explicit "session expired" view route (`/session-expired`) reachable
  from the 401 interceptor in Phase 18.
- Refactor [src/widgets/dashboard-layout](src/widgets/dashboard-layout) to have a responsive sidebar
  that collapses to a drawer below `md`. (Coordinate with Phase 26 — both
  touch this widget.)

Acceptance:

- Network tab shows separate chunks per route.
- Throwing inside a view renders the error boundary, not a white screen.
- Sidebar collapses on a 375px viewport.

> Related: **Phase 26 (Responsive Foundation)** covers the broader layout
>
> - breakpoint audit. Land the two together when possible.

---

## Phase 18: API / Data Layer Hardening

Status: Pending

Tasks:

- Add a request interceptor in [src/shared/api/client.ts](src/shared/api/client.ts) that attaches
  `Authorization: Bearer <token>` from the auth store when present.
- Add a response interceptor that on `401` clears auth state and redirects to
  `/session-expired` (use a small in-module event bus or pass router instance).
- Add `parseApiError(error: unknown): { message: string; status?: number }` in
  [src/shared/api](src/shared/api) that normalizes Axios errors and unknown errors into a
  shape components can render.
- Set React Query defaults in [src/app/providers.tsx](src/app/providers.tsx):
  `staleTime: 30_000`, `refetchOnWindowFocus: false`, `retry: 1`.
- Add a query-key factory pattern doc + a sample feature: `src/features/users`
  with `useUsers()`, `useUser(id)`, `useUpdateUser()` showing the pattern.
- Add `useApiMutation` wrapper that toasts on success/error automatically.

Acceptance:

- Hitting a 401 redirects to `/session-expired` and clears auth.
- Sample `useUsers()` works against a placeholder endpoint.
- Network errors render readable messages via `parseApiError`.

---

## Phase 19: Shared Hooks Library

Status: Pending

Add to [src/shared/lib/hooks/](src/shared/lib) — each with a focused test:

- `useDebounce<T>(value, delay)`
- `useDebouncedCallback`
- `useLocalStorage<T>(key, initial)`
- `useMediaQuery(query)` — also required by **Phase 26 (Responsive
  Foundation)**; land this one first if Phase 26 starts before Phase 19
- `useBreakpoint()` — returns the current Tailwind breakpoint (Phase 26)
- `useIsMobile()` — sugar over `useMediaQuery` (Phase 26)
- `useDisclosure()` returns `{ isOpen, open, close, toggle }`
- `useCopyToClipboard()`
- `useIsMounted()`
- `useOnClickOutside(ref, handler)`
- `usePagination({ total, perPage })`
- `usePrevious<T>(value)`
- `useInterval(cb, ms)`

Acceptance:

- All hooks exported from `src/shared/lib/hooks/index.ts`.
- Tests pass.

---

## Phase 20: Feedback Patterns

Status: Pending

Tasks:

- Add `ConfirmDialog` (built on the Phase 13 `dialog`) with a `useConfirm()`
  promise-returning API: `const confirmed = await confirm({ title, body })`.
- Extend [src/shared/lib/toast.ts](src/shared/lib/toast.ts) with `toast.promise`, `toast.error(parseApiError(e))` shortcut.
- Add a global `<ErrorFallback>` view used by the top-level error boundary.
- Add a 500-ish `views/error` view for explicit navigation.

Acceptance:

- Logout button on dashboard uses `useConfirm()` and shows the dialog.

---

## Phase 21: Testing Improvements

Status: Pending

Tasks:

- Install MSW (`msw`) and wire `src/test/msw/handlers.ts` + `server.ts`.
- Update [src/test/setup.ts](src/test/setup.ts) to start/stop the MSW server.
- Add a sample MSW handler for `/auth/login` and migrate the login test to use it.
- Add a `dev`-mode MSW worker (optional, behind `VITE_ENABLE_MSW=true`) for
  building UI before a backend exists.
- Add Vitest coverage config in [vitest.config.ts](vitest.config.ts) (off by default,
  documented in README): `npm run test:coverage`.
- Document Playwright as the recommended E2E option (don't install it in the
  template — too heavy).

Acceptance:

- `npm run test:run` still green.
- `npm run test:coverage` produces a report under `coverage/`.
- Demo app behind `VITE_ENABLE_MSW=true` boots without a backend.

---

## Phase 22: Build & Performance Tooling

Status: Pending

Tasks:

- Add `vite-plugin-svgr` so `import { ReactComponent as Icon } from './x.svg'` works.
- Add `rollup-plugin-visualizer` behind `npm run build:analyze`.
- Configure manual `build.rollupOptions.output.manualChunks` for `react`,
  `react-router-dom`, `@tanstack/react-query` to stabilize chunk hashing.
- Add a bundle-size budget script that fails CI if `dist/assets/*.js` exceeds
  a configured threshold (start permissive, e.g. 500kb gzipped per chunk).
- Document PWA setup with `vite-plugin-pwa` but **don't** install it by default.

Acceptance:

- `npm run build:analyze` opens a visualizer.
- SVG imports as components work.

---

## Phase 23: Monitoring & Analytics Slots

Status: Pending

Tasks:

- Add `src/shared/lib/monitoring.ts` with a thin abstraction
  (`captureError(err)`, `captureEvent(name, props)`) that no-ops by default.
- Wire it into the top-level error boundary and the response interceptor.
- Document how to swap in Sentry / PostHog / Plausible in [README.md](README.md).
- Add `VITE_SENTRY_DSN` and `VITE_ANALYTICS_KEY` placeholders to `.env.example`.

Acceptance:

- Throwing in a view calls `captureError`.
- No actual analytics SDK in dependencies.

---

## Phase 24: CI/CD Enhancements

Status: Pending

Tasks:

- Add `format:check` to the CI job before lint.
- Add a Node version matrix (`24`, plus the next LTS when it lands).
- Add `actions/cache` for `~/.npm` (already covered by `cache: npm`, verify).
- Add a separate `codeql.yml` workflow (GitHub-native, free).
- Add a documented (but commented-out) deploy job for Vercel/Netlify/GH Pages
  so projects can uncomment what they need.
- Add `concurrency:` block to cancel superseded runs on the same PR.

Acceptance:

- CI shows separate `format`, `lint`, `type-check`, `test`, `build` steps.
- CodeQL workflow runs on push to main.

---

## Phase 25: Publish as GitHub Template

Status: Completed (this is Phase 10 from the original plan)

Tasks:

- `git init` (if not already), commit current state.
- Create a new repo (suggested name: `react-template`) under the user's
  GitHub account.
- Push.
- Enable Settings → General → "Template repository".
- Add a clear "Use this template" section at the top of README.
- Add repository description and topics: `react`, `vite`, `typescript`,
  `tailwindcss`, `template`, `feature-sliced`.

Acceptance:

- A test "Use this template" run creates a working clone with no surprises.

---

## Phase 26: Responsive Foundation

Status: Pending

Goal: every view, widget, and primitive shipped in this template renders
cleanly from a 320px mobile viewport up through ultra-wide desktop **out of
the box**, so projects built on this template never have to retrofit
responsiveness later.

This phase has two parts: (a) shared conventions and helpers that future code
should follow, and (b) an audit + fix pass over everything already in the
repo.

### Conventions to lock in

- Document the responsive philosophy in `README.md`:
  - Mobile-first. Default styles target 320px+. Use Tailwind's `sm:` / `md:`
    / `lg:` / `xl:` / `2xl:` prefixes to opt up.
  - Breakpoints (Tailwind defaults): `sm 640`, `md 768`, `lg 1024`,
    `xl 1280`, `2xl 1536`.
  - Layout breakpoint = `md`. Sidebars collapse, navbars switch to a drawer,
    and multi-column grids stack at `< md`.
  - Touch targets: minimum 44×44 px for any interactive element.
  - Typography scale pattern: `text-2xl sm:text-3xl lg:text-4xl` for page
    headings; `text-base lg:text-lg` for prose.
  - Spacing rhythm: `gap-4 lg:gap-6`, `p-4 sm:p-6 lg:p-8` for section
    padding.
- Add `src/shared/ui/container.tsx` — a `<Container>` wrapper with
  responsive max-width and horizontal padding (`mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8`).
  Use it in every view instead of repeating those classes.
- Lift these into shared CSS variables or Tailwind theme extensions only if
  the project diverges from the defaults — otherwise rely on Tailwind.

### Responsive hooks

These also satisfy part of Phase 19, but list them here so they land with
the rest of the responsive plumbing:

- `useMediaQuery(query: string): boolean`
- `useBreakpoint(): 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` (reads the
  Tailwind defaults; SSR-safe by defaulting to `'base'` on the server)
- `useIsMobile(): boolean` — sugar for `useMediaQuery('(max-width: 767px)')`

### Layout audit + fix

- `src/widgets/main-layout` — wrap children in `<Container>`; ensure header
  and footer padding scale at `sm`/`lg`.
- `src/widgets/navbar` — add a mobile hamburger that opens a slide-in
  drawer below `md` (reuse `@radix-ui/react-dialog` as a sheet, or add
  `@radix-ui/react-popover`). Desktop layout stays as-is at `md+`.
- `src/widgets/dashboard-layout` — collapse the sidebar to a drawer below
  `md` (this overlaps Phase 17 — land both together if possible).
- `src/widgets/app-sidebar` — make collapsible: full width on mobile drawer,
  fixed width on desktop, plus a toggle button on the desktop top bar.
- All views (`home`, `login`, `dashboard`, `ui-kit`, `not-found`): test at
  320, 375, 414, 768, 1024, 1440. Fix any horizontal scroll, cramped
  spacing, or overflowing headings.

### Primitive audit + fix

- `Dialog` — verify content max-width works at 320px (`max-w-lg` plus
  `w-[calc(100%-2rem)]` is a safe pattern). Consider a `Sheet` variant for
  mobile bottom-sheet behavior — defer to a follow-up if too much for now.
- `DropdownMenu` — confirm portal placement on small touch screens; widen
  default `min-w` so menu items don't truncate on mobile.
- `Tooltip` — disable on touch devices (`hover` doesn't trigger them
  reliably). Add a note in docs.
- `Tabs` — wrap `TabsList` in overflow-x-auto for narrow viewports so
  many-tab cases don't blow out the page.
- `Pagination` — reduce `siblings` automatically to 0 on `< sm` so the
  component fits a 320px screen.
- `DataTable` — already wraps in `overflow-auto` ✓ (just verify on a real
  device).
- `FormField` — `<Input>` is already `w-full`. Confirm the demo form in
  `ui-kit` stacks cleanly under 480px.
- `FileUpload` — ensure the drop zone and the preview row both reflow on
  narrow screens (file name truncation already in place).
- `Button` `size="icon"` — bump from `size-10` (40px) to `size-11` (44px)
  to meet the touch-target minimum, or document an `xs`/`sm`/`md` size
  ladder where `md+` is the touch-safe default.

### Developer ergonomics

- Add an optional `BreakpointIndicator` widget (renders the current
  breakpoint label in a fixed-position pill, dev-only via
  `import.meta.env.DEV`). Mount it inside `App.tsx` behind a comment so
  projects can opt out.
- README "Responsive Patterns" section: snippets for `<Container>`,
  `useBreakpoint`, and the canonical mobile drawer pattern.

Acceptance:

- No horizontal scroll at 320px on any view.
- Sidebar collapses to a drawer at `< md` on `/dashboard`.
- Navbar collapses to a hamburger at `< md` on every view.
- Every interactive element has at least a 44×44 px hit area.
- `useBreakpoint()` returns the correct value as the viewport resizes
  (covered by a test using a `matchMedia` mock).
- README documents breakpoints, the touch-target rule, and the typography
  scale.
- A manual pass through the UI kit view at 320 / 768 / 1280 shows no
  layout breakage.

---

## Phase 27: Layout Presets (Marketing / Sidebar Dashboard / Topnav Dashboard)

Status: Pending

Today the template ships exactly one shell: a top navbar plus a sidebar
that appears under `/dashboard`. That's fine for a CRUD-style app — but
not for the two other shapes projects start as just as often:

1. **Marketing / landing page.** Hero + sections + footer. No auth, no
   dashboard, no sidebar.
2. **Sidebar-dominant dashboard.** Sidebar is the primary nav, a thin
   topbar carries account/theme controls. (Closest to today's shell.)
3. **Topnav dashboard.** A rich top navigation with horizontal section
   links — no sidebar. Common for content tools, settings-heavy apps.

Goal: make it a one-flag decision when someone uses the template.

### Tasks

Layouts:

- Restructure `src/widgets/` to expose three concrete layout widgets:
  - `marketing-layout` — slim navbar (logo + a few links + theme toggle +
    optional CTA), an `<Outlet>` for marketing sections, and a footer.
  - `dashboard-sidebar-layout` — rename and harden the current
    `dashboard-layout` + `app-sidebar` combo. This is the default.
  - `dashboard-topnav-layout` — a richer navbar with horizontal subnav
    (driven by a route tree config in `shared/config`), no sidebar,
    and a `max-w-screen-2xl` content area below.
- Keep `MainLayout` as a generic shell that just renders the chosen layout
  - global providers — actual routing lives in `src/app/router.tsx`.

Configuration:

- Add `src/shared/config/layout.ts` exporting:
  ```ts
  export const LAYOUT: 'marketing' | 'dashboard-sidebar' | 'dashboard-topnav'
  ```
  This is a compile-time switch the router reads to mount the right
  layout for the protected routes. Default: `dashboard-sidebar`.
- The router exposes a marketing-style outer route (navbar + footer) for
  unauthenticated pages and a chosen dashboard layout for authenticated
  pages.

Rename script (`scripts/use-template.mjs`):

- Accept `--layout=marketing|dashboard-sidebar|dashboard-topnav` (default
  to whatever the user picks interactively).
- When `--clean` is also passed:
  - `marketing` → delete `src/widgets/{app-sidebar,dashboard-sidebar-layout,dashboard-topnav-layout}` + the dashboard view + the auth feature + the login view.
  - `dashboard-sidebar` → delete `marketing-layout` + `dashboard-topnav-layout` + any marketing-only sections.
  - `dashboard-topnav` → delete `marketing-layout` + `dashboard-sidebar-layout` + `app-sidebar`.
- Update `LAYOUT` in `src/shared/config/layout.ts` to the chosen value.

Demo:

- The `/ui-kit` route renders inside the active layout regardless of
  preset, so the kit always looks right.
- Add a tiny screenshot row to the README ("This is what each preset
  looks like") — three side-by-side captures (320px + 1280px) per preset.

Acceptance:

- Running `npm run init -- --name="My App" --clean --layout=marketing`
  produces an app with only the marketing shell — no dashboard, no
  sidebar, no auth.
- Running with `--layout=dashboard-topnav --clean` produces a dashboard
  app with a horizontal nav, no sidebar.
- Default (no flag, no clean) leaves all three layouts present so the
  user can wire them up themselves later.
- Only one sidebar/nav item is ever active for a given route in any
  preset (no duplicate-`to` bugs).
- README shows screenshots and a "choose your layout" section.

> Related: this phase should land **after** Phase 17 (routing & layout
> enhancements) and Phase 26 (responsive foundation) so each layout
> inherits lazy routing, error boundaries, and mobile drawer behavior
> without re-doing the work in three places.

---

## Cross-cutting Cleanup Items

These don't need their own phase but should land alongside relevant work:

- `package.json` `name`, `version`, `description`, `author`, `license`,
  `repository`, `keywords` fields populated.
- Add `LICENSE` (MIT or as preferred).
- Verify `.gitignore` covers `coverage/`, `stats.html` (visualizer),
  `playwright-report/` (in case projects add it).
- README: add a "What's in the box" matrix and a "What we deliberately left
  out" section so future-you doesn't re-research the same choices.
- Verify ESLint boundaries still pass after every phase.
- **Responsiveness is a non-negotiable**: after every phase that touches UI
  (primitives, views, widgets), spot-check at 320 / 768 / 1280 before
  marking the phase done. Phase 26 owns the formal audit, but no phase
  should ship a regression that Phase 26 then has to clean up.

---

## Suggested Order

If you don't want to do them strictly in phase order, this is a rough priority:

1. **Phase 11** (DX) and **Phase 25** (publish as template) — these unlock the
   "starts a new project fast" goal immediately.
2. **Phase 13** (UI primitives) and **Phase 14** (forms) — biggest per-project
   time savers.
3. **Phase 26** (Responsive Foundation) — bake mobile-readiness in before
   any more UI work piles up. Pair with Phase 17 since they share the
   layout widgets.
4. **Phase 18** (API hardening) and **Phase 17** (routing/layout).
5. **Phase 27** (Layout Presets) — once Phase 17 + 26 settle, slot this
   in so new projects can pick marketing / sidebar / topnav at init time.
6. **Phase 15** (dark mode) and **Phase 16** (i18n) — only if you usually
   need them; skip otherwise.
7. The rest as time allows.

---

## Test Plan (after each phase)

```bash
npm run format
npm run lint
npm run type-check
npm run test:run
npm run build
npm run dev   # then click through the demo
```

For any phase that touches UI, also spot-check the dev server at three
viewport widths in DevTools: **320px** (small mobile), **768px** (tablet),
and **1280px** (laptop). Phase 26 formalizes this audit.
