"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  MOVEMENTS,
  MOVEMENT_TYPES,
  formatQuantity,
  netChange,
  type Movement,
  type MovementDraft,
  type MovementType,
} from "./data"
import { DataTable } from "./components/data-table"
import { MovementDialog } from "./components/movement-dialog"

// ponytail: the ledger is append-only — a posted movement is corrected by
// recording an offsetting one, so there's no edit or delete.

export function StockMovements() {
  const [movements, setMovements] = React.useState<Movement[]>(MOVEMENTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [typeFilter, setTypeFilter] = React.useState<MovementType | "all">("all")

  const visible =
    typeFilter === "all"
      ? movements
      : movements.filter((m) => m.type === typeFilter)

  function record(draft: MovementDraft) {
    setMovements((prev) => [{ ...draft, id: crypto.randomUUID() }, ...prev])
  }

  return (
    <Page
      title="Stock movements"
      subtitle={`${movements.length} movements · net ${formatQuantity(netChange(movements))}`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          Record movement
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter((v as MovementType | "all") ?? "all")}
          >
            <SelectTrigger aria-label="Filter by type" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {MOVEMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No movements</EmptyTitle>
              <EmptyDescription>
                No {typeFilter === "all" ? "" : `${typeFilter} `}movements have
                been recorded.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable movements={visible} />
        )}
      </div>

      <MovementDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={record}
      />
    </Page>
  )
}
