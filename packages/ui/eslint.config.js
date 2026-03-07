import { createConfig } from '@myui/eslint-config';

const rootDir = import.meta.dirname;

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/storybook-static/**'],
  },
  ...createConfig({
    tsconfigRootDir: rootDir,
    tsconfigPath: ['tsconfig.json', 'tsconfig.typecheck.json'],
  }),
];
