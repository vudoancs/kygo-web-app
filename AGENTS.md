# AGENTS — kygo-web-app

Customer-facing web app. Next.js 15 (App Router, Turbopack dev) + React 18 + shadcn/radix + TanStack Query + react-hook-form + sonner.

This file is self-sufficient when the repo is cloned alone. Detailed conventions and examples: [`docs/agents/web-app-reference.md`](docs/agents/web-app-reference.md). Inside the Kygo workspace, `../AGENTS.md` adds the workspace map; this file wins on conventions, never on guardrails (they stack; stricter wins).

## Guardrails (minimum — always apply)

- Vercel builds every PR; treat a merge to `master` as a production release. Never push, merge or open PRs unless the user asks in the current session.
- Never read, print or copy `.env*` values, tokens or credentials; the git remote may embed a credential — never print it.
- Git: check `git status` and branch first; keep the user's uncommitted changes (e.g. a locally modified `tsconfig.tsbuildinfo` — never stage it); commit only task files on a task branch (never `master`); push / PR / merge / branch changes only when asked. No `--force`, no `--no-verify`.
- Changelog: behavior changes go under `## [Unreleased]` in `CHANGELOG.md` (Keep a Changelog groups; why / user-visible effect, breaking changes, new env vars and endpoints; not file lists). Stage only task files + CHANGELOG — never `.env` or build artifacts.

## Commands

```bash
npm run dev     # next dev --turbopack
npm run build
npm run lint
```

No test runner is configured — do not add tests unless asked to set one up.

Lint: CI runs `npm run lint:ci`, which fails when errors/warnings exceed `.eslint-baseline.json`. Do not raise the baseline; after a cleanup run `node scripts/lint-baseline.mjs --update`.

**Lockfile:** `package-lock.json` is committed (CI uses `npm ci`). Adding/upgrading a dependency → commit the updated lockfile in the same change. Your global gitignore may ignore it — use `git add -f package-lock.json`.

## Read before editing

- API calls, hooks, state, forms, language/formatting, UI/accessibility, Next.js patterns → the matching section of `docs/agents/web-app-reference.md` (§2 API, §3 state/forms, §4 language/formatting, §5 UI/a11y, §6 Next.js, §7 tests).
- The backend controller + DTO in `kygo-erp-api` (storefront: `src/modules/web-store/`) for every endpoint you call.

## Conventions (must)

- Data: `httpRequestOrThrow` + `unwrapKygoApiBody` in `src/services/<resource>.service.ts`, TanStack Query hooks in `src/hooks/`; components never call services or `fetch` directly; mutations invalidate related keys.
- UI states: loading, error (`sonner` toast), empty, success; never show sample data when the API fails.
- Forms: react-hook-form `rules` + `defaultValues`; submit disabled while submitting.
- Text: in components using `useLanguage`, new strings via `t()` with vi/en/ko; elsewhere Vietnamese literals.
- Types mirror backend DTOs; no new `any`; no new dependency (especially axios/zod/zustand/next-intl) without asking.

## Facts agents get wrong (verified 2026-10-29)

- **No axios, no zod, no zustand, no next-intl.** Do not add them without asking.
- i18n is a home-made context: `const { t, language } = useLanguage()` from `@/contexts/LanguageContext` (locales `vi` | `en` | `ko`, dictionary inside that file). Only part of the app uses it (~14 files). In a component that already uses `useLanguage`, add new text via `t('ns.key')` and fill **all three** locales; elsewhere Vietnamese literals are acceptable — do not migrate unrelated screens.
- HTTP: `httpRequestOrThrow<T>(path, { method, body, auth: true })` from `@/services/http/client`; unwrap with `unwrapKygoApiBody` (`@/libs/unwrap-api-body`); errors are `HttpError`. Reference: `src/services/users.service.ts`.
- Services: `src/services/<resource>.service.ts`. Hooks: `src/hooks/`. Screens: `src/screens/`.
- Toast: `sonner`.
- Design source: `Kygo-Web-UI` used to be the source of JSX + Tailwind, but it is **not in the workspace** (checked 2026-10-29). Ask the user for the current design before building a new screen; do not restyle existing screens.

## Working on a task when this repo is opened alone

Workspace skills (`kygo-feature`, `kygo-review`, `kygo-debug`) are not available outside the Kygo workspace. Minimum flows — **feature**: requirement + design from the user → backend DTO → types → service → hook → UI with all states → form → `npm run lint` → run `npm run dev` and check the page → CHANGELOG `[Unreleased]` → report. **Review**: Conventions + reference sections; Critical / Suggestion / Nit with `file:line` and a one-line fix. **Debug**: capture the API response header `x-correlation-id` (or `correlationId` in the error body) and hand it to the backend investigation.
