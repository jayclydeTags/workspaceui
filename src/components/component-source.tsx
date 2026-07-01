import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

import workspaceTabsRaw from "@/components/workspaceui/workspace-tabs.tsx?raw"
import workspacePanelRaw from "@/components/workspaceui/workspace-panel.tsx?raw"
import workspaceContextRaw from "@/components/workspaceui/workspace-context.tsx?raw"
import workspaceRaw from "@/components/workspaceui/workspace.tsx?raw"
import pageRaw from "@/components/workspaceui/page.tsx?raw"

const sources: Record<string, string> = {
  "workspace-tabs": workspaceTabsRaw,
  "workspace-panel": workspacePanelRaw,
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
