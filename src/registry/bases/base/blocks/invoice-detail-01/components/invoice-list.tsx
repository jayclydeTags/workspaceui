"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  INVOICES,
  STATUS_LABEL,
  formatCurrency,
  invoiceTotal,
  type Invoice,
  type InvoiceStatus,
} from "@/registry/bases/base/blocks/invoice-detail-01/data"

const STATUS_VARIANT: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "secondary",
  pending: "outline",
  overdue: "destructive",
  draft: "outline",
}

export interface InvoiceListProps {
  activeInvoiceId: string | null
  onSelect: (invoice: Invoice) => void
}

export function InvoiceList({ activeInvoiceId, onSelect }: InvoiceListProps) {
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return INVOICES
    return INVOICES.filter(
      (inv) => inv.customer.toLowerCase().includes(q) || inv.number.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border p-3">
        <InputGroup className="h-8 text-sm">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search invoices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {filtered.map((inv) => {
          const isActive = inv.id === activeInvoiceId
          return (
            <li key={inv.id}>
              <button
                type="button"
                onClick={() => onSelect(inv)}
                className={cn(
                  "flex w-full flex-col gap-1 border-b border-border px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50",
                  isActive && "bg-muted"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{inv.customer}</span>
                  <Badge variant={STATUS_VARIANT[inv.status]}>{STATUS_LABEL[inv.status]}</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{inv.number}</span>
                  <span>{formatCurrency(invoiceTotal(inv))}</span>
                </div>
              </button>
            </li>
          )
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">No invoices found.</li>
        )}
      </ul>
    </div>
  )
}
