# Block creation rule: invoke the shadcn skill first

Before creating a new block in `src/registry/bases/base/blocks/`, **invoke the
`shadcn` skill** (via the Skill tool). It supplies project context, component
docs, and usage examples for composing the block from shadcn/ui primitives —
don't hand-roll primitives or guess at component APIs.

Workflow for a new block:

1. **Invoke `shadcn`** — pull the relevant component docs/examples for what the
   block needs (`Card`, `Table`, `Sidebar`, etc.).
2. Build the block folder (`page.tsx`, `components/`, `data.ts`) using those
   primitives, following an existing block (e.g.
   `blocks/compensation-table-01/`) as the reference pattern.
3. Then satisfy the testing rule in
   [`component-testing.md`](component-testing.md) — component test,
   `registry.json` entry, and doc/sidebar entries.
