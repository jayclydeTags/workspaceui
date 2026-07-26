import { ComponentPreviewShell } from "@/components/component-preview-shell"
import { getExampleSource } from "@/lib/example-source"
import { WorkspaceLiveDemo } from "@/registry/bases/base/examples/workspace-live"
import { WorkspaceSinglePaneDemo } from "@/registry/bases/base/examples/workspace-single-pane"
import { WorkspaceTabsDemo } from "@/registry/bases/base/examples/workspace-tabs"
import { WorkspaceSplitDemo } from "@/registry/bases/base/examples/workspace-split"
import { WorkspaceBadgesDemo } from "@/registry/bases/base/examples/workspace-badges"
import { WorkspaceAddTabDemo } from "@/registry/bases/base/examples/workspace-add-tab"
import { WorkspaceProgrammaticDemo } from "@/registry/bases/base/examples/workspace-programmatic"
import { WorkspaceContextDemo } from "@/registry/bases/base/examples/workspace-context"
import { WorkspaceFallbackDemo } from "@/registry/bases/base/examples/workspace-fallback"
import { WorkspaceDirtyTabsDemo } from "@/registry/bases/base/examples/workspace-dirty-tabs"
import { WorkspacePersistenceDemo } from "@/registry/bases/base/examples/workspace-persistence"
import { PageLiveDemo } from "@/registry/bases/base/examples/page-live"
import { PageDefaultDemo } from "@/registry/bases/base/examples/page-default"
import { PageWithSubtitleDemo } from "@/registry/bases/base/examples/page-with-subtitle"
import { PageWithBreadcrumbsDemo } from "@/registry/bases/base/examples/page-with-breadcrumbs"
import { PageWithBadgeAndActionsDemo } from "@/registry/bases/base/examples/page-with-badge-and-actions"
import { PageWithoutHeaderDemo } from "@/registry/bases/base/examples/page-without-header"
import { PageTitleOnlyDemo } from "@/registry/bases/base/examples/page-title-only"
import { PageWithActionsGroupDemo } from "@/registry/bases/base/examples/page-actions-group"
import { PageScrollDemo } from "@/registry/bases/base/examples/page-scroll"
import { PageFullDemo } from "@/registry/bases/base/examples/page-full"
import { PasswordInputLiveDemo } from "@/registry/bases/base/examples/password-input-live"
import { PasswordInputDefaultDemo } from "@/registry/bases/base/examples/password-input-default"
import { PasswordInputStrengthDemo } from "@/registry/bases/base/examples/password-input-strength"
import { PasswordInputChecklistDemo } from "@/registry/bases/base/examples/password-input-checklist"
import { BulkToolbarLiveDemo } from "@/registry/bases/base/examples/bulk-toolbar-live"
import { DataGridLiveDemo } from "@/registry/bases/base/examples/data-grid-live"
import { DataGridBasicDemo } from "@/registry/bases/base/examples/data-grid-basic"
import { DataGridAllColumnTypesDemo } from "@/registry/bases/base/examples/data-grid-all-column-types"
import { DataGridAddDeleteDemo } from "@/registry/bases/base/examples/data-grid-add-delete"
import { DataGridSelectionDemo } from "@/registry/bases/base/examples/data-grid-selection"
import { DataGridMixedEditableDemo } from "@/registry/bases/base/examples/data-grid-mixed-editable"
import { DataGridNarrowDemo } from "@/registry/bases/base/examples/data-grid-narrow"
import { DataFilterLiveDemo } from "@/registry/bases/base/examples/data-filter-live"

// Doc-page name -> demo element + the example file its source is read from
// (fileName omitted when it's identical to the key).
const previewComponents: Record<
  string,
  { element: React.ReactNode; file?: string }
> = {
  workspace: { element: <WorkspaceLiveDemo />, file: "workspace-live" },
  "workspace-single-pane": { element: <WorkspaceSinglePaneDemo /> },
  "workspace-tabs": { element: <WorkspaceTabsDemo /> },
  "workspace-split": { element: <WorkspaceSplitDemo /> },
  "workspace-badges": { element: <WorkspaceBadgesDemo /> },
  "workspace-add-tab": { element: <WorkspaceAddTabDemo /> },
  "workspace-programmatic": { element: <WorkspaceProgrammaticDemo /> },
  "workspace-context": { element: <WorkspaceContextDemo /> },
  "workspace-fallback": { element: <WorkspaceFallbackDemo /> },
  "workspace-dirty-tabs": { element: <WorkspaceDirtyTabsDemo /> },
  "workspace-persistence": { element: <WorkspacePersistenceDemo /> },
  page: { element: <PageLiveDemo />, file: "page-live" },
  "page-default": { element: <PageDefaultDemo /> },
  "page-with-subtitle": { element: <PageWithSubtitleDemo /> },
  "page-with-breadcrumbs": { element: <PageWithBreadcrumbsDemo /> },
  "page-with-badge-and-actions": { element: <PageWithBadgeAndActionsDemo /> },
  "page-without-header": { element: <PageWithoutHeaderDemo /> },
  "page-title-only": { element: <PageTitleOnlyDemo /> },
  "page-actions-group": { element: <PageWithActionsGroupDemo /> },
  "page-scroll": { element: <PageScrollDemo /> },
  "page-full": { element: <PageFullDemo /> },
  "password-input": {
    element: <PasswordInputLiveDemo />,
    file: "password-input-live",
  },
  "password-input-default": { element: <PasswordInputDefaultDemo /> },
  "password-input-strength": { element: <PasswordInputStrengthDemo /> },
  "password-input-checklist": { element: <PasswordInputChecklistDemo /> },
  "bulk-toolbar": {
    element: <BulkToolbarLiveDemo />,
    file: "bulk-toolbar-live",
  },
  "data-grid": { element: <DataGridLiveDemo />, file: "data-grid-live" },
  "data-grid-basic": { element: <DataGridBasicDemo /> },
  "data-grid-all-column-types": { element: <DataGridAllColumnTypesDemo /> },
  "data-grid-add-delete": { element: <DataGridAddDeleteDemo /> },
  "data-grid-selection": { element: <DataGridSelectionDemo /> },
  "data-grid-mixed-editable": { element: <DataGridMixedEditableDemo /> },
  "data-grid-narrow": { element: <DataGridNarrowDemo /> },
  "data-filter": { element: <DataFilterLiveDemo />, file: "data-filter-live" },
}

interface ComponentPreviewProps {
  name: string
  className?: string
}

export function ComponentPreview({ name, className }: ComponentPreviewProps) {
  const preview = previewComponents[name]
  if (!preview) return null

  const code = getExampleSource(preview.file ?? name)

  return (
    <ComponentPreviewShell code={code} className={className}>
      {preview.element}
    </ComponentPreviewShell>
  )
}
