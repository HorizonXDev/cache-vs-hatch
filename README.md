# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

---

## Deploying to GitHub Pages

The repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`) that
builds the app (`npm ci && npm run build`) and publishes `dist/` to GitHub
Pages automatically on every push to `master` (or manually via the **Actions →
Run workflow** button).

One-time setup on GitHub:

1. Push the repo to GitHub (branch `master`).
2. Open **Settings → Pages** and set **Source** to **GitHub Actions** (not
   "Deploy from a branch").
3. Push anything to `master` (or run the workflow manually) and the site goes
   live at `https://horizonxdev.github.io/cache-vs-hatch/`.

Because this is a *project* site, `vite.config.ts` sets
`base: '/cache-vs-hatch/'` so the bundled assets resolve under the repo
sub-path — if you rename the repo on GitHub, update `base` to match.
