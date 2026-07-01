# Testing rule: new component or block

Every new distributable component or block added to
`src/registry/bases/base/workspaceui/` needs tests at **two** levels:

1. **Component-level** — a test in `workspaceui/__tests__/<name>.test.tsx`
   covering its actual behavior (render, interaction, edge cases). This is
   unchanged from existing practice.
2. **Registry-level** — a matching entry in `registry.json` (`files`,
   `dependencies`, `registryDependencies`). You do not need to write a new
   test for this: `src/registry/__tests__/registry.test.ts` runs against
   every item in `registry.json` automatically and checks:
   - every `files[].path` exists on disk
   - every `registryDependencies` entry pointing at a sibling item uses the
     full `jayclydeTags/workspaceui/<item>` address, not a bare name (bare
     names resolve against the consumer's default `@shadcn` registry and
     404 — see CLAUDE.md "Registry distribution model")
   - item names are unique

So: add the component test yourself, add the `registry.json` entry, then
run `pnpm test` — the registry test suite picks up the new item with no
extra code. If `pnpm test` passes but you skipped the `registry.json`
entry, the component is untestable by `npx shadcn add` and won't be caught
by CI; the registry test only validates entries that exist, it can't
detect a missing one.
