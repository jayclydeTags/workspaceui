import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  isLineClosed,
  pickStatus,
  type PickList,
  type PickStatus,
} from "../data"

const STATUS_VARIANT: Record<PickStatus, "default" | "secondary" | "outline"> = {
  completed: "default",
  picked: "secondary",
  picking: "outline",
  pending: "outline",
}

/** Lines closed (full or short) over total lines — the pick's progress. */
function progress(list: PickList) {
  const closed = list.lines.filter(isLineClosed).length
  return `${closed} / ${list.lines.length}`
}

export function DataTable({
  lists,
  onOpen,
}: {
  lists: PickList[]
  onOpen: (list: PickList) => void
}) {
  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="px-6">Order</TableHead>
            <TableHead className="hidden @md:table-cell">Warehouse</TableHead>
            <TableHead>Picker</TableHead>
            <TableHead className="text-right">Lines picked</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0 pr-6" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.map((list) => {
            const status = pickStatus(list)
            return (
              <TableRow key={list.id}>
                <TableCell className="px-6 font-medium">{list.orderId}</TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {list.warehouse}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {list.picker ?? "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {progress(list)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen(list)}
                    aria-label={`Open pick list ${list.orderId}`}
                  >
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
