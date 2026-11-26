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

Lint: CI runs `npm run lint:ci`, which fails when errors/warnings exceed `.eslint-baseline.json`. Do not raise the baseline; after a cleanup run `node scripts/lint-baseline.mjs --update`.

**Lockfile:** `package-lock.json` is committed (CI uses `npm ci`). Adding/upgrading a dependency → commit the updated lockfile in the same change. Your global gitignore may ignore it — use `git add -f package-lock.json`.

## Facts agents get wrong (verified 2026-10-29)

- **No axios, no zod, no zustand, no next-intl.** Do not add them without asking.
- i18n is a home-made context: `const { t, language } = useLanguage()` from `@/contexts/LanguageContext` (locales `vi` | `en` | `ko`, dictionary inside that file). Only part of the app uses it (~14 files). In a component that already uses `useLanguage`, add new text via `t('ns.key')` and fill **all three** locales; elsewhere Vietnamese literals are acceptable — do not migrate unrelated screens.
- HTTP: `httpRequestOrThrow<T>(path, { method, body, auth: true })` from `@/services/http/client`; unwrap with `unwrapKygoApiBody` (`@/libs/unwrap-api-body`); errors are `HttpError`. Reference: `src/services/users.service.ts`.
- Services: `src/services/<resource>.service.ts`. Hooks: `src/hooks/`. Screens: `src/screens/`.
- Toast: `sonner`.
- Port JSX + Tailwind from `../Kygo-Web-UI/` without restyling.
