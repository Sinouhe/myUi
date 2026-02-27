# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Migration status (session 2026-02-27)

### Completed phases

| Phase | Description                                                                                                    | Status |
| ----- | -------------------------------------------------------------------------------------------------------------- | ------ |
| 1     | pnpm workspace root, `tsconfig.base.json`, root `package.json`                                                 | ✅     |
| 2     | `git mv` all source into `packages/ui`, create `package.json` / `tsconfig` / `vite.config.ts` / `src/index.ts` | ✅     |
| 3     | Scaffold `apps/cv` (Next.js 16, Tailwind v4, App Router)                                                       | ✅     |
| 4     | Root tooling: ESLint paths, `.prettierignore`, `.gitignore`                                                    | ✅     |
| 5     | `pnpm install`, typecheck, lint, dev server smoke test                                                         | ✅     |

### Passing checks

```bash
pnpm -r run typecheck   # ✅ packages/ui + apps/cv — 0 errors
pnpm -r run lint        # ✅ 0 errors; 2 pre-existing no-console warnings in packages/ui
pnpm --filter @myui/cv dev  # ✅ Next.js 16 ready in ~500ms on :3000
```

### Known remaining issue — Next.js production build

`pnpm --filter @myui/cv build` fails with a `ResolvingMetadata` error. Not yet investigated. Likely caused by a metadata type incompatibility introduced by the `module: NodeNext` tsconfig or by `transpilePackages` interacting with Next.js 16's metadata API.

**To investigate next session:**

1. Run `pnpm --filter @myui/cv build 2>&1` and capture the full stack trace.
2. Check whether the error is a TypeScript type error or a runtime error.
3. If type error: compare `apps/cv/tsconfig.json` against the [Next.js 16 recommended tsconfig](https://nextjs.org/docs/app/api-reference/config/typescript). Consider whether `module: NodeNext` is the right choice for a Next.js app or if `module: ESNext` + `moduleResolution: bundler` would be cleaner.
4. If runtime error: check `apps/cv/src/app/layout.tsx` — the `metadata` export type may need updating.

### Remaining cleanup (blocked on Storybook + Next build verification)

These root-level files are **leftover from before the migration** and have not been deleted yet (per agreement: delete only after both `apps/cv` dev and `packages/ui` Storybook are confirmed working):

- `src/` — old Vite app shell (`App.tsx`, `main.tsx`, `index.css`, `stories/`, `assets/`)
- `index.html` — Vite entry point
- `vite.config.ts` — replaced by `packages/ui/vite.config.ts`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — replaced by `tsconfig.base.json` + per-package configs
- `vitest.shims.d.ts`

### Node version

Requires `node >=20.19.0`. The repo was worked on under `v20.12.2` (triggers engine warning); switch before starting:

```bash
nvm use 20.19.0
corepack enable    # ensures pnpm 10.30.3 is active
```

---

## Repo structure

pnpm monorepo with two workspaces:

- **`packages/ui`** — reusable React component library (GSAP animations, SCSS, Storybook)
- **`apps/cv`** — Next.js (App Router) CV website that consumes `@myui/ui`

Shared tooling lives at the root: `eslint.config.js`, `.prettierrc`, `tsconfig.base.json`, Husky pre-commit hook.

## Commands

All commands run from the repo root unless noted.

```bash
# Install all workspace dependencies
pnpm install

# Development
pnpm --filter @myui/ui dev          # Storybook on :6006
pnpm --filter @myui/cv dev          # Next.js on :3000

# Quality
pnpm -r run typecheck               # TypeScript check across all packages
pnpm -r run lint                    # ESLint across all packages
pnpm format                         # Prettier on everything

# Build
pnpm build                          # builds apps/cv only (packages/ui is source-first)
pnpm --filter @myui/ui build:storybook

# Test (run from packages/ui)
pnpm --filter @myui/ui exec vitest  # runs Storybook stories as Vitest tests via Playwright
```

Pre-commit hook runs `lint-staged` automatically (ESLint fix on TS/TSX, Prettier on CSS/SCSS/JSON/MD).

## Key architectural decisions

### Source-first library (`packages/ui`)

`packages/ui` has **no build step** for local development. Its `package.json` points `main` and `exports` directly to `src/index.ts`. `apps/cv` compiles it via Next.js `transpilePackages: ['@myui/ui']`. A Vite library build (for publishing) is a future addition.

### TypeScript

`tsconfig.base.json` at the root defines the shared strict config (`strict`, `noUnusedLocals`, `noUnusedParameters`). Avoid `verbatimModuleSyntax` for now to reduce ESM/SSR friction with Next + `transpilePackages`. Each package's `tsconfig.json` extends it and adds only package-specific overrides (e.g. `"types": ["vite/client"]` in packages/ui, Next.js plugin in apps/cv).

### Component conventions (`packages/ui/src/components/`)

Each component lives in its own directory:

```
ComponentName/
  index.tsx     ← default export, props typed inline or via type.ts
  style.scss    ← scoped SCSS, class names use BEM with a myui- prefix
  type.ts       ← prop/type definitions (when complex enough to separate)
  *.stories.ts  ← Storybook story co-located with the component
```

Components are grouped into sub-directories by animation technique:

- `animeFormation/` — CSS/Intersection Observer animations
- `FreeGSAP3Express/` — GSAP Free tier (ScrollTrigger-free) animations

### GSAP usage

GSAP plugins are registered at **module scope** (`gsap.registerPlugin(SplitText)` outside the component function). This is a side effect — be aware when tree-shaking or SSR. Components in `FreeGSAP3Express/` use only GSAP features available without a Club GreenSock license.

### Scroll-driven animations

Components that animate on scroll use `requestAnimationFrame` requested from a passive scroll listener. The pattern is always:

1. Attach listeners in `useEffect`
2. Cancel the RAF and remove listeners in the cleanup return
3. Use `ref`s for DOM mutation (never state) inside RAF callbacks to avoid React re-renders

### Media singleton (`packages/ui/src/utils/media/index.ts`)

A browser-only singleton that manages `matchMedia` listeners and UA parsing. It exposes a pub/sub API (`subscribeHydrate` / `unSubscribeHydrate`). The `useDevice` hook is the standard consumer. Always guard with `isNode` (from `utils/isomorph`) before accessing browser APIs — this matters for Next.js SSR in `apps/cv`.

### ESLint

Flat config (`eslint.config.js` at root) covers both `packages/*/src/` and `apps/*/src/`. Uses `project: true` for per-package tsconfig discovery. `react-hooks/exhaustive-deps` is set to `error` — do not downgrade it.
