import { BoardCard } from "@/registry/bases/base/workspaceui/board-card"

export function BoardCardDemo() {
  return (
    <BoardCard itemId="task-1" className="w-64">
      <span className="font-medium">Design the empty state</span>
      <span className="text-xs text-muted-foreground">Due Friday</span>
    </BoardCard>
  )
}
