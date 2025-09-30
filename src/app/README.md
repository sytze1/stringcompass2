# App Router Overview

`src/app` hosts the Next.js App Router entry point, combining layouts, routed pages, and colocated API handlers.

## Layout
- `layout.tsx` wraps every route with the shared `<Header />`, `<Footer />`, and the NextAuth `SessionProvider`.
- Theme and structural CSS comes from `../styles/layout.css` and downstream imports.

## Pages
| Route | Component | Notes |
| --- | --- | --- |
| `/` | `page.tsx` | Client component that fetches featured luthiers/instruments and renders React Slick carousels. |
| `/about` | `about/page.tsx` | Static placeholder content. |
| `/account` | `account/page.tsx` | Client-side gate using `useSession`; displays user metadata or prompts for login. |
| `/auth` | `auth/page.tsx` | Handles credentials login/register flows against internal APIs; toggles between modes and uses `signIn`. |
| `/instruments` | `instruments/page.tsx` | Static placeholder. |
| `/luthiers` | `luthiers/page.tsx` | Client component fetching `/api/luthiers` for catalog rendering. |

## Data Fetching Pattern
- Interactive pages are marked with `"use client"` and rely on the browser `fetch` API to call the App Router endpoints.
- Shared types for luthiers/instruments live inline today; consider extracting to `src/types` if reuse grows.

## API Collocation
- App Router API routes reside under `src/app/api`. Each exports `GET`/`POST` handlers invoked via `/api/...` paths.
- These handlers execute on the server and may safely access environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`).

## Auth Notes
- NextAuth is configured at `api/auth/[...nextauth]/route.ts` using the credentials provider.
- Client pages interact via `signIn("credentials")` and `useSession()`.
- Review `src/types/next-auth.d.ts` for typed session extensions.

## Future Enhancements
- Promote static placeholder routes to dynamic content as features expand.
- Extract shared fetch logic and response typing to reduce duplication between home/luthiers pages.
- Monitor `next.config.ts` image allowances when adding remix hosts.
