import { Page } from "@/components/workspaceui/page"

export function PageDefaultDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page title="Settings" subtitle="Manage your account">
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </div>
  )
}
