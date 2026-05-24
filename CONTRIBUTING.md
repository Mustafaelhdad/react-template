# Contributing

Thanks for taking the time to contribute. This document covers the conventions
used in this repository.

## Local setup

```bash
nvm use            # picks the Node version from .nvmrc
npm install
cp .env.example .env
npm run dev
```

## Branching

- `main` is always deployable / publishable.
- Create a feature branch off `main`. Suggested naming:
  - `feat/<short-description>`
  - `fix/<short-description>`
  - `chore/<short-description>`
  - `docs/<short-description>`

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```txt
<type>(optional-scope): <short summary>

<optional body>

<optional footer>
```

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`,
`build`, `style`, `revert`.

Examples:

- `feat(auth): add role guard component`
- `fix(api): handle 401 without crashing the app`
- `chore: bump dependencies`

A `commit-msg` hook may be enabled (see Phase 12 of the follow-up plan) that
enforces this format.

## Quality checks

Run these before opening a PR:

```bash
npm run format
npm run lint
npm run type-check
npm run test:run
npm run build
```

The same checks run in CI on every push and pull request.

## Architecture rules

This project follows a Feature-Sliced-Design-style layered architecture. Layer
dependency rules are enforced by ESLint boundaries:

- `shared` may import only `shared`.
- `entities` may import `shared` and `entities`.
- `features` may import `shared` and `entities`.
- `widgets` may import `shared`, `entities`, `features`, and `widgets`.
- `views` may import `shared`, `entities`, `features`, `widgets`, and `views`.
- `app` may import everything.

If `eslint-plugin-boundaries` complains, you almost certainly need to move code
to a lower layer rather than disable the rule.

## Pull requests

- One topic per PR. Smaller is easier to review.
- Fill in the PR template (Summary, Changes, Test Plan, Risk).
- Attach screenshots for UI changes.
- Make sure the CI is green before requesting review.

## Tests

- Co-locate unit tests next to the file under test (`foo.tsx` →
  `foo.test.tsx`).
- Use the helpers in `src/test/test-utils.tsx` for rendering components that
  need providers (router, React Query, etc.).
- Prefer testing behavior over implementation. Avoid asserting on class names
  unless that's the contract.

## Reporting bugs / requesting features

Use the issue templates under `.github/ISSUE_TEMPLATE/`.
