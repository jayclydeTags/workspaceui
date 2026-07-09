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
  adjustmentStatus,
  binLock,
  delta,
  isStale,
  needsApproval,
  variancePct,
  type AdjustmentRequest,
  type AdjustmentStatus,
  type Bin,
} from "../data"

const STATUS_VARIANT: Record<
  AdjustmentStatus,
  "default" | "secondary" | "outline"
> = {
  posted: "default",
  pending: "outline",
  rejected: "secondary",
}

/** Signed delta, so a loss reads as `-40` rather than `40`. */
const signed = (n: number): string => (n > 0 ? `+${n}` : String(n))

const formatPct = (pct: number): string =>
  pct === Infinity ? "—" : `${pct.toFixed(0)}%`

export function DataTable({
  requests,
  bins,
  onOpen,
}: {
  requests: AdjustmentRequest[]
  bins: Bin[]
  onOpen: (req: AdjustmentRequest) => void
}) {
  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="px-6">Bin</TableHead>
            <TableHead className="hidden @md:table-cell">Reason</TableHead>
            <TableHead className="text-right">Recorded</TableHead>
            <TableHead className="text-right">Counted</TableHead>
            <TableHead className="text-right">Variance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0 pr-6" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => {
            const bin = bins.find((b) => b.id === req.binId)
            if (!bin) return null

            const status = adjustmentStatus(req)
            const stale = isStale(req, bin)
            const lock = binLock(req.binId)

            return (
              <TableRow key={req.id}>
                <TableCell className="px-6 font-medium">{bin.code}</TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {req.reason}
                </TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">
                  {bin.qty}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {req.countedQty}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {signed(delta(req, bin))}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {formatPct(variancePct(req, bin))}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1">
                    <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
                    {stale && <Badge variant="destructive">stale</Badge>}
                    {status === "pending" && lock && (
                      <Badge variant="outline">{lock}</Badge>
                    )}
                    {status === "pending" && needsApproval(req, bin) && (
                      <Badge variant="outline">needs approval</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen(req)}
                    aria-label={`Open adjustment for ${bin.code}`}
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
