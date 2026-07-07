"use client"

import { Page } from "@/registry/bases/base/workspaceui/page"
import { PAYMENTS } from "./data"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

// ponytail: kept the "01" suffix here (unlike its sibling blocks) because the
// bare name collides with the DataTable import below, in this same file.
export function DataTable01() {
  return (
    <Page
      title="Payments"
      subtitle={`${PAYMENTS.length} payments`}
      className="@container overflow-hidden"
      hasPadding
    >
      <DataTable
        columns={columns}
        data={PAYMENTS}
        filterColumn="email"
        filterPlaceholder="Filter emails…"
      />
    </Page>
  )
}
