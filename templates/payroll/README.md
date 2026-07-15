# Payroll

A frontend-only **payroll application shell** built with WorkspaceUI — a
collapsible sidebar and a tabbed workspace over 11 screens, composed from the
project's payroll blocks. It runs entirely on mock data; there is no backend.

## Stack

Next.js 16 (App Router, static export) · React 19 · Tailwind CSS v4 · shadcn/ui

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Build a static site (emitted to `out/`):

```bash
pnpm build
pnpm preview        # serves out/
```

## Screens

`/login` · `/` (overview) · `/employees` · `/payroll-runs` · `/payslips` ·
`/compensation` · `/deductions` · `/tax-tables` · `/calendar` · `/off-cycle` ·
`/settings`

Sign-in accepts the demo credential `demo@acme.com` / `password`. The shell is
open regardless — every screen is reachable from the sidebar.

## Layout

- `src/app/(app)/` — the shell (sidebar + workspace-tabs) and the 10 in-app
  routes; `src/app/login/` is the standalone sign-in.
- `src/components/ui/` — shadcn primitives.
- `src/registry/bases/base/workspaceui/` — the Workspace / workspace-tabs / Page
  components.
- `src/registry/bases/base/blocks/` — the payroll blocks each screen composes.
