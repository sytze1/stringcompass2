# Legacy Express Prototype

The `server/` directory contains a commented-out Express.js backend that predates the move to Next.js API routes.

## Files
- `index.js` — Express app that once mounted authentication and catalog endpoints, connecting to Postgres via environment variables (`DB_HOST`, `DB_PORT`, etc.).
- `routes/auth.js` — Router handling register/login flows with JWT issuance.

## Current Status
- All logic is commented and inactive.
- Next.js App Router APIs (`src/app/api`) now serve the same responsibilities using the shared `pg` pool.

## Recommendations
- Remove this directory once you confirm no external systems depend on it.
- Alternatively, revive it for standalone API hosting by re-enabling code and updating config, but ensure it does not conflict with the Next.js implementation.
