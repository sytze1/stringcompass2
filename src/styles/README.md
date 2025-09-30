# Styling Guide

Global styling lives in `src/styles` and is organized by concern to keep CSS manageable alongside App Router components.

## Directory Layout
- `colortheme.css` — Defines CSS custom properties for the StringCompass palette. Import at the top of other stylesheets to reuse variables.
- `layout.css` — Base layout styles (html/body resets, `.main-content`, etc.) consumed by `src/app/layout.tsx`.
- `components/` — Module-level styles for shared UI (header, footer). Class names align with component structure for clarity.
- `pages/` — Page-specific styling (home, auth, luthiers, instruments). Each client page imports its corresponding stylesheet.
- `global.css` — Currently empty; reserve for future truly global overrides if needed.

## Usage Patterns
- Import CSS at the top of the component or page that needs it (e.g. `import "../styles/pages/homePage.css";`).
- Keep selectors descriptive (e.g. `.auth-container`, `.luthiers-grid`) and scoped to avoid collisions.
- Leverage theme variables (`var(--color-primary)`, etc.) for consistent colors and easier future theming.
- Comments in `homePage.css` explain intent; follow that standard when adding new styles. `luthiersPage.css` owns map sizing, filter layout, and card typography (distance emphasis, instrument tags).

## Tailwind Consideration
- Tooling for Tailwind (PostCSS plugin, dependency) is present but unused. Decide whether to adopt Tailwind utility classes or remove the dependency to simplify the build.

## Future Enhancements
- Introduce responsive mixins or utility classes for common breakpoints.
- Consolidate repeated card styles into shared component CSS if duplication grows.
- Consider CSS Modules or CSS-in-JS if component encapsulation becomes a priority.
