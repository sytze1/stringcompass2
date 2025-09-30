# Type Definitions

Custom TypeScript declarations live in `src/types` to extend or fine-tune the typing story across the app.

## `next-auth.d.ts`
- Augments `next-auth` and `next-auth/jwt` modules so sessions include `id` and `role` fields.
- Consumed implicitly wherever `useSession`, `getServerSession`, or JWT callbacks are used.
- Ensure this directory remains referenced by `tsconfig.json` (it is included by the default glob) so declarations are applied.

## Conventions
- Name files after the package or domain they extend (`next-auth.d.ts`, `catalog.d.ts`, etc.).
- Prefer type-only modules and keep runtime logic out of this directory.
- Add comments when types mirror backend data models to clarify when schema changes require updates.
