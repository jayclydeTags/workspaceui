"use client"

import { Page } from "@/registry/bases/base/workspaceui/page"
import { PAYMENTS } from "./data"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export function DataTable01() {
  return (
    <Page
      title="Payments"
      subtitle={`${PAYMENTS.length} payments`}
      className="@container overflow-hidden"
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
