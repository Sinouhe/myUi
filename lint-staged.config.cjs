// lint-staged.config.cjs
const fs = require('node:fs');
const path = require('node:path');

/**
 * Walk up the directory tree from a file path
 * until we find a directory containing the given file.
 */
function findConfigRoot(filePath, configFileName) {
  let dir = path.dirname(filePath);

  while (dir !== '.' && dir !== path.dirname(dir)) {
    const candidate = path.join(dir, configFileName);
    if (fs.existsSync(candidate)) {
      return dir;
    }
    dir = path.dirname(dir);
  }

  return null;
}

/**
 * Resolve the closest existing file among a list of candidate names.
 */
function findClosestFile(filePath, candidates) {
  let dir = path.dirname(filePath);

  while (dir !== '.' && dir !== path.dirname(dir)) {
    for (const candidateName of candidates) {
      const candidate = path.join(dir, candidateName);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    dir = path.dirname(dir);
  }

  return null;
}

/**
 * Read package name from the nearest package.json, fallback to folder name.
 */
function resolvePackageName(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (pkg.name) {
        return pkg.name;
      }
    } catch (error) {
      console.warn(
        `Could not read package.json for project root "${projectRoot}":`,
        error.message,
      );
    }
  }

  return path.basename(projectRoot);
}

/**
 * Group files by nearest ESLint config root.
 * Fallback to nearest package.json root.
 * Final fallback: file directory.
 */
function groupFilesByProjectRoot(files) {
  return files.reduce((acc, file) => {
    const normalizedFile = file.replace(/\\/g, '/');

    const eslintRoot = findConfigRoot(normalizedFile, 'eslint.config.js');
    const packageRoot = findConfigRoot(normalizedFile, 'package.json');
    const projectRoot = eslintRoot || packageRoot || path.dirname(normalizedFile);

    if (!acc[projectRoot]) {
      acc[projectRoot] = [];
    }

    acc[projectRoot].push(normalizedFile);
    return acc;
  }, {});
}

/**
 * Quote file paths for shell commands.
 */
function quoteFiles(files) {
  return files.map((file) => `"${file}"`).join(' ');
}

/**
 * Build commands for TS/TSX/JS/JSX files.
 */
function buildScriptCommands(files) {
  if (files.length === 0) {
    return [];
  }

  const byProjectRoot = groupFilesByProjectRoot(files);
  const commands = [];
  let i = 0;

  for (const [projectRoot, projectFiles] of Object.entries(byProjectRoot)) {
    i += 1;

    const eslintConfig = path.join(projectRoot, 'eslint.config.js');

    // Prefer tsconfig.eslint.json when available, fallback to tsconfig.json
    const tsconfig =
      findClosestFile(projectFiles[0], ['tsconfig.eslint.json', 'tsconfig.json']) || null;

    const prettierConfig =
      findClosestFile(projectFiles[0], [
        'prettier.config.mjs',
        'prettier.config.js',
        '.prettierrc',
        '.prettierrc.json',
        '.prettierrc.js',
        '.prettierrc.cjs',
        'package.json',
      ]) || null;

    const packageName = resolvePackageName(projectRoot);
    const quotedFiles = quoteFiles(projectFiles);

    console.log(`*** PROJECT ${i} : ${packageName} ***`);
    console.log({
      eslintConfig,
      tsconfig,
      prettierConfig,
      projectFiles,
    });

    if (tsconfig && fs.existsSync(tsconfig)) {
      commands.push(`pnpm exec tsc --noEmit -p "${tsconfig}"`);
    }

    if (fs.existsSync(eslintConfig)) {
      commands.push(`pnpm exec eslint --fix ${quotedFiles} --config "${eslintConfig}"`);
    }

    if (prettierConfig && fs.existsSync(prettierConfig)) {
      commands.push(
        `pnpm exec prettier --write ${quotedFiles} --config "${prettierConfig}"`,
      );
    } else {
      commands.push(`pnpm exec prettier --write ${quotedFiles}`);
    }
  }

  return commands;
}

/**
 * Build commands for CSS/SCSS files.
 */
function buildStyleCommands(files) {
  if (files.length === 0) {
    return [];
  }

  const byProjectRoot = groupFilesByProjectRoot(files);
  const commands = [];
  let i = 0;

  for (const [projectRoot, projectFiles] of Object.entries(byProjectRoot)) {
    i += 1;

    const stylelintConfig =
      findClosestFile(projectFiles[0], ['.stylelintrc.mjs', '.stylelintrc.js']) || null;

    const prettierConfig =
      findClosestFile(projectFiles[0], [
        'prettier.config.mjs',
        'prettier.config.js',
        '.prettierrc',
        '.prettierrc.json',
        '.prettierrc.js',
        '.prettierrc.cjs',
        'package.json',
      ]) || null;

    const packageName = resolvePackageName(projectRoot);
    const quotedFiles = quoteFiles(projectFiles);

    console.log(`*** STYLE PROJECT ${i} : ${packageName} ***`);
    console.log({
      stylelintConfig,
      prettierConfig,
      projectFiles,
    });

    if (stylelintConfig && fs.existsSync(stylelintConfig)) {
      commands.push(
        `pnpm exec stylelint ${quotedFiles} --config "${stylelintConfig}"`,
      );
    }

    if (prettierConfig && fs.existsSync(prettierConfig)) {
      commands.push(
        `pnpm exec prettier --write ${quotedFiles} --config "${prettierConfig}"`,
      );
    } else {
      commands.push(`pnpm exec prettier --write ${quotedFiles}`);
    }
  }

  return commands;
}

/**
 * Build commands for docs/data/config formatting.
 */
function buildFormatOnlyCommands(files) {
  if (files.length === 0) {
    return [];
  }

  const quotedFiles = quoteFiles(files);

  console.log('*** FORMAT ONLY FILES ***');
  console.log({ files });

  return [`pnpm exec prettier --write ${quotedFiles}`];
}

module.exports = {
  // TypeScript / JavaScript files inside apps and packages
  '{apps,packages}/**/*.{ts,tsx,js,jsx,mjs,cjs}': (files) => {
    return buildScriptCommands(files);
  },

  // CSS / SCSS files inside apps and packages
  '{apps,packages}/**/*.{css,scss}': (files) => {
    return buildStyleCommands(files);
  },

  // Markdown / JSON / YAML formatting
  '**/*.{md,json,yml,yaml}': (files) => {
    return buildFormatOnlyCommands(files);
  },
};