"use client"

import * as React from "react"
import { FileText } from "lucide-react"

import { Workspace, type WorkspaceHandle } from "@/registry/bases/base/workspaceui/workspace"
import { INVOICES, type Invoice } from "@/registry/bases/base/blocks/invoice-detail/data"
import { InvoiceList } from "@/registry/bases/base/blocks/invoice-detail/components/invoice-list"
import { InvoiceView } from "@/registry/bases/base/blocks/invoice-detail/components/invoice-view"

const INITIAL_PANES = [
  {
    id: "list",
    defaultSize: 30,
    minSize: 24,
    tabs: [{ id: "list", title: "Invoices", pinned: true }],
  },
]

export function InvoiceDetail({ className }: { className?: string }) {
  const workspaceRef = React.useRef<WorkspaceHandle>(null)
  const [activeInvoiceId, setActiveInvoiceId] = React.useState<string | null>(null)

  function openInvoice(invoice: Invoice) {
    setActiveInvoiceId(invoice.id)
    workspaceRef.current?.openTabInPane("detail", {
      id: invoice.id,
      title: invoice.number,
      icon: <FileText className="size-3.5" />,
    })
  }

  return (
    <Workspace
      ref={workspaceRef}
      className={className}
      initialPanes={INITIAL_PANES}
      renderTabContent={(paneId, activeTabId) => {
        if (paneId === "list") {
          return <InvoiceList activeInvoiceId={activeInvoiceId} onSelect={openInvoice} />
        }
        const invoice = INVOICES.find((inv) => inv.id === activeTabId)
        return invoice ? <InvoiceView invoice={invoice} /> : null
      }}
    />
  )
}
