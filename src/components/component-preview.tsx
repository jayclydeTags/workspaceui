import { ComponentPreviewShell } from "@/components/component-preview-shell"
import { WorkspaceTabsLiveDemo } from "@/registry/bases/base/examples/workspace-tabs-live"
import { WorkspaceTabsOverflowDemo } from "@/registry/bases/base/examples/workspace-tabs-overflow"
import { WorkspaceTabsMinimalDemo } from "@/registry/bases/base/examples/workspace-tabs-minimal"
import { WorkspaceLiveDemo } from "@/registry/bases/base/examples/workspace-live"
import { WorkspaceSinglePaneDemo } from "@/registry/bases/base/examples/workspace-single-pane"
import { WorkspacePanelSingleDemo } from "@/registry/bases/base/examples/workspace-panel-single"
import { WorkspacePanelSplitDemo } from "@/registry/bases/base/examples/workspace-panel-split"
import { PageLiveDemo } from "@/registry/bases/base/examples/page-live"
import {
  PageDefaultDemo,
  PageWithSubtitleDemo,
  PageWithBreadcrumbsDemo,
  PageWithBadgeAndActionsDemo,
  PageWithoutHeaderDemo,
  PageFullDemo,
} from "@/registry/bases/base/examples/page-sample"

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
  "page-full": <PageFullDemo />,
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
