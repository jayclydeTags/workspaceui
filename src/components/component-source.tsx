import workspaceTabsRaw from "@/components/workspaceui/workspace-tabs.tsx?raw"
import workspaceRaw from "@/components/workspaceui/workspace.tsx?raw"
import { CodeBlock } from "@/components/code-block"

const sources: Record<string, string> = {
  "workspace-tabs": workspaceTabsRaw,
  workspace: workspaceRaw,
}

interface ComponentSourceProps {
  name: string
  filename?: string
  collapsible?: boolean
}

export function ComponentSource({ name, filename, collapsible = true }: ComponentSourceProps) {
  const src = sources[name]
  if (!src) return null
  return (
    <CodeBlock
      code={src}
      filename={filename ?? `components/ui/${name}.tsx`}
      collapsible={collapsible}
    />
  )
}
