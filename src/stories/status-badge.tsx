"use client"

import { defineStory } from "@/components/studio/studio"
import { StatusBadge } from "@/registry/bases/base/workspaceui/status-badge"

type Status = "paid" | "pending" | "overdue"
type Variant = "default" | "secondary" | "destructive" | "outline"

interface Args {
  status: Status
  variant: Variant
  relabel: boolean
}

const VARIANTS: Variant[] = ["default", "secondary", "destructive", "outline"]
const LABELS: Record<Status, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Past due",
}
// What a consumer would typically map each status to; the `variant` control
// overrides the current status's entry so each Badge variant can be compared.
const BASE_MAP: Record<Status, Variant> = {
  paid: "default",
  pending: "secondary",
  overdue: "destructive",
}

function variantMapFor({ status, variant }: Args): Record<Status, Variant> {
  return { ...BASE_MAP, [status]: variant }
}

function Preview(args: Args) {
  return (
    <StatusBadge
      status={args.status}
      variantMap={variantMapFor(args)}
      labelMap={args.relabel ? LABELS : undefined}
    />
  )
}

export default defineStory<Args>({
  args: { status: "paid", variant: "default", relabel: false },
  controls: {
    status: { type: "select", options: ["paid", "pending", "overdue"] },
    variant: {
      group: "style",
      type: "select",
      options: VARIANTS,
      description: "The Badge variant the current status maps to.",
    },
    relabel: {
      type: "boolean",
      label: "Use labelMap",
      description: "Show display text instead of the raw status value.",
    },
  },
  preview: Preview,
})
