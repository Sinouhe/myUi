// packages/eslint-config/index.js
import js from '@eslint/js';
import globals from 'globals';

import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

import tseslint from 'typescript-eslint';

// If your repo currently uses eslint-plugin-prettier, keep it.
// If you prefer eslint-config-prettier only, tell me and we’ll switch cleanly.
import prettier from 'eslint-plugin-prettier';

/**
 * @param {{
 *   tsconfigRootDir?: string,
 *   tsconfigPath?: string | string[],
 * }} options
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
export function createConfig({ tsconfigRootDir, tsconfigPath } = {}) {
  const tsconfigList = Array.isArray(tsconfigPath)
    ? tsconfigPath
    : tsconfigPath
      ? [tsconfigPath]
      : null;

  return [
    // Ignore patterns
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/build/**',
        '**/storybook-static/**',
      ],
    },

    // ⚙️ Global Settings
    {
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            // If explicit tsconfig(s) provided, align resolver with them.
            project: tsconfigList ?? ['./packages/*/tsconfig.json', './apps/*/tsconfig.json'],
            noWarnOnMultipleProjects: true,
          },
          node: {
            extensions: [
              '.js',
              '.jsx',
              '.mjs',
              '.cjs',
              '.ts',
              '.tsx',
              '.d.ts',
              '.json',
              '.css',
              '.module.css',
              '.scss',
              '.sass',
            ],
          },
        },
      },
    },

    // JS ESM (.js, .jsx, .mjs)
    {
      files: ['**/*.{js,jsx,mjs}'],
      languageOptions: {
        sourceType: 'module',
        globals: { ...globals.browser },
      },
      plugins: {
        import: importPlugin,
        react,
        'react-hooks': reactHooks,
        'jsx-a11y': a11y,
      },
      rules: {
        ...js.configs.recommended.rules,
        ...a11y.configs.recommended.rules,

        // Strictness (your preference)
        'no-console': 'error',
        'no-alert': 'error',

        // React
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/self-closing-comp': 'error',
        'react/jsx-boolean-value': ['error', 'never'],

        // Hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',

        // Imports
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
      },
    },

    // JS CJS (.cjs)
    {
      files: ['**/*.cjs'],
      languageOptions: {
        sourceType: 'commonjs',
        globals: { ...globals.node },
      },
      rules: {
        // You can decide if you want console allowed in CJS. Keeping strict by default.
        'no-console': 'error',
        'no-alert': 'error',
      },
    },

    // TS / TSX (type-aware)
    {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
        parserOptions: {
          // Your requested control point:
          // Pass explicit tsconfig per target from the consumer.
          project: tsconfigList ?? true,
          tsconfigRootDir,
        },
        globals: { ...globals.browser },
      },
      plugins: {
        '@typescript-eslint': tseslint.plugin,
        import: importPlugin,
        react,
        'react-hooks': reactHooks,
        'jsx-a11y': a11y,
        prettier,
      },
      rules: {
        // TS base
        ...tseslint.configs.recommended[0].rules,
        ...a11y.configs.recommended.rules,

        'prefer-const': 'warn',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

        // Strictness
        'no-console': 'error',
        'no-alert': 'error',

        // React
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/self-closing-comp': 'error',
        'react/jsx-boolean-value': ['error', 'never'],

        // Hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',

        // Imports
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',

        // IMPORTANT: I’m not enabling import/no-unresolved by default.
        // In Next + TS paths + CSS imports it often becomes noisy.
        // If you insist, we can enable it per-target.
        // 'import/no-unresolved': 'error',

        // Prettier through ESLint (only if you want this behavior)
        'prettier/prettier': 'error',
      },
    },

    // Node scripts/configs: allow console
    {
      files: [
        '**/*.config.{js,cjs,mjs,ts}',
        '**/*.{config,cfg,conf}.js',
        '**/scripts/**/*.{js,ts}',
        'eslint.config.js',
      ],
      languageOptions: {
        globals: { ...globals.node },
        sourceType: 'module',
      },
      rules: {
        'no-console': 'off',
      },
    },
  ];
}
