# GBS Demo

A Next.js (App Router) starter used as the base layer for the GBS demo. The landing page is intentionally minimal — features get built on top of this scaffold.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Vitest + Testing Library
- ESLint (`eslint-config-next`)
- GitHub Actions CI: lint → typecheck → test → build
- Deployable to Vercel

## Scripts

```bash
npm run dev        # local dev server
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest (run once)
npm run build      # production build
```

## Deploy on Vercel

1. Import this repository in Vercel.
2. Set **Root Directory** to `demo`.
3. Framework preset auto-detects as **Next.js** (see `vercel.json`). No further config needed.
4. Push to `main` → production deploy. PRs get preview deploys automatically.

## CI

Pushes / PRs that touch `demo/**` trigger `.github/workflows/demo-ci.yml`. The workflow uses npm cache and `concurrency` to keep runs fast and cancel superseded ones.

## Where to add a feature

Drop new routes under `src/app/<feature>/page.tsx` and components under `src/app/<feature>/`. Co-locate `*.test.tsx` files next to the code they cover.
