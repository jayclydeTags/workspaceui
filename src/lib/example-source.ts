import { readFileSync } from "fs"
import { join } from "path"

const EXAMPLES_ROOT = "src/registry/bases/base/examples"

// Server-only: reads a demo file at build time so <ComponentPreview>'s Code
// tab can never drift from what's actually rendered in Preview. Examples
// import the component from its internal registry path (so the repo's own
// docs site can render the not-yet-installed source); rewrite that to the
// `@/components/ui/*` path a consumer sees after `npx shadcn add`.
export function getExampleSource(fileName: string): string {
  const src = readFileSync(
    join(
      /*turbopackIgnore: true*/ process.cwd(),
      EXAMPLES_ROOT,
      `${fileName}.tsx`
    ),
    "utf-8"
  )
  return src
    .replace(/^"use client"\n\n/, "")
    .replace(/@\/registry\/bases\/base\/workspaceui\//g, "@/components/ui/")
    .trimEnd()
}
