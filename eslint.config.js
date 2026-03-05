// eslint.config.js
import { next, reactLib } from '@myui/eslint-config';

const rootDir = import.meta.dirname;

export default [
  {
    // Global ignores applied before all other configs
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/storybook-static/**',
      'eslint.config.js',
    ],
  },
  ...next({
    files: ['apps/cv/src/**/*.{ts,tsx}'],
    tsconfigRootDir: rootDir,
  }),
  ...reactLib({
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    tsconfigRootDir: rootDir,
  }),
];
