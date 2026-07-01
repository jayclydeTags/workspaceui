import { ComponentPreviewShell } from "@/components/component-preview-shell"
import { WorkspaceTabsLiveDemo } from "@/components/previews/workspace-tabs-live"
import { WorkspaceTabsOverflowDemo } from "@/components/previews/workspace-tabs-overflow"
import { WorkspaceTabsMinimalDemo } from "@/components/previews/workspace-tabs-minimal"
import { WorkspaceLiveDemo } from "@/components/previews/workspace-live"
import { WorkspaceSinglePaneDemo } from "@/components/previews/workspace-single-pane"
import { WorkspacePanelSingleDemo } from "@/components/previews/workspace-panel-single"
import { WorkspacePanelSplitDemo } from "@/components/previews/workspace-panel-split"
import { PageLiveDemo } from "@/components/previews/page-live"
import {
  PageDefaultDemo,
  PageWithSubtitleDemo,
  PageWithBreadcrumbsDemo,
  PageWithBadgeAndActionsDemo,
  PageWithoutHeaderDemo,
} from "@/components/previews/page-sample"

const previewComponents: Record<string, React.ReactNode> = {
  "workspace-tabs": <WorkspaceTabsLiveDemo />,
  "workspace-tabs-overflow": <WorkspaceTabsOverflowDemo />,
  "workspace-tabs-minimal": <WorkspaceTabsMinimalDemo />,
  workspace: <WorkspaceLiveDemo />,
  "workspace-single-pane": <WorkspaceSinglePaneDemo />,
  "workspace-panel-single": <WorkspacePanelSingleDemo />,
  "workspace-panel-split": <WorkspacePanelSplitDemo />,
  page: <PageLiveDemo />,
  "page-default": <PageDefaultDemo />,
  "page-with-subtitle": <PageWithSubtitleDemo />,
  "page-with-breadcrumbs": <PageWithBreadcrumbsDemo />,
  "page-with-badge-and-actions": <PageWithBadgeAndActionsDemo />,
  "page-without-header": <PageWithoutHeaderDemo />,
}

interface ComponentPreviewProps {
  name: string
  code: string
  className?: string
}

export function ComponentPreview({ name, code, className }: ComponentPreviewProps) {
  const preview = previewComponents[name]
  if (!preview) return null

  return (
    <ComponentPreviewShell code={code} className={className}>
      {preview}
    </ComponentPreviewShell>
  )
}
