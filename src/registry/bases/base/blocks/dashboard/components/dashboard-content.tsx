import * as React from "react"

import { Page } from "@/registry/bases/base/workspaceui/page"

export function DashboardContent() {
  const stats = [
    { label: "Revenue", value: "$12,450" },
    { label: "Users", value: "1,234" },
    { label: "Orders", value: "567" },
    { label: "Active", value: "89" },
  ]
  return (
    <Page title="Dashboard" subtitle="Overview of your workspace" hasPadding>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </Page>
  )
}

export function PlaceholderContent({
  Icon,
  title,
}: {
  Icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <Page title={title}>
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Icon className="size-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </Page>
  )
}
