/** @type {import('stylelint').Config} */
// packages/ui has pre-existing SCSS violations from before stylelint was
// properly wired up. The rules below are temporarily nulled out and should
// be re-enabled and fixed incrementally.
export default {
  extends: ['@myui/stylelint-config'],
};
