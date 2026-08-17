# @happynest/ui

Shared component library and design tokens for HappyNest web apps, derived from the
TailAdmin/shadcn component layer originally built in `admin-dashboard`. This exists so
every HappyNest app surface (admin dashboard, internal tools, `happynest-os`, future
apps) looks and behaves the same without copy-pasting components.

## What's in here

- `components/ui/**` — the TailAdmin-derived component library (buttons, dialogs,
  tables, forms, charts, etc.)
- `components/shadcn/ui/**` — a second shadcn primitives layer some `components/ui`
  pieces build on
- `components/form/SelectMenu.tsx`
- `lib/utils.ts` — `cn()` class-merging helper
- `lib/ui/dynamic-style.ts` — typed inline CSS-variable helper (`hnVars`)
- `hooks/use-mobile.ts`
- `icons/**` — icon barrel (lucide re-exports + a couple of custom icons)
- `styles/theme.css` — the canonical design tokens (colors, radii, dark mode). The
  source of truth for these tokens is
  `apps/admin-dashboard/src/app/(app)/app-globals.css` — if the brand palette changes
  there, port the change here too.

## Using it from an app

This is a **source-included, unbuilt** package — there's no compile step. Consuming
Next.js apps install it as a git dependency and let Next's `transpilePackages`
compile it alongside the app:

```json
// package.json
"dependencies": {
  "@happynest/ui": "github:rykcon/happynest-ui#main"
}
```

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["@happynest/ui"],
};
```

```css
/* app/globals.css */
@import "@happynest/ui/styles/theme.css";
```

```tsx
import { Button } from "@happynest/ui/components/ui/button";
```

## Why a separate repo instead of a monorepo package

`admin-dashboard` already ships from its own repo with its own Vercel project and
deploy history. Rather than merging everything into one Turborepo (a bigger, riskier
migration for a live production app), each app stays independently deployable and
pulls this package in as a versioned dependency — pin a tag/commit per app, bump when
ready. If/when there are enough apps that this stops being enough, revisit a real
monorepo.

## Not included here

Anything business-logic-shaped (real estate formatting helpers, CRM-specific
components, nav wired to admin-dashboard's own routes) was deliberately left out.
This package is presentation-layer only.
