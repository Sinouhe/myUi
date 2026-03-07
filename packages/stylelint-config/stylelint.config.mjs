/** @type {import('stylelint').Config} */

export default {
  // Use SCSS syntax for all .scss and .css files
  overrides: [
    {
      files: ['**/*.scss', '**/*.css'],
      customSyntax: 'postcss-scss',
    },
  ],

  // Base ruleset for SCSS projects
  extends: ['stylelint-config-standard-scss'],

  // Do not lint generated output or dependencies
  ignoreFiles: ['**/dist/**', '**/node_modules/**'],

  plugins: [
    './stylelint-one-root-block.js',
    './stylelint-no-nested-classes-in-include.js',
    './stylelint-high-contrast-rule.js',
    './stylelint-no-bem-nested.js',
  ],

  rules: {
    // Disallow named colors like "red", "blue", etc.
    'color-named': 'never',

    'rule-empty-line-before': [
      'always', // Always an empty line before selector
      {
        except: ['first-nested'], // except first rule
        ignore: ['after-comment'], // ignore when after comment
      },
    ],

    // Allow duplicated properties ONLY when they are
    // consecutive and have different values (e.g. vh / svh fallback)
    //
    // ✅ height: 100vh; height: 100svh;
    // ❌ height: 100vh; height: 100vh;
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],

    // Disable descending specificity checks globally
    // (too many false positives with FS-generated IDs)
    'no-descending-specificity': null,

    // Allow BEM-style class names.
    // Supported forms:
    // - block
    // - block__entity
    // - block__entity__sub-entity (and deeper nesting: block__a__b__c...)
    // - optional modifier on the final selector: --modifier
    // Naming rules:
    // - Use "-" for compound names (kebab-case)
    // - Blocks, entities and modifiers can use lowercase letters, digits and dashes
    //
    // NOTE (SCSS nesting):
    // In SCSS, nested selectors like `.block__entity { &__title {} }` compile to
    // `.block__entity__title`. Stylelint validates the *final* class name, not `&__title`,
    // so the regex must allow multiple `__...` segments in the same class.
    'selector-class-pattern': [
      // block(-block)*(__(entity(-entity)*))*(--modifier(-modifier)*)?
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      {
        resolveNestedSelectors: true,
        message:
          'Expected class selector to follow project BEM: block, block__entity, block__entity__sub-entity (and deeper), with optional --modifier. Use "-" for compound names.',
      },
    ],

    // Do not enforce any naming convention on CSS custom properties
    // (we allow things like --logoHeight, not only kebab-case)
    'custom-property-pattern': null,

    // Enforce kebab-case for SCSS variables
    // (variable name only — "$" is implicit and not part of the pattern)
    //
    // ✅ $breakpoints
    // ✅ $breakpoints-mobile
    // ✅ $channel-color-black-000000
    //
    // ❌ $breakpointsMobile
    // ❌ $breakpoints_mobile
    // ❌ $Breakpoints
    // ❌ $_internal-cache
    'scss/dollar-variable-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$',
      {
        message:
          'Expected SCSS variable name to be kebab-case (e.g. $color-primary, $player-video-height).',
      },
    ],

    // Let Prettier handle the spacing after ":" in SCSS variables
    // (avoids conflicts on multi-line variable values)
    'scss/dollar-variable-colon-space-after': null,

    'scss/operator-no-unspaced': null,

    // Custom rules
    'custom/one-root-block': true,
    'custom/no-nested-classes-in-include': true,
    'custom/high-contrast-rule': true,
    'custom/no-bem-nested': true,
  },
};
