"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BoardCard } from "@/registry/bases/base/workspaceui/board-card"
import { formatCurrency, type Deal } from "../data"

export function DealCard({
  deal,
  onEdit,
  onDelete,
  overlay,
}: {
  deal: Deal
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
  overlay?: boolean
}) {
  return (
    <BoardCard itemId={deal.id} overlay={overlay}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{deal.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="-mt-1 -mr-1 shrink-0"
                aria-label={`Actions for ${deal.name}`}
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(deal)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(deal)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <Badge variant="outline">{deal.account}</Badge>
        <span className="tabular-nums">{formatCurrency(deal.value)}</span>
      </div>

      <span className="text-xs text-muted-foreground tabular-nums">
        {deal.owner} · closes {deal.closeDate}
      </span>
    </BoardCard>
  )
}
