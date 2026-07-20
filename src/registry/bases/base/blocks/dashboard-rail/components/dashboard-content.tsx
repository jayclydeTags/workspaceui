import * as React from "react"

export function DashboardContent() {
  const stats = [
    { label: "Revenue", value: "$12,450" },
    { label: "Users", value: "1,234" },
    { label: "Orders", value: "567" },
    { label: "Active", value: "89" },
  ]
  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
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
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <Icon className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  )
}
