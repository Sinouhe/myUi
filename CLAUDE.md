# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
