# Agent Base Instructions

## Project
- Repository type: Discourse theme component
- Primary purpose: render configurable right sidebar blocks on discovery/topic-list routes
- Main config: `settings.yml`
- Main entry connector: `javascripts/connectors/before-list-area/tc-right-sidebar.js`
- Main component wrapper: `javascripts/discourse/components/right-sidebar-blocks.js`

## Repository Layout
- `javascripts/discourse/components/`: sidebar block components (`*.js` + `*.hbs`)
- `javascripts/connectors/`: route connector wiring
- `common/`, `desktop/`, `scss/`: styles/assets
- `locales/en.yml`: user-facing strings
- `test/acceptance/`: frontend acceptance tests
- `.github/workflows/`: CI lint/test behavior

## Working Rules
- Keep changes scoped and minimal.
- Prefer existing naming/patterns used by current block components.
- Update locale strings in `locales/en.yml` for new user-facing text.
- Do not change unrelated files in this repository.
- Preserve compatibility with current settings schema in `settings.yml`.

## Validation
- Install dependencies: `yarn install`
- ESLint:
  - `yarn eslint --ext .js,.js.es6 --no-error-on-unmatched-pattern {test,javascripts}`
- Prettier:
  - `yarn prettier --list-different "test/**/*.{js,es6}"`
  - `find javascripts desktop mobile common scss -type f \( -name "*.scss" -o -name "*.js" -o -name "*.es6" \) | xargs yarn prettier --list-different`
- Ember template lint:
  - `yarn ember-template-lint --no-error-on-unmatched-pattern javascripts`

## Implementation Notes
- Sidebar blocks are configured by `blocks` in `settings.yml` (JSON schema list).
- Route visibility is controlled by `show_in_routes`.
- Some project-specific debug settings already exist; prefer reusing those patterns instead of adding new toggles unless needed.
