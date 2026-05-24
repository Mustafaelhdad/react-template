# React Template Setup Phases

## Summary

Create `/Users/DEll/Desktop/work-files/personal-projects/react-template/TEMPLATE_SETUP_PHASES.md` as the working implementation checklist for a reusable React + Vite template modeled after `Elgedawy31/next-template`, adapted away from Next.js and Docker.

The template will use the same architecture style:

```txt
app
views
widgets
features
entities
shared
test
```

Key decisions locked:

- Package manager: `npm`
- UI strategy: UI-light, not full shadcn in the base template
- CI: GitHub Actions included
- Coverage: skipped for v1
- Docker: skipped
- Architecture enforcement: keep ESLint boundaries

## Markdown Artifact

Add `TEMPLATE_SETUP_PHASES.md` in the repository root.

The file should contain the phases below and be used as the checklist during implementation. Each phase should include goals, concrete tasks, and acceptance checks.

## Implementation Phases

### Phase 1: Project Baseline

Status: Completed

Create a Vite React TypeScript project in the current empty workspace.

Install core dependencies:

```txt
react-router-dom
@tanstack/react-query
axios
zustand
zod
react-hook-form
@hookform/resolvers
sonner
lucide-react
clsx
tailwind-merge
class-variance-authority
```

Install dev tooling:

```txt
tailwindcss
@tailwindcss/vite
eslint
typescript-eslint
eslint-config-prettier
eslint-plugin-boundaries
prettier
vitest
jsdom
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
husky
lint-staged
@types/node
```

Acceptance:

```bash
npm install
npm run dev
```

### Phase 2: Tooling Configuration

Status: Completed

Configure:

- Vite with React and Tailwind v4
- TypeScript path alias `@/* -> src/*`
- ESLint flat config
- Prettier
- Vitest with jsdom and setup file
- Husky and lint-staged
- GitHub Actions for `lint`, `type-check`, `test:run`, and `build`

Use scripts:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "type-check": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest",
  "test:run": "vitest run",
  "prepare": "husky"
}
```

Acceptance:

```bash
npm run lint
npm run type-check
npm run test:run
npm run build
```

### Phase 3: Folder Architecture

Status: Completed

Create the architecture matching the Next template pattern:

```txt
src/
  app/
  views/
  widgets/
  features/
  entities/
  shared/
  test/
```

Use `views/` instead of `pages/` to match `next-template`.

Add ESLint boundary rules:

- `shared` imports only `shared`
- `entities` imports `shared` and `entities`
- `features` imports `shared` and `entities`
- `widgets` imports `shared`, `entities`, `features`, and `widgets`
- `views` imports `shared`, `entities`, `features`, `widgets`, and `views`
- `app` imports all layers

Acceptance:

```bash
npm run lint
```

### Phase 4: App Shell and Routing

Status: Completed

Build the reusable shell:

- `src/app/App.tsx`
- `src/app/providers.tsx`
- `src/app/router.tsx`
- route constants in `src/shared/config/routes.ts`
- home, login, dashboard, and not-found views
- main layout widget
- navbar widget
- optional sidebar widget for dashboard layout

Use React Router for route definitions and protected routes.

Acceptance:

- `/` renders home
- `/login` renders login
- `/dashboard` requires auth
- unknown routes render not found

### Phase 5: Shared Infrastructure

Status: Completed

Add reusable shared modules:

- Axios browser client
- endpoint constants
- env config using `VITE_*`
- storage helpers
- `cn()` utility
- toast helper around Sonner
- generic UI primitives: `Button`, `Input`, `Card`, `FormError`, `LoadingScreen`

Do not add full shadcn setup in v1. Keep the template compatible with installing shadcn later per project.

Acceptance:

```bash
npm run type-check
npm run lint
```

### Phase 6: Auth Mock Feature

Status: Completed

Add generic mock auth only:

- login request mock
- auth types
- Zustand auth store
- Zod login schema
- React Hook Form login form
- protected route component
- mock auth persistence through Zustand persist and `localStorage`

No Quran-specific modules or business logic.

Auth persistence policy:

- `localStorage` is allowed only for the template's mock auth state.
- Persisted mock auth can include demo user profile data and a fake access token.
- Do not present `localStorage` as the recommended production storage for real refresh tokens, long-lived access tokens, API keys, permissions, or sensitive user data.
- README docs must state that real projects should replace mock auth with backend-owned session handling, preferably secure `httpOnly` cookies for refresh/session tokens and short-lived access tokens.

Acceptance:

- login form validates input
- successful mock login redirects to dashboard
- logout clears auth state
- protected route blocks unauthenticated users

### Phase 7: Testing Baseline

Status: Completed

Add:

- `src/test/setup.ts`
- `src/test/test-utils.tsx`
- at least one UI component test
- at least one auth/login form test

Acceptance:

```bash
npm run test:run
```

### Phase 8: Documentation and Template Cleanup

Status: Completed

Add:

- `README.md`
- `.env.example`
- `.gitignore`
- clean starter copy explaining usage, architecture, and rules

README should document:

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run test:run
npm run build
```

Also document future shadcn usage:

```bash
npx shadcn@latest init
npx shadcn@latest add button input label card form sonner
```

Also document auth storage clearly:

- the included auth flow is mock/demo-only
- mock login state is persisted with Zustand and `localStorage`
- production projects should replace this with backend auth
- sensitive tokens should not be stored in `localStorage`

Acceptance:

- README describes the template as generic
- no project-specific business domain exists
- Docker files are absent

### Phase 9: Final Verification

Status: Completed

Run the full readiness checklist:

```bash
npm run format
npm run lint
npm run type-check
npm run test:run
npm run build
```

Then run the dev server:

```bash
npm run dev
```

Verify the app in the browser.

### Phase 10: GitHub Template Publishing

Initialize Git after implementation is complete:

```bash
git init
git add .
git commit -m "Initial React template setup"
git branch -M main
```

Push to GitHub repo `Elgedawy31/react-template` or another chosen repo name.

After push, enable:

```txt
Settings -> General -> Template repository
```

## Test Plan

Required commands before considering the template ready:

```bash
npm run format
npm run lint
npm run type-check
npm run test:run
npm run build
npm run dev
```

Manual browser checks:

- home page renders
- login page renders
- mock login works
- dashboard route is protected
- not-found route works
- layout is responsive on desktop and mobile

## Assumptions

- The current workspace is empty and should be built from scratch.
- `npm` is the standard package manager.
- Docker is excluded entirely.
- GitHub Actions are included, but coverage is excluded for v1.
- The base template remains UI-light; shadcn can be installed later in real projects.
- Folder architecture follows the existing `next-template` style using `views/`, not `pages/`.
