"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  STAGE_LABEL,
  formatCurrency,
  stageValue,
  type Deal,
  type DealStage,
} from "../data"
import { DealCard } from "./deal-card"

export function StageColumn({
  stage,
  deals,
  onDropDeal,
  onEdit,
  onDelete,
}: {
  stage: DealStage
  deals: Deal[]
  onDropDeal: (id: string, stage: DealStage) => void
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  const [isDragOver, setIsDragOver] = React.useState(false)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        onDropDeal(e.dataTransfer.getData("text/plain"), stage)
      }}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-transparent bg-muted/30 p-3",
        isDragOver && "border-primary/50 bg-muted/60"
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-medium">{STAGE_LABEL[stage]}</span>
        <Badge variant="secondary">{deals.length}</Badge>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          {formatCurrency(stageValue(deals))}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {deals.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Drop a deal here
          </div>
        )}
      </div>
    </div>
  )
}
