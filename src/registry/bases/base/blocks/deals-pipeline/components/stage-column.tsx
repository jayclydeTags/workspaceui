"use client"

import { BoardColumn } from "@/registry/bases/base/workspaceui/board-column"
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
  onEdit,
  onDelete,
}: {
  stage: DealStage
  deals: Deal[]
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  return (
    <BoardColumn
      columnId={stage}
      label={STAGE_LABEL[stage]}
      items={deals}
      getItemId={(deal) => deal.id}
      emptyLabel="Drop a deal here"
      headerExtra={
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {formatCurrency(stageValue(deals))}
        </span>
      }
      renderItem={(deal) => (
        <DealCard deal={deal} onEdit={onEdit} onDelete={onDelete} />
      )}
    />
  )
}
