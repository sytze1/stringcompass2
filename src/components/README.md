# Shared Components

Reusable UI pieces live in `src/components`. Each component imports its scoped CSS from `src/styles/components` to keep presentation separate from behavior.

## Header
- File: `header.tsx`
- Behavior: Client component using `useSession()` to conditionally show login/logout UI.
- Navigation links target primary routes (`/luthiers`, `/instruments`, `/about`, `/auth`).
- Uses `react-icons` (`FaUser`) and `signOut()` from NextAuth for logout.
- Improvement ideas:
  - Replace placeholder `Hi Username` with `session.user.name`.
  - Consider responsive behavior (mobile nav) if header grows.

## Footer
- File: `footer.tsx`
- Stateless component with navigation links and a copyright line.
- Reads `new Date().getFullYear()` on the client; safe due to lightweight render.

## Expansion Guidelines
- Favor client components when session or browser APIs are required; default to server components otherwise.
- Keep component-level styles in `src/styles/components` and adopt consistent naming (`.header`, `.footer`, etc.).
- Share icons or button patterns via additional components here as the surface area increases.
- Co-locate stories/docs or tests adjacent to new components if a testing/storybook strategy is introduced.
