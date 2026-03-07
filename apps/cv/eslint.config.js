import { createConfig } from '@myui/eslint-config';

const rootDir = import.meta.dirname;

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  },
  ...createConfig({
    tsconfigRootDir: rootDir,
    tsconfigPath: 'tsconfig.eslint.json',
  }),
];
