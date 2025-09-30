# Providers

Context and provider components that wrap the application live here.

## `sessionProvider.tsx`
- Lightweight client wrapper around NextAuth's `SessionProvider`.
- Imported by `src/app/layout.tsx` to make authentication state available throughout client components.
- Passes children through unchanged; no custom configuration today.

## When to Add Providers
- Introduce new files in this directory when global state (e.g. feature flags, design system context) needs to wrap the app shell.
- Keep providers composable; export named providers for selective usage in test environments when needed.
