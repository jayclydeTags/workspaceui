import { Page } from "@/components/workspaceui/page"

export function PageWithBreadcrumbsDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page breadcrumbs={[{ label: "Settings", href: "#" }, { label: "Billing" }]}>
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </div>
  )
}
