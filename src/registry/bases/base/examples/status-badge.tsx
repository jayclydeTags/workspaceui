import { StatusBadge } from "@/registry/bases/base/workspaceui/status-badge"

type InvoiceStatus = "paid" | "pending" | "overdue"

const variantMap: Record<
  InvoiceStatus,
  "default" | "secondary" | "destructive"
> = {
  paid: "default",
  pending: "secondary",
  overdue: "destructive",
}

const labelMap: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
}

export function StatusBadgeDemo() {
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status="paid" variantMap={variantMap} labelMap={labelMap} />
      <StatusBadge
        status="pending"
        variantMap={variantMap}
        labelMap={labelMap}
      />
      <StatusBadge
        status="overdue"
        variantMap={variantMap}
        labelMap={labelMap}
      />
    </div>
  )
}
