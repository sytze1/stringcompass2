# StringCompass Codebase Overview

## Documentation Map
- [Root README](README.md) – quickstart commands and links to knowledge base.
- [App Router Guide](src/app/README.md) – page structure, layout, and data-fetch patterns.
- [API Reference](src/app/api/README.md) – serverless route behavior and best practices.
- [Shared Components](src/components/README.md) – header/footer details and expansion tips.
- [Library Layer](src/lib/README.md) – database pool usage and utility guidelines.
- [Styling Guide](src/styles/README.md) – CSS organization and theming conventions.
- [Providers](src/providers/README.md) – global context wrappers such as the SessionProvider.
- [Type Definitions](src/types/README.md) – NextAuth module augmentation and typing conventions.
- [Legacy Express Notes](server/README.md) – status of the deprecated Express prototype.

## Entry Points
- `src/app/layout.tsx`: Global Next.js App Router layout; injects the shared `<Header />`, `<Footer />`, and wraps all pages in the `SessionProvider` for NextAuth.
- `src/app/page.tsx`: Client-rendered landing page that fetches featured luthiers/instruments from internal API routes and renders carousels with `react-slick`. Cards show verification status and instrument coverage sourced from the API.
- `src/app/(about|auth|account|instruments|luthiers)/page.tsx`: Route segments for secondary pages. `auth` and `luthiers` are interactive client components that call REST endpoints; others are currently static placeholders.
- `src/app/api/**/route.ts`: Edge/serverless API handlers that expose database-backed endpoints (`featured_luthiers`, `featured_instruments`, and `auth/register`).
- `src/app/api/auth/[...nextauth]/route.ts`: Primary NextAuth credentials backend issuing JWT-based sessions against the Postgres `users` table via the shared pool in `src/lib/db.ts`.
- `src/auth/[...nextauth]/route.ts`: Legacy duplicate of the NextAuth handler kept under `src/auth`; not referenced by the App Router but worth noting during clean-up.
- `server/index.js`: Commented-out Express + Postgres prototype for REST endpoints. Present but inactive; Next.js APIs have superseded it.

