# CI/CD

The template ships two GitHub Actions workflows and a deploy template.

## Workflows

### `ci.yml`

Runs on every pull request and on pushes to `main`. Each step runs as its
own line in the Actions UI so failures point at the right thing:

1. `format:check` — Prettier
2. `lint` — ESLint (includes the boundaries plugin)
3. `type-check` — `tsc --noEmit`
4. `test:run` — Vitest in run mode
5. `build` — `tsc -b && vite build`
6. `size:check` — gzip budget on `dist/assets/*.js`

Notes:

- A `concurrency:` block cancels superseded PR runs so a fresh push does
  not queue behind stale work. Pushes to `main` are not cancelled.
- Node version is a single-entry matrix (`24`) so adding the next LTS
  later is one line — drop e.g. `26` into the array.
- `setup-node` with `cache: npm` handles the `~/.npm` cache; no extra
  `actions/cache` step is needed.

### `codeql.yml`

GitHub-native static analysis for JavaScript/TypeScript. Runs on:

- pushes to `main`
- pull requests targeting `main`
- a weekly schedule (Mondays 06:00 UTC) so newly-disclosed advisories
  surface even when the repo is quiet

Findings appear under the repo's **Security → Code scanning** tab. The
`security-and-quality` query suite is enabled by default; trim it back to
`security-extended` if the noise floor is too high.

## Deploys

`deploy.yml.example` is a parked template, not an active workflow.

To deploy:

1. Copy `deploy.yml.example` to `deploy.yml`.
2. Uncomment the platform block you want (Vercel, Netlify, or GitHub Pages).
3. Add the required secrets under **Settings → Secrets and variables → Actions**.

Required secrets per platform:

| Platform     | Secrets                                                            |
| ------------ | ------------------------------------------------------------------ |
| Vercel       | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`               |
| Netlify      | `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`                            |
| GitHub Pages | none — also flip **Settings → Pages → Source** to "GitHub Actions" |

For GitHub Pages project sites (`<user>.github.io/<repo>`), set Vite's
`base` to `/<repo>/` in `vite.config.ts` so asset URLs resolve.

## Extending

- New required check? Add a step to the `quality` job in `ci.yml` and
  consider whether it should run before or after `lint`.
- New deploy target? Add another commented block to `deploy.yml.example`
  following the existing pattern.
- Need PR-only checks (e.g. visual regression)? Add a new job with
  `if: github.event_name == 'pull_request'`.
