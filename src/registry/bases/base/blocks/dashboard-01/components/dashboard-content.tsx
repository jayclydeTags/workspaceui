import * as React from "react"

export function EmptyContent() {
  return (
    <div className="h-full p-6">
      <div className="h-full rounded-lg border border-dashed border-border bg-muted/50" />
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
