import { readFileSync } from "fs"
import { join } from "path"
import { DynamicCodeBlock } from "@/components/dynamic-codeblock"

// Server component: read the registry source at build time instead of Vite's
// `?raw` import (unsupported by Turbopack). Runs once per page at static export.
const REGISTRY = "src/registry/bases/base/workspaceui"
const files: Record<string, string> = {
  "workspace-tabs": `${REGISTRY}/workspace-tabs.tsx`,
  "workspace-context": `${REGISTRY}/workspace-context.tsx`,
  workspace: `${REGISTRY}/workspace.tsx`,
  page: `${REGISTRY}/page.tsx`,
}

interface ComponentSourceProps {
  name: string
  filename?: string
}

export function ComponentSource({ name, filename }: ComponentSourceProps) {
  const file = files[name]
  if (!file) return null
  const src = readFileSync(
    join(/*turbopackIgnore: true*/ process.cwd(), file),
    "utf-8"
  )
  return (
    <DynamicCodeBlock
      lang="tsx"
      code={src}
      codeblock={{ title: filename ?? `components/ui/${name}.tsx` }}
    />
  )
}
