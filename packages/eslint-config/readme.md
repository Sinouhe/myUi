# @myui/eslint-config

Shared ESLint **Flat Config** used across the `myUi` pnpm monorepo.

This package centralizes all ESLint rules for the repository while allowing each workspace (app or package) to use its own **TypeScript configuration** for type-aware linting.

It supports:

- JavaScript ESM (`.js`, `.jsx`, `.mjs`)
- JavaScript CommonJS (`.cjs`)
- TypeScript (`.ts`, `.tsx`) with **type-aware linting**
- React
- React Hooks
- Accessibility (jsx-a11y)
- Import ordering rules
- Prettier integration through ESLint
- Node config/scripts overrides

The configuration is consumed from the **monorepo root**.

---

# Installation

This package declares ESLint and its plugins as **peerDependencies**.

That means the **monorepo root** must install them.

Install them in the root project:

```bash
pnpm add -D \
eslint \
@eslint/js \
typescript-eslint \
globals \
eslint-plugin-import \
eslint-plugin-jsx-a11y \
eslint-plugin-react \
eslint-plugin-react-hooks \
eslint-plugin-prettier
```

# Implementation exemple

```bash
import { createConfig } from '@myui/eslint-config';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [

  // Global ignore rules
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/build/**',
      '**/storybook-static/**'
    ]
  },

  // Next.js application
  ...createConfig({
    tsconfigRootDir: __dirname,
    tsconfigPath: 'apps/cv/tsconfig.json'
  }),

  // React component library
  ...createConfig({
    tsconfigRootDir: __dirname,
    tsconfigPath: [
      'packages/ui/tsconfig.json',
      'packages/ui/tsconfig.typecheck.json'
    ]
  })

];
```
