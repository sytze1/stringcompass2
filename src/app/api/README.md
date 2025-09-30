# API Routes

Serverless handlers under `src/app/api` expose backend functionality to the App Router UI.

## Authentication
### `auth/[...nextauth]/route.ts`
- NextAuth credentials provider backed by the `users` table.
- `authorize` queries Postgres and validates passwords with `bcryptjs`.
- JWT callback decorates tokens with `id` and `role`; session callback mirrors values on `session.user`.
- Ensure `NEXTAUTH_SECRET` is set and `DATABASE_URL` resolves to the same database used in other routes.

### `auth/register/route.ts`
- `POST` accepts `{ name, email, password, role, location }` JSON.
- Hashes passwords with `bcryptjs` and inserts the user record.
- Returns the persisted user shape (minus password hash) with HTTP 201.
- On failure responds with HTTP 500 and logs server-side errors.
- Intended to be paired with the client form in `src/app/auth/page.tsx`.

## Catalog Data
### `featured_luthiers/route.ts`
- `GET` selects key profile fields, structured address/coordinate data, verification flag, and aggregated instrument types (limited to 10 rows).
- Used for carousels on the home page.

### `luthiers/route.ts`
- `GET` returns the full catalog of luthiers with geo coordinates (`latitude`, `longitude`), address parts (`street`, `house_number`, `postcode`, `city`, `country`), verification flag, and an `instruments` array aggregated from related listings.
- Filters out rows lacking coordinates to keep the map rendering reliable.
- Consumed by `src/app/luthiers/page.tsx` for listings, distance sorting, instrument/verification filtering, and map pins.

### `featured_instruments/route.ts`
- `GET` joins `instruments` with `luthiers` to surface maker names.
- Retrieves related media via `instrument_media` and attaches `{ media: [...] }` per instrument.
- Responds with an array of instruments ordered randomly and limited to 10.
- Logged output aids debugging; consider replacing `console.log` with structured logging.

## Geocoding
### `geocode/route.ts`
- Lightweight proxy to OpenStreetMap Nominatim for forward geocoding.
- Accepts a `q` search parameter, returns the upstream JSON payload (limited to 5 matches).
- Adds a custom `User-Agent` header and caches responses for an hour to respect rate limits.

## Best Practices
- Keep SQL isolated to this directory or to helper functions in `src/lib` to avoid duplication.
- Prefer parameterized queries via the `pg` pool to mitigate injection risks.
- Use `NextResponse.json` for consistent response envelopes.
- Extend new endpoints alongside existing handlers and keep shared SQL/validation logic in `src/lib` to avoid duplication.
