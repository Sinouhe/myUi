'use strict';

/**
 * @myui/stylelint-config
 *
 * SCSS support + BEM enforcement with myui- prefix.
 *
 * Rules that would produce errors in pre-existing components are set to
 * "warning" so the pipeline stays green while violations are tracked.
 * Remove the overrides as files are migrated to the convention.
 */
module.exports = {
  extends: ['stylelint-config-recommended-scss'],
  rules: {
    /**
     * Enforce myui-BEM class naming convention.
     * severity: warning — existing components predate this rule.
     */
    'selector-class-pattern': [
      /^myui-[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$/,
      {
        message: (selector) =>
          `"${selector}" does not follow the myui-BEM pattern (myui-block__element--modifier)`,
        severity: 'warning',
      },
    ],

    // Pre-existing violations in existing SCSS — downgraded to warning
    // until components are migrated.
    'no-duplicate-selectors': [true, { severity: 'warning' }],
    'declaration-block-no-duplicate-properties': [true, { severity: 'warning' }],
    'font-family-no-missing-generic-family-keyword': [true, { severity: 'warning' }],
    'no-descending-specificity': [true, { severity: 'warning' }],
  },
};
