import { useState, useEffect } from "react"
import { codeToHtml } from "shiki"

import { ComponentPreviewShell } from "@/components/component-preview-shell"
import { WorkspaceTabsLiveDemo } from "@/components/previews/workspace-tabs-live"
import { WorkspaceLiveDemo } from "@/components/previews/workspace-live"

const previewComponents: Record<string, React.ReactNode> = {
  "workspace-tabs": <WorkspaceTabsLiveDemo />,
  workspace: <WorkspaceLiveDemo />,
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
