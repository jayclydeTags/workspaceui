import { Page } from "@/components/workspaceui/page"

export function PageWithSubtitleDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page title="Billing" subtitle="Manage your subscription and invoices">
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </div>
  )
}