## Folder Structure
```
stringcompass2/
├── CODEBASE_OVERVIEW.md            # Project knowledge base (this file)
├── README.md                       # Developer quickstart & doc links
├── package.json                    # Project metadata and npm scripts
├── next.config.ts                  # Next.js config + image allowlist (mixes ESM/CJS)
├── postcss.config.mjs              # Tailwind postcss preset hook
├── tsconfig.json                   # TypeScript config with `@/*` path alias
├── eslint.config.mjs               # Flat ESLint config extending Next defaults
├── public/
│   ├── uploads/                    # Static image assets for luthiers & instruments
│   └── *.svg/png                   # Favicons and logos
├── server/                         # (Commented) Express prototype
│   ├── README.md                   # Express prototype status
│   ├── index.js
│   └── routes/auth.js
├── src/
│   ├── app/                        # Next.js App Router pages & API routes
│   │   ├── README.md               # Route and API overview
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Home page (client component)
│   │   ├── about/page.tsx
│   │   ├── account/page.tsx
│   │   ├── auth/page.tsx
│   │   ├── instruments/page.tsx
│   │   ├── luthiers/page.tsx
│   │   └── api/
│   │       ├── README.md           # Serverless handler reference
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── auth/register/route.ts
│   │       ├── featured_instruments/route.ts
│   │       └── featured_luthiers/route.ts
│   ├── auth/[...nextauth]/route.ts # Legacy NextAuth handler
│   ├── components/
│   │   ├── README.md               # Shared component guidelines
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── lib/
│   │   ├── README.md               # Database/utility notes
│   │   └── db.ts
│   ├── providers/
│   │   ├── README.md               # Global providers
│   │   └── sessionProvider.tsx
│   ├── styles/
│   │   ├── README.md               # CSS organization & theming
│   │   ├── colortheme.css
│   │   ├── layout.css
│   │   ├── components/*.css        # Header/Footer stylesheets
│   │   └── pages/*.css             # Page-specific styling (home, auth, etc.)
│   └── types/
│       ├── README.md               # Typing conventions
│       └── next-auth.d.ts          # Type augmentation for NextAuth Session/JWT
└── node_modules/                   # Dependencies (ignored from repo overview)
```

## Technologies in Use
- **Next.js 15 (App Router)** with React 19 and Turbopack for dev/build (`next dev --turbopack`).
- **TypeScript** with strict mode and a `@/*` path alias into `src/`.
- **NextAuth Credentials Provider** for authentication, issuing JWT sessions persisted in browser cookies.
- **PostgreSQL** accessed via the `pg` client pool; user and catalog data is fetched with SQL queries inside API routes.
- **bcrypt / bcryptjs** for hashing and verifying passwords (both packages present; `bcryptjs` used in active API route).
- **React Slick** (`react-slick` + `slick-carousel`) for carousel UIs on the landing page.
- **Leaflet/React-Leaflet** for interactive geographic browsing on the luthiers page, rendered with the Carto “Voyager” basemap via `src/components/luthier-map.tsx`.
- **Custom CSS** modules (global stylesheets per component/page) instead of Tailwind, even though Tailwind tooling is configured via PostCSS.
- **React Icons** supplying UI glyphs such as the header user icon.

## Tests
- No automated tests (unit, integration, or end-to-end) are present in the repository. Consider introducing a testing strategy (e.g., Jest/React Testing Library or Playwright) as functionality grows.

## Coding Patterns & Conventions
- **Client vs. server components:** Stateful, interactive pages (`page.tsx`, `luthiers/page.tsx`, `auth/page.tsx`, `account/page.tsx`) are marked with `"use client"` and rely on hooks such as `useEffect` and `useSession`.
- **API-driven data fetching:** UI components fetch data from colocated App Router API routes (`/api/luthiers`, `/api/featured_luthiers`, `/api/featured_instruments`, `/api/auth/register`). Responses are stored in React state and rendered via declarative UI patterns.
- **Database access layer:** All server-side data access centralizes through `src/lib/db.ts`, which instantiates a singleton `pg.Pool` using `process.env.DATABASE_URL`.
- **Authentication flow:** Registration posts directly to a credentials API route that hashes passwords and inserts into Postgres; login uses `next-auth`'s `signIn("credentials")`. Session and JWT callbacks inject `id`/`role` metadata, with module augmentation in `src/types/next-auth.d.ts`.
- **Layout composition:** `src/app/layout.tsx` provides consistent chrome (header/footer) and context providers, while components import their CSS directly to scope styling intent.
- **Styling strategy:** Global CSS files (organized under `styles/components` and `styles/pages`) leverage root-level CSS variables declared in `colortheme.css`. Styles are descriptive with comments explaining intent, and the luthier experience is themed via `src/styles/pages/luthiersPage.css` (map sizing, card typography, filter layout).
- **Legacy scaffolding:** The `server/` directory retains an Express prototype (fully commented) mirroring the current Next.js APIs—a candidate for removal or future reuse.

## Custom Commands & Scripts
- `npm run dev` – Launches the Next.js dev server with Turbopack.
- `npm run build` – Builds the production bundle (also via Turbopack).
- `npm run start` – Starts the production server after building.
- `npm run lint` – Runs ESLint using the flat config extending Next.js defaults.

## Additional Notes & Recommendations
- **Environment variables:** Ensure `DATABASE_URL` and `NEXTAUTH_SECRET` are defined. The legacy Express files reference `DB_HOST`, `DB_PORT`, etc., but those variables are unused in the active Next.js API layer.
- **Image domains:** `next.config.ts` allows remote images served from `http://localhost:3000/uploads/**`; adjust when deploying to production storage/CDN.
- **Geocoding usage:** `/api/geocode` proxies to OpenStreetMap Nominatim. Keep request volume low and set a descriptive User-Agent when customising. Luthier APIs return coordinates, verification flags, and instrument arrays to power filtering and map markers.
- **Dependency cleanup:** Both `bcrypt` and `bcryptjs` are bundled; standardize on one implementation to reduce bundle size and avoid confusion.
- **Auth header UX:** `src/components/header.tsx` displays a placeholder `Hi Username`; consider replacing with `session.user.name` when available.
- **Tailwind tooling:** PostCSS references `@tailwindcss/postcss`, but Tailwind classes are not used in the codebase. Either remove the dependency or adopt Tailwind to justify the build step.
- **NextAuth duplication:** Align on a single NextAuth handler location (App Router vs. legacy `src/auth`) to prevent drift.
- **Testing gap:** With no automated tests, prioritize adding coverage around authentication flows and data-fetching components.
