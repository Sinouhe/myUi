const path = require('node:path');

const quote = (file) => `"${file}"`;

const hasFiles = (files) => Array.isArray(files) && files.length > 0;

const under = (prefix) => (file) => file.startsWith(`${prefix}/`) || file === prefix;

const filterFiles = (files, predicate) => files.filter(predicate);

module.exports = {
  // -----------------------------
  // TypeScript / TSX
  // -----------------------------

  '**/*.{ts,tsx}': (filenames) => {
    const appCvFiles = filterFiles(filenames, under('apps/cv'));
    const uiFiles = filterFiles(filenames, under('packages/ui'));

    const commands = [];

    if (hasFiles(appCvFiles)) {
      commands.push(
        `pnpm exec eslint --fix --cache --config ./apps/cv/eslint.config.js ${appCvFiles
          .map(quote)
          .join(' ')}`,
      );

      // Run typecheck for the workspace when TS/TSX files changed there
      commands.push('pnpm --filter @myui/cv run typecheck');
    }

    if (hasFiles(uiFiles)) {
      commands.push(
        `pnpm exec eslint --fix --cache --config ./packages/ui/eslint.config.js ${uiFiles
          .map(quote)
          .join(' ')}`,
      );

      commands.push('pnpm --filter @myui/ui run typecheck');
    }

    // Format staged TS/TSX files after lint fixes
    if (hasFiles(filenames)) {
      commands.push(`pnpm exec prettier --write ${filenames.map(quote).join(' ')}`);
    }

    return commands;
  },

  // -----------------------------
  // JavaScript / config files
  // -----------------------------

  '**/*.{js,jsx,mjs,cjs}': (filenames) => {
    const appCvFiles = filterFiles(filenames, under('apps/cv'));
    const uiFiles = filterFiles(filenames, under('packages/ui'));

    const commands = [];

    if (hasFiles(appCvFiles)) {
      commands.push(
        `pnpm exec eslint --fix --cache --config ./apps/cv/eslint.config.js ${appCvFiles
          .map(quote)
          .join(' ')}`,
      );
    }

    if (hasFiles(uiFiles)) {
      commands.push(
        `pnpm exec eslint --fix --cache --config ./packages/ui/eslint.config.js ${uiFiles
          .map(quote)
          .join(' ')}`,
      );
    }

    if (hasFiles(filenames)) {
      commands.push(`pnpm exec prettier --write ${filenames.map(quote).join(' ')}`);
    }

    return commands;
  },

  // -----------------------------
  // Styles
  // -----------------------------

  'apps/cv/src/**/*.{css,scss}': (filenames) => {
    const commands = [];

    if (hasFiles(filenames)) {
      commands.push(`pnpm exec stylelint ${filenames.map(quote).join(' ')}`);
      commands.push(`pnpm exec prettier --write ${filenames.map(quote).join(' ')}`);
    }

    return commands;
  },

  'packages/ui/src/**/*.{css,scss}': (filenames) => {
    const commands = [];

    if (hasFiles(filenames)) {
      commands.push(`pnpm exec stylelint ${filenames.map(quote).join(' ')}`);
      commands.push(`pnpm exec prettier --write ${filenames.map(quote).join(' ')}`);
    }

    return commands;
  },

  // -----------------------------
  // Docs / config / data files
  // -----------------------------

  '**/*.{md,json,yml,yaml}': (filenames) => {
    if (!hasFiles(filenames)) {
      return [];
    }

    return [`pnpm exec prettier --write ${filenames.map(quote).join(' ')}`];
  },
};
