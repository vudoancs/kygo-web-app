# Web app reference for agents — kygo-web-app

Detailed conventions and examples for the customer-facing app. `AGENTS.md` holds the must-follow summary and says when to read each section. Checked against the code on 2026-10-29; *illustrative* examples show shape only.

## 1. Stack, folders, naming

- Next.js 15 (App Router, `next dev --turbopack`) + React 18, shadcn/radix primitives in `src/components/ui/`, TanStack Query, react-hook-form, sonner, `recharts`. **No axios, zod, zustand or next-intl** — do not add them without asking.
- `src/`: `app/` (routes), `screens/` (page-level screens), `components/` (+ `components/ui/` shadcn), `modules/`, `services/` (+ `services/http/`), `hooks/`, `types/`, `libs/`, `contexts/`, `config/`, `constants/`, `middleware.ts`.
- Naming: symbols — components `PascalCase`, hooks `useCamelCase`, service functions verb-first, types `PascalCase`. Files follow the folder: components `PascalCase.tsx` (`ProductCard.tsx`), hooks `use-<x>-query.ts`, services `<resource>.service.ts`.
- TypeScript: no new `any`; API types mirror `kygo-erp-api` DTOs; unknown field → temporary type + `// TODO: sync with backend DTO`.

## 2. API integration

- Client: `httpRequestOrThrow<T>(path, { method, body, auth: true })` from `@/services/http/client` (fetch-based; refresh handled in `services/http/refresh-access-token.ts`). Unwrap responses with `unwrapKygoApiBody` (`@/libs/unwrap-api-body`); errors are `HttpError` (`@/services/http/errors`, `getErrorMessage`). Never call `fetch` directly for the API.
- Read the real controller + DTO in `kygo-erp-api` first (the storefront endpoints live in `src/modules/web-store/`). Checkout uses an `Idempotency-Key` header — keep it on retries.
- Services: `src/services/<resource>.service.ts` (reference `src/services/users.service.ts`). Hooks: `src/hooks/use-<x>-query.ts` with TanStack Query; mutations invalidate related keys; components never call services directly.
- UI shows loading, error, empty, success; errors → `sonner` toast; no empty `catch`; do not show placeholder/sample data when the API fails.

```ts
// illustrative
export async function fetchMyOrders(): Promise<MyOrder[]> {
  const body = await httpRequestOrThrow<unknown>("/web/orders", { method: "GET", auth: true });
  return unwrapKygoApiBody<MyOrder[]>(body);
}
```

## 3. State and forms

- Local state first; server state in TanStack Query; URL for filters/pagination; React context (`src/contexts/`) for app-wide UI state (no zustand).
- Forms: react-hook-form with RHF `rules` (no zod); always `defaultValues`; `form.handleSubmit(onSubmit)`; disable submit while submitting; Vietnamese error messages (or `t()` in screens that use `useLanguage`).

## 4. Language and formatting

- Home-made i18n: `const { t, language } = useLanguage()` from `@/contexts/LanguageContext` (locales `vi` | `en` | `ko`, dictionary in that file). Used in ~14 files. In a component that already uses it, add text with `t('ns.key')` and fill **all three** locales; elsewhere Vietnamese literals are acceptable — do not migrate unrelated screens.
- Prices: `formatVndPrice` (`src/libs/format-price.ts`); dates in Vietnam time: helpers in `src/libs/vn-date.ts`.

## 5. UI and accessibility

- Match the design the user provides (the old design repo `Kygo-Web-UI` is not in the workspace — ask for the current design). Do not restyle existing screens; no added/removed fields or sections without asking.
- Reuse `src/components/` and `src/components/ui/` (shadcn: `Dialog`, `Label`, `Form`, `Sheet`…) before creating components. Tailwind only.
- Accessibility: semantic tags, never `<div onClick>`; `alt` on images; `aria-label` on icon-only buttons; shadcn `Label` + `id` for inputs; dialogs via shadcn `Dialog` (focus trap, Esc).

## 6. Next.js and performance

- Prefer Server Components; `"use client"` only on the smallest interactive component, never on a layout (many existing screens are client components — do not convert them as a side effect).
- `useMemo` / `useCallback` only when needed (memoized child, hook dependency, expensive work).
- Heavy client widgets (`recharts`) → `next/dynamic` when SSR is not needed. Images: existing code uses `<img>` (`no-img-element` lint warning); prefer `next/image` for new in-repo images. `next/font` is not set up here.
- Filters and pagination in `searchParams` so URLs are shareable.

## 7. Tests

No test runner is configured. Do not add one or write tests unless the user asks; verify with `npm run lint` and by running the page (`npm run dev`).
