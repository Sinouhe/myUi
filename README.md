# myUi monorepo

A **pnpm monorepo** containing:

- a reusable **React component library** (`packages/ui`)
- a **Next.js CV / portfolio application** (`apps/cv`)

The repository also contains shared configuration packages used across all workspaces (TypeScript, ESLint, Stylelint, Prettier).

The goal of this repository is to experiment with a clean frontend architecture combining:

- a **source-first component library**
- a **Next.js application consuming it directly**
- **shared configuration packages** for tooling consistency

---

# Structure

```
apps/
  cv/                   Next.js 16 CV website (App Router, Tailwind v4)

packages/
  ui/                   React component library (GSAP animations, SCSS, Storybook)
  eslint-config/        Shared ESLint flat config (@myui/eslint-config)
  stylelint-config/     Shared Stylelint config + custom plugins (@myui/stylelint-config)
  prettier-config/      Shared Prettier config (@myui/prettier-config)
  tsconfig/             Shared TypeScript base configs (@myui/tsconfig)
```

---

# Requirements

- Node `>=20.19.0`
- pnpm `>=9`

Recommended setup:

```bash
node -v
nvm use 20.19.0
corepack enable
```

---

# Getting started

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd myUi
pnpm install
```

Start development servers:

```bash
pnpm --filter @myui/ui dev
pnpm --filter @myui/cv dev
```

---

# Development

Main development commands:

```bash
pnpm --filter @myui/ui dev    # Storybook component playground (http://localhost:6006)
pnpm --filter @myui/cv dev    # Next.js development server (http://localhost:3000)
```

---

# Quality

```bash
pnpm -r run typecheck         # TypeScript — all workspaces
pnpm -r run lint              # ESLint + Stylelint — all workspaces
pnpm format                   # Prettier — entire repo
```

A **pre-commit hook** runs `lint-staged` automatically:

- ESLint fix on JS / TS
- Stylelint fix on SCSS
- Prettier on CSS / SCSS / JSON / MD

---

# Build

Build the Next.js CV application:

```bash
pnpm build
```

Build Storybook static output:

```bash
pnpm --filter @myui/ui build:storybook
```

---

# Configuration strategy

Shared tooling is extracted into **private workspace packages** consumed by each app and library.

| Package | Purpose | Consumed by |
|---|---|---|
| `@myui/tsconfig` | Shared TypeScript configs | all workspaces |
| `@myui/eslint-config` | Shared ESLint flat config | each workspace |
| `@myui/stylelint-config` | Shared Stylelint rules | `packages/ui` |
| `@myui/prettier-config` | Shared Prettier formatting | root |

Each workspace owns its own `eslint.config.js`.

The root only holds:

- shared peer dependencies
- Husky
- lint-staged
- Prettier configuration

---

# CV application (`apps/cv`)

A **static CV / portfolio site** built with:

- Next.js 16
- App Router
- Tailwind v4

The application **consumes the UI library directly from source** using:

```
transpilePackages: ['@myui/ui']
```

This means the component library **does not need a build step during development**.

---

# Component library (`packages/ui`)

A **source-first React component library**.

Key characteristics:

- `main` and `exports` point directly to `src/index.ts`
- components use **SCSS with BEM naming (`myui-*`)**
- animations implemented with **GSAP**
- **Storybook stories are co-located** with components

Example component structure:

```
ComponentName/
  index.tsx
  style.scss
  type.ts
  ComponentName.stories.ts
```

---

# Storybook

The component library includes Storybook for isolated development.

Run:

```bash
pnpm --filter @myui/ui dev
```

Access:

```
http://localhost:6006
```

---

# Working with Claude Code

This repository contains a **`CLAUDE.md`** file describing:

- the monorepo architecture
- tooling conventions
- component structure
- development workflow

When using **Claude Code**, ensure this file is read before making changes.

Claude should:

- respect the monorepo structure
- avoid unnecessary abstractions
- keep changes small and incremental
- ensure lint and typecheck pass

---

# Notes

This repository is evolving while the monorepo architecture stabilizes.

Refer to **`CLAUDE.md`** for detailed technical guidance when working inside the codebase.

---

# License

Private repository – internal use.
