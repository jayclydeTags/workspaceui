# Testing rule: new component or block, and prop changes

Every new distributable component or block added to
`src/registry/bases/base/workspaceui/` needs tests at **three** levels:

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
3. **Docs-level** — a doc page and sidebar entries (see the "Documentation"
   section of CLAUDE.md). Also no test to hand-write:
   `src/registry/__tests__/registry-docs.test.ts` runs against every
   `registry:ui` item automatically and checks:
   - `src/content/docs/components/<name>.mdx` exists
   - the component name is listed in `src/content/docs/components/meta.json`
     `pages` and a sidebar entry exists in `src/lib/nav.ts` (the hand-rolled
     `SidebarNav` renders the docs sidebar from this config — see CLAUDE.md's
     "UI architecture" section)
   - **every prop on the component's `export interface <Name>Props`
     appears as a key in that mdx's `<TypeTable>` block(s)** — this is the
     check that catches "changed the component but forgot to update the
     docs": add/rename a prop and the test fails until the `<TypeTable>`
     is updated to match.

So: add the component test yourself, add the `registry.json` entry and the
mdx doc + sidebar entries, then run `pnpm test` — both registry test
suites pick up the new item and prop changes with no extra code. If
`pnpm test` passes but you skipped one of these, the gap won't surface
until someone runs `npx shadcn add` or reads stale docs — the tests only
validate what exists, they can't detect something missing entirely.

Known limitation: the prop-doc check only verifies prop *names* are
present in the `<TypeTable>`, not that descriptions/types/defaults are
accurate — that still needs a human read on review. It also only applies
where the component follows the `export interface <PascalName>Props`
naming convention; components that don't are silently skipped (see the
`ponytail:` comment in `registry-docs.test.ts`).
