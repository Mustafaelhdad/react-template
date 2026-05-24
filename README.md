# React Template

A reusable React starter built with Vite, TypeScript, Tailwind CSS, React Router,
TanStack Query, Zustand, Axios, React Hook Form, Zod, Vitest, ESLint, Prettier,
Husky, and lint-staged.

This template is intentionally generic. It includes a mock auth flow, dashboard
shell, routing, shared API/client utilities, basic UI primitives, testing, linting,
formatting, and a feature-sliced folder architecture.

## Use This Template

Click **Use this template** on GitHub to create your own repository, clone it,
then run:

```bash
nvm use            # picks Node from .nvmrc (24)
npm install
npm run init       # rename the project (prompts for a name)
# or skip demos:
# npm run init -- --name="My App" --clean
```

`npm run init` rewrites the package name, page title, env defaults, and the
auth storage key. With `--clean` it also deletes the demo views and widgets.

## Start Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Quality Checks

```bash
npm run format
npm run lint
npm run type-check
npm run test:run
npm run build
```

## Scripts

```txt
npm run dev           Start Vite dev server
npm run build         Type-check and build for production
npm run preview       Preview the production build
npm run lint          Run ESLint
npm run lint:fix      Run ESLint with auto-fix
npm run type-check    Run TypeScript without emitting files
npm run format        Format files with Prettier
npm run format:check  Check Prettier formatting
npm run test          Run Vitest in watch mode
npm run test:run      Run Vitest once
```

## Architecture

```txt
src/
  app/       App bootstrapping, providers, and router
  views/     Route-level screens
  widgets/   Large composed UI blocks
  features/  User actions and business flows
  entities/  Business models and reusable entity types
  shared/    Generic reusable code, config, API clients, libs, and UI
  test/      Test setup and test utilities
```

Layer rules:

- `shared` contains reusable generic code.
- `entities` contains business models.
- `features` contains user actions and business flows.
- `widgets` contains larger UI blocks composed from lower layers.
- `views` contains route-level screens.
- `app` contains providers, router, and app bootstrapping.

ESLint boundaries enforce this dependency direction.

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Available variables:

```txt
VITE_APP_NAME
VITE_API_BASE_URL
```

`VITE_API_BASE_URL` should be empty for the default `/api` fallback or set to a
full URL such as `http://localhost:3000/api`.

## Mock Auth

The included auth flow is mock/demo-only. It uses:

- React Hook Form and Zod for validation
- a mock login request
- Zustand for auth state
- Zustand persist with `localStorage` for demo persistence

The persisted key is:

```txt
react-template:auth
```

Do not treat this as production token storage. Real projects should replace mock
auth with backend-owned session handling. Prefer secure `httpOnly` cookies for
refresh/session tokens and short-lived access tokens. Do not store sensitive
tokens, API keys, permissions, or sensitive user data in `localStorage`.

## UI

The template stays UI-light. It includes minimal local primitives:

```txt
Button
Input
Card
FormError
LoadingScreen
```

To add shadcn/ui in a real project later:

```bash
npx shadcn@latest init
npx shadcn@latest add button input label card form sonner
```

Configure shadcn to output components into `src/shared/ui` if you want to keep
the same architecture.

## Start A New Project

After this repository is pushed and marked as a GitHub template, use GitHub's
`Use this template` button or clone without history:

```bash
npx degit YOUR_USERNAME/react-template my-new-project
cd my-new-project
npm install
cp .env.example .env
npm run dev
```
