import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import a11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import globals from 'globals';

/**
 * Shared ESLint rules for all TypeScript/React packages in the monorepo.
 *
 * @param {{ files?: string[], tsconfigRootDir?: string }} options
 * @returns {import('eslint').Linter.Config[]}
 */
function createBase({ files, tsconfigRootDir } = {}) {
  return {
    files: files ?? ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir,
      },
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      a11y,
      import: importPlugin,
      prettier,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./packages/*/tsconfig.json', './apps/*/tsconfig.json'],
          noWarnOnMultipleProjects: true,
        },
        node: true,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,

      'no-console': 'warn',
      'no-alert': 'error',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      'prettier/prettier': 'error',
    },
  };
}

/**
 * Config preset for Next.js apps (apps/cv).
 *
 * @param {{ files?: string[], tsconfigRootDir?: string }} options
 * @returns {import('eslint').Linter.Config[]}
 */
export function next(options = {}) {
  return [createBase(options)];
}

/**
 * Config preset for React component libraries (packages/ui).
 *
 * @param {{ files?: string[], tsconfigRootDir?: string }} options
 * @returns {import('eslint').Linter.Config[]}
 */
export function reactLib(options = {}) {
  return [createBase(options)];
}
