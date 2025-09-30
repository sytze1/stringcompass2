# StringCompass

StringCompass is a Next.js App Router project for discovering luthiers and hand-crafted instruments. This README offers a quickstart and a map to the deeper documentation that lives alongside the source.

## Quickstart
```bash
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) once the dev server is running. Update source files under `src/` to see hot-reloaded changes.

Additional npm scripts:
- `npm run build` – Production build with Turbopack.
- `npm run start` – Serve the production build.
- `npm run lint` – Run ESLint using the provided flat config.

## Project Documentation
- [Codebase Overview](CODEBASE_OVERVIEW.md) – entry points, architecture, and repository map.
- [App Router Guide](src/app/README.md) – route structure and page behavior.
- [API Reference](src/app/api/README.md) – serverless handler responsibilities.
- [Shared Components](src/components/README.md) – header/footer details and guidelines.
- [Library Layer](src/lib/README.md) – database pool usage.
- [Styling Guide](src/styles/README.md) – CSS organization and theming.
- [Providers](src/providers/README.md) – global context wrappers.
- [Type Definitions](src/types/README.md) – NextAuth typing strategy.
- [Legacy Express Notes](server/README.md) – status of the old Express prototype.

## Environment
Set the following variables in `.env.local` (not committed) before running features that touch the database or authentication:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`

## Contributing
1. Create feature branches from `main`.
2. Keep documentation in sync—update the relevant README when adding functionality.
3. Run `npm run lint` (and any future tests) before opening a PR.

See the linked documentation for deeper implementation details and future enhancements.
