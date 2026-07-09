import type { ReactNode } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  VARIANCE_THRESHOLD_PCT,
  adjustmentStatus,
  binLock,
  canApprove,
  delta,
  isStale,
  needsApproval,
  variancePct,
  type AdjustmentRequest,
  type Bin,
} from "../data"

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm tabular-nums">{value}</span>
    </div>
  )
}

export function ApprovalSheet({
  request,
  bin,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: {
  request: AdjustmentRequest | null
  /** The live bin the request targets, or `null` when the sheet is closed. */
  bin: Bin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: () => void
  onReject: () => void
}) {
  const status = request && bin ? adjustmentStatus(request) : null
  const stale = request && bin ? isStale(request, bin) : false
  const lock = request ? binLock(request.binId) : undefined
  const approvable = request && bin ? canApprove(request, bin) : false
  const pct = request && bin ? variancePct(request, bin) : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{bin ? bin.code : "Adjustment"}</SheetTitle>
          <SheetDescription>
            {request && bin
              ? `${bin.warehouse} · ${request.reason} · requested by ${request.requestedBy}`
              : ""}
          </SheetDescription>
        </SheetHeader>

        {request && bin && (
          <div className="flex flex-1 flex-col gap-4 overflow-auto px-4">
            <div className="flex flex-wrap items-center gap-1">
              <Badge
                variant={
                  status === "posted"
                    ? "default"
                    : status === "rejected"
                      ? "secondary"
                      : "outline"
                }
              >
                {status}
              </Badge>
              {stale && <Badge variant="destructive">stale</Badge>}
              {status === "pending" && lock && (
                <Badge variant="outline">{lock}</Badge>
              )}
            </div>

            {stale && (
              <Alert>
                <AlertTitle>Count is stale</AlertTitle>
                <AlertDescription>
                  {bin.code} has moved to {bin.qty} since it was counted, so
                  posting {request.countedQty} would be an increase — a{" "}
                  {request.reason} adjustment can only reduce a count. Reject it
                  and re-count.
                </AlertDescription>
              </Alert>
            )}

            {!stale && status === "pending" && lock && (
              <Alert>
                <AlertTitle>Bin locked</AlertTitle>
                <AlertDescription>
                  {bin.code} is mid-{lock} — it can&apos;t be adjusted until
                  that clears.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col">
              <Row label="Recorded" value={bin.qty} />
              <Row label="Counted" value={request.countedQty} />
              <Separator />
              <Row
                label="Variance"
                value={
                  <>
                    {delta(request, bin) > 0 ? "+" : ""}
                    {delta(request, bin)}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {pct === Infinity
                        ? "bin was empty"
                        : `${pct.toFixed(0)}%`}
                    </span>
                  </>
                }
              />
              <Row
                label="Threshold"
                value={
                  <span className="text-xs text-muted-foreground">
                    {needsApproval(request, bin)
                      ? `over ${VARIANCE_THRESHOLD_PCT}% — needs approval`
                      : `under ${VARIANCE_THRESHOLD_PCT}% — posts on submit`}
                  </span>
                }
              />
              {request.approvedBy && (
                <Row label="Approved by" value={request.approvedBy} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Note</span>
              <p className="text-sm">{request.note}</p>
            </div>
          </div>
        )}

        {request && status === "pending" && (
          <SheetFooter className="flex-row justify-end">
            <Button variant="outline" onClick={onReject}>
              Reject
            </Button>
            <Button disabled={!approvable} onClick={onApprove}>
              Approve &amp; post
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
