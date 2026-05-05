import { createConfig } from '@myui/eslint-config';

const rootDir = import.meta.dirname;

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**', 'next-env.d.ts'],
  },
  ...createConfig({
    tsconfigRootDir: rootDir,
    tsconfigPath: 'tsconfig.eslint.json',
  }),
];
