"use client"

import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, type Deal } from "../data"

export function DealCard({
  deal,
  onEdit,
  onDelete,
}: {
  deal: Deal
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", deal.id)
        e.dataTransfer.effectAllowed = "move"
      }}
      className="flex cursor-grab flex-col gap-2 rounded-lg border border-border bg-card p-3 text-sm shadow-xs active:cursor-grabbing"
    >
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
                <MoreHorizontalIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(deal)}>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(deal)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <Badge variant="outline">{deal.account}</Badge>
        <span className="tabular-nums">{formatCurrency(deal.value)}</span>
      </div>

      <span className="text-xs tabular-nums text-muted-foreground">
        {deal.owner} · closes {deal.closeDate}
      </span>
    </div>
  )
}
