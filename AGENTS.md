# AGENTS — kygo-web-app

Customer-facing web app. Next.js 15 (App Router, Turbopack dev) + React 18 + shadcn/radix + TanStack Query + react-hook-form + sonner. UI source: `../Kygo-Web-UI/`.

Workspace overview and shared principles: [`../AGENTS.md`](../AGENTS.md). Detailed rules: `../.cursor/rules/web-*.mdc`. If anything here conflicts with the root, this file wins.

## Commands

```bash
npm run dev     # next dev --turbopack
npm run build
npm run lint
```

No test runner is configured — do not add tests unless asked to set one up.

## Facts agents get wrong (verified 2026-10-29)

- **No axios, no zod, no zustand, no next-intl.** Do not add them without asking.
- HTTP: `httpRequestOrThrow<T>(path, { method, body, auth: true })` from `@/services/http/client`; unwrap with `unwrapKygoApiBody` (`@/libs/unwrap-api-body`); errors are `HttpError`. Reference: `src/services/users.service.ts`.
- Services: `src/services/<resource>.service.ts`. Hooks: `src/hooks/`. Screens: `src/screens/`.
- UI text is Vietnamese literals (no i18n library). Toast: `sonner`.
- Port JSX + Tailwind from `../Kygo-Web-UI/` without restyling.
