import { ComponentPreviewShell } from "@/components/component-preview-shell"
import { WorkspaceLiveDemo } from "@/registry/bases/base/examples/workspace-live"
import { WorkspaceSinglePaneDemo } from "@/registry/bases/base/examples/workspace-single-pane"
import { WorkspaceDirtyTabsDemo } from "@/registry/bases/base/examples/workspace-dirty-tabs"
import { WorkspacePersistenceDemo } from "@/registry/bases/base/examples/workspace-persistence"
import {
  WorkspaceTabsDemo,
  WorkspaceSplitDemo,
  WorkspaceBadgesDemo,
  WorkspaceAddTabDemo,
  WorkspaceProgrammaticDemo,
  WorkspaceContextDemo,
  WorkspaceFallbackDemo,
} from "@/registry/bases/base/examples/workspace-sample"
import { PageLiveDemo } from "@/registry/bases/base/examples/page-live"
import {
  PageDefaultDemo,
  PageWithSubtitleDemo,
  PageWithBreadcrumbsDemo,
  PageWithBadgeAndActionsDemo,
  PageWithoutHeaderDemo,
  PageTitleOnlyDemo,
  PageWithActionsGroupDemo,
  PageScrollDemo,
  PageFullDemo,
} from "@/registry/bases/base/examples/page-sample"
import { PasswordInputLiveDemo } from "@/registry/bases/base/examples/password-input-live"
import {
  PasswordInputDefaultDemo,
  PasswordInputStrengthDemo,
  PasswordInputChecklistDemo,
} from "@/registry/bases/base/examples/password-input-sample"

const previewComponents: Record<string, React.ReactNode> = {
  workspace: <WorkspaceLiveDemo />,
  "workspace-single-pane": <WorkspaceSinglePaneDemo />,
  "workspace-tabs": <WorkspaceTabsDemo />,
  "workspace-split": <WorkspaceSplitDemo />,
  "workspace-badges": <WorkspaceBadgesDemo />,
  "workspace-add-tab": <WorkspaceAddTabDemo />,
  "workspace-programmatic": <WorkspaceProgrammaticDemo />,
  "workspace-context": <WorkspaceContextDemo />,
  "workspace-fallback": <WorkspaceFallbackDemo />,
  "workspace-dirty-tabs": <WorkspaceDirtyTabsDemo />,
  "workspace-persistence": <WorkspacePersistenceDemo />,
  page: <PageLiveDemo />,
  "page-default": <PageDefaultDemo />,
  "page-with-subtitle": <PageWithSubtitleDemo />,
  "page-with-breadcrumbs": <PageWithBreadcrumbsDemo />,
  "page-with-badge-and-actions": <PageWithBadgeAndActionsDemo />,
  "page-without-header": <PageWithoutHeaderDemo />,
  "page-title-only": <PageTitleOnlyDemo />,
  "page-actions-group": <PageWithActionsGroupDemo />,
  "page-scroll": <PageScrollDemo />,
  "page-full": <PageFullDemo />,
  "password-input": <PasswordInputLiveDemo />,
  "password-input-default": <PasswordInputDefaultDemo />,
  "password-input-strength": <PasswordInputStrengthDemo />,
  "password-input-checklist": <PasswordInputChecklistDemo />,
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
