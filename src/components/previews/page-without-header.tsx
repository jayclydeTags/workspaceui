import { Page } from "@/components/workspaceui/page"

export function PageWithoutHeaderDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page hasHeader={false} hasPadding>
        <p className="text-sm text-muted-foreground">Full-bleed content, no header.</p>
      </Page>
    </div>
  )
}
