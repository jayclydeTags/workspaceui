"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  STOCK_LEVELS,
  matchesQuery,
  needsReorder,
  type StockLevel,
} from "./data"
import { DataTable } from "./components/data-table"
import { AdjustDialog } from "./components/adjust-dialog"

// ponytail: stock rows are read-only here — they come into existence from a
// product × warehouse pairing, so there's no create/delete, only adjust.

export function StockLevels() {
  const [levels, setLevels] = React.useState<StockLevel[]>(STOCK_LEVELS)
  const [query, setQuery] = React.useState("")
  const [adjusting, setAdjusting] = React.useState<StockLevel | null>(null)

  const visible = levels.filter((s) => matchesQuery(s, query))
  const reorderCount = levels.filter(needsReorder).length

  function saveAdjustment(onHand: number, reorderPoint: number) {
    if (!adjusting) return
    setLevels((prev) =>
      prev.map((s) => (s.id === adjusting.id ? { ...s, onHand, reorderPoint } : s))
    )
    setAdjusting(null)
  }

  return (
    <Page
      title="Stock levels"
      subtitle={`${levels.length} stock records`}
      className="@container overflow-hidden"
      actions={
        reorderCount > 0 ? (
          <Badge variant="destructive">{reorderCount} need reorder</Badge>
        ) : null
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Input
            type="search"
            aria-label="Search stock"
            placeholder="Search by product, SKU, or warehouse…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No stock records</EmptyTitle>
              <EmptyDescription>
                Nothing matches “{query}”. Try a different search.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable levels={visible} onAdjust={setAdjusting} />
        )}
      </div>

      <AdjustDialog
        adjusting={adjusting}
        onOpenChange={(open) => !open && setAdjusting(null)}
        onSubmit={saveAdjustment}
      />
    </Page>
  )
}
