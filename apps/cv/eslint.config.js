import { createConfig } from '@myui/eslint-config';

const rootDir = import.meta.dirname;

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  },
  ...createConfig({
    tsconfigRootDir: rootDir,
    tsconfigPath: 'tsconfig.json',
  }),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      // role="list" is intentionally explicit on <ul> styled with list-style:none
      // — Safari strips the implicit list role in that case.
      'jsx-a11y/no-redundant-roles': 'off',
    },
  },
];
