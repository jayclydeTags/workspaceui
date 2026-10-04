import { readdirSync } from "fs"
import { join } from "path"
import type { ComponentType } from "react"
import dynamic from "next/dynamic"

import { ComponentPreviewShell } from "@/components/docs/component-preview-shell"
import { getExampleSource } from "@/lib/example-source"

const EXAMPLES_ROOT = "src/registry/bases/base/examples"

// Every doc-page name maps 1:1 to `src/registry/bases/base/examples/<name>.tsx`,
// which exports exactly one demo component. One `dynamic()` per file is built
// here, once, from the directory listing — new example files just need to
// exist, no import to hand-add.
const exampleNames = readdirSync(
  join(/*turbopackIgnore: true*/ process.cwd(), EXAMPLES_ROOT)
)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))

const demoComponents: Record<string, ComponentType> = Object.fromEntries(
  exampleNames.map((name) => [
    name,
    dynamic(() =>
      import(`@/registry/bases/base/examples/${name}.tsx`).then(
        (mod) => Object.values(mod)[0] as ComponentType
      )
    ),
  ])
)

interface ComponentPreviewProps {
  name: string
  className?: string
}

export function hasExample(name: string): boolean {
  return name in demoComponents
}

// The bare demo, without the preview/code chrome — the component studio draws
// its own canvas around it.
export function ExampleDemo({ name }: { name: string }) {
  const Demo = demoComponents[name]
  return Demo ? <Demo /> : null
}

export function ComponentPreview({ name, className }: ComponentPreviewProps) {
  const Demo = demoComponents[name]
  if (!Demo) return null

  const code = getExampleSource(name)

  return (
    <ComponentPreviewShell code={code} className={className}>
      <Demo />
    </ComponentPreviewShell>
  )
}
