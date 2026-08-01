import * as React from "react"

import { Badge } from "@/components/ui/badge"

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"]

export interface StatusBadgeProps<TStatus extends string> extends Omit<
  React.ComponentProps<typeof Badge>,
  "variant" | "children"
> {
  status: TStatus
  variantMap: Record<TStatus, BadgeVariant>
  labelMap?: Record<TStatus, string>
}

// ponytail: this is every `<Status>_VARIANT` map + `<Badge variant={...}>` pair in the
// registry's blocks, lifted once. variantMap/labelMap stay per-call since the status
// union and its variant/label choices are domain-specific to each block.
export function StatusBadge<TStatus extends string>({
  status,
  variantMap,
  labelMap,
  ...props
}: StatusBadgeProps<TStatus>) {
  return (
    <Badge variant={variantMap[status]} {...props}>
      {labelMap?.[status] ?? status}
    </Badge>
  )
}
