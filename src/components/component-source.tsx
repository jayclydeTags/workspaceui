import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

import workspaceTabsRaw from "@/registry/bases/base/workspaceui/workspace-tabs.tsx?raw"
import workspaceContextRaw from "@/registry/bases/base/workspaceui/workspace-context.tsx?raw"
import workspaceRaw from "@/registry/bases/base/workspaceui/workspace.tsx?raw"
import pageRaw from "@/registry/bases/base/workspaceui/page.tsx?raw"

const sources: Record<string, string> = {
  "workspace-tabs": workspaceTabsRaw,
  "workspace-context": workspaceContextRaw,
  workspace: workspaceRaw,
  page: pageRaw,
}

interface ComponentSourceProps {
  name: string
  filename?: string
}

export function ComponentSource({ name, filename }: ComponentSourceProps) {
  const src = sources[name]
  if (!src) return null
  return (
    <DynamicCodeBlock
      lang="tsx"
      code={src}
      codeblock={{ title: filename ?? `components/ui/${name}.tsx` }}
    />
  )
}
