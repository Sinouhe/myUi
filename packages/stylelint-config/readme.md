# `@myui/stylelint-config`

Shared Stylelint configuration for the `myUi` monorepo.

This package centralizes the SCSS/CSS linting rules used across workspaces and exposes a reusable Stylelint config through the package entrypoint.

---

## What this package provides

- SCSS-aware Stylelint configuration
- shared rules for CSS / SCSS files
- custom internal Stylelint plugins
- consistent naming and formatting constraints across projects

The package is published as a private workspace package and is intended to be consumed from other workspaces such as `packages/ui` or `apps/cv`.

---

## Package entrypoint

`package.json` exposes the shared config through:

```json
{
  "name": "@myui/stylelint-config",
  "type": "module",
  "exports": {
    ".": "./stylelint.config.mjs"
  }
}
```

This allows consumers to extend the config with:

```js
export default {
  extends: ['@myui/stylelint-config'],
};
```

---

## Current implementation

### `package.json`

```json
{
  "name": "@myui/stylelint-config",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./stylelint.config.mjs"
  },
  "files": ["stylelint.config.mjs", "plugins"],
  "peerDependencies": {
    "stylelint": ">=16",
    "stylelint-config-standard-scss": ">=16",
    "postcss-scss": ">=4"
  }
}
```

### `stylelint.config.mjs`

This package currently:

- uses `postcss-scss` for `*.scss` and `*.css`
- extends `stylelint-config-standard-scss`
- ignores generated folders such as `dist` and `node_modules`
- loads custom internal plugins from `./plugins`
- enforces project-specific SCSS and selector rules

---

## Rules included

### Syntax handling

All `*.scss` and `*.css` files are linted using:

- `postcss-scss`

This is configured through `overrides` so Stylelint parses SCSS syntax correctly.

### Base config

The shared config extends:

- `stylelint-config-standard-scss`

This provides a strong baseline for SCSS projects.

### Ignore patterns

The config ignores:

- `**/dist/**`
- `**/node_modules/**`

### Custom plugins

The following local plugins are loaded:

- `./plugins/stylelint-one-root-block.js`
- `./plugins/stylelint-no-nested-classes-in-include.js`
- `./plugins/stylelint-high-contrast-rule.js`
- `./plugins/stylelint-no-bem-nested.js`

These custom rules enforce project-specific authoring constraints.

### Selected customizations

The shared config currently includes notable rules such as:

- `color-named: 'never'`
- `rule-empty-line-before: 'always'` with exceptions
- `declaration-block-no-duplicate-properties` allowing consecutive fallback values
- `no-descending-specificity: null`
- a custom BEM-compatible `selector-class-pattern`
- `custom-property-pattern: null`
- `scss/dollar-variable-pattern` enforcing kebab-case SCSS variables
- `scss/dollar-variable-colon-space-after: null`
- `scss/operator-no-unspaced: null`

And the custom rules:

- `custom/one-root-block`
- `custom/no-nested-classes-in-include`
- `custom/high-contrast-rule`
- `custom/no-bem-nested`

---

## How to consume this package

Because this package declares its Stylelint ecosystem as `peerDependencies`, the consumer workspace must install the required packages explicitly.

### Install in `apps/cv`

Run this command from the monorepo root:

```bash
pnpm --filter @myui/cv add -D @myui/stylelint-config@workspace:* stylelint@^16 stylelint-config-standard-scss@^16 postcss-scss@^4
```

### Example consumer `package.json`

```json
{
  "devDependencies": {
    "@myui/stylelint-config": "workspace:*",
    "stylelint": "^16",
    "stylelint-config-standard-scss": "^16",
    "postcss-scss": "^4"
  }
}
```

### Local Stylelint config

Create a local Stylelint config file in the consumer workspace:

```js
export default {
  extends: ['@myui/stylelint-config'],
};
```

### Add a lint script

Example:

```json
{
  "scripts": {
    "lint:styles": "stylelint \"src/**/*.{css,scss}\""
  }
}
```

---

## Example usage in `apps/cv`

If `apps/cv` starts using SCSS, a minimal setup would be:

### Install dependencies

```bash
pnpm add -D @myui/stylelint-config@workspace:* stylelint@^16 stylelint-config-standard-scss@^16 postcss-scss@^4
```

### `apps/cv/.stylelintrc.mjs`

```js
export default {
  extends: ['@myui/stylelint-config'],
};
```

### `apps/cv/package.json`

```json
{
  "scripts": {
    "lint:styles": "stylelint \"src/**/*.{css,scss}\""
  }
}
```

---

## Example usage in `packages/ui`

`packages/ui` already makes sense as a consumer because it contains SCSS-based components and should follow the shared rules consistently.

Typical setup:

```js
export default {
  extends: ['@myui/stylelint-config'],
};
```

---

## Why this package exists

This package exists to avoid:

- duplicated Stylelint rules across workspaces
- config drift between projects
- ad hoc local SCSS rules
- repeated plugin wiring

It gives the monorepo a single source of truth for style linting.

---

## Notes

- This package is private and intended for internal workspace use.
- Consumers must install compatible peer dependencies explicitly.
- The shared config is opinionated and enforces project-specific SCSS conventions.

---

## Maintenance guidance

When updating this package:

1. keep rules generic enough to be reused across workspaces
2. avoid moving highly local workarounds into the shared config
3. document new custom rules clearly
4. ensure plugin paths remain valid relative to `stylelint.config.mjs`

---

## License

Private workspace package – internal use.
