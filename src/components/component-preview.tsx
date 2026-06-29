import { useState, useEffect } from "react"
import { codeToHtml } from "shiki"

import { ComponentPreviewShell } from "@/components/component-preview-shell"
import { WorkspaceTabsLiveDemo } from "@/components/previews/workspace-tabs-live"
import { WorkspaceTabsOverflowDemo } from "@/components/previews/workspace-tabs-overflow"
import { WorkspaceTabsMinimalDemo } from "@/components/previews/workspace-tabs-minimal"
import { WorkspaceLiveDemo } from "@/components/previews/workspace-live"
import { WorkspaceSinglePaneDemo } from "@/components/previews/workspace-single-pane"
import { WorkspacePanelSingleDemo } from "@/components/previews/workspace-panel-single"
import { WorkspacePanelSplitDemo } from "@/components/previews/workspace-panel-split"

const previewComponents: Record<string, React.ReactNode> = {
  "workspace-tabs": <WorkspaceTabsLiveDemo />,
  "workspace-tabs-overflow": <WorkspaceTabsOverflowDemo />,
  "workspace-tabs-minimal": <WorkspaceTabsMinimalDemo />,
  workspace: <WorkspaceLiveDemo />,
  "workspace-single-pane": <WorkspaceSinglePaneDemo />,
  "workspace-panel-single": <WorkspacePanelSingleDemo />,
  "workspace-panel-split": <WorkspacePanelSplitDemo />,
}

interface ComponentPreviewProps {
  name: string
  code: string
  className?: string
}

export function ComponentPreview({ name, code, className }: ComponentPreviewProps) {
  const preview = previewComponents[name]
  const [codeHtml, setCodeHtml] = useState("")

  useEffect(() => {
    codeToHtml(code, {
      lang: "tsx",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }).then(setCodeHtml)
  }, [code])

  if (!preview) return null

  return (
    <ComponentPreviewShell code={code} codeHtml={codeHtml} className={className}>
      {preview}
    </ComponentPreviewShell>
  )
}
