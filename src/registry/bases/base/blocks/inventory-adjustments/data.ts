import {
  BINS,
  clearBin,
  type Bin,
} from "@/registry/bases/base/blocks/bin-location-map/data"

// Re-exported so this block's own modules import the bin type from one place.
export type { Bin }

// ── Types ──────────────────────────────────────────────────────────────────

export type AdjustmentStatus = "pending" | "posted" | "rejected"

/**
 * Why the recorded count was wrong. Damage and shrinkage are physically
 * loss-only — you cannot gain stock by breaking or losing it — so they
 * constrain the adjustment's direction, they aren't just a label.
 */
export type ReasonCode =
  "cycle-count" | "receipt-error" | "damage" | "shrinkage"

export interface AdjustmentRequest {
  id: string
  binId: string
  /**
   * What the counter physically saw — an absolute assertion, not a delta.
   * The delta is derived against the bin's live `qty` at post time, because
   * the bin can move (a pick draws it down) between count and approval.
   */
  countedQty: number
  reason: ReasonCode
  /** Required free text. The reason code says what kind; this says what happened. */
  note: string
  requestedBy: string
  /** Set when an approver posts it. `null` while pending or rejected. */
  approvedBy: string | null
  rejected: boolean
}

export type AdjustmentDraft = Pick<
  AdjustmentRequest,
  "binId" | "countedQty" | "reason" | "note"
>

/** The record an inventory service would consume to move `stock-levels`' `onHand`. */
export interface AdjustmentPosting {
  sku: string
  warehouse: string
  delta: number
}

// ── Constants ──────────────────────────────────────────────────────────────

/** Above this variance an adjustment needs a second pair of eyes before it posts. */
export const VARIANCE_THRESHOLD_PCT = 10

export const REASON_CODES: ReasonCode[] = [
  "cycle-count",
  "receipt-error",
  "damage",
  "shrinkage",
]

/** Reasons that can only ever reduce a count. */
const DECREASE_ONLY: ReasonCode[] = ["damage", "shrinkage"]

// ── Bin lock contract ───────────────────────────────────────────────────────

/**
 * Bins currently held by a pick or a receipt. Modelled elsewhere (inbound and
 * outbound own these workflows); only the bin id crosses. A locked bin is
 * mid-count-change, so adjusting it would race the warehouse floor.
 *
 * Note this is orthogonal to `bin.status` — a `blocked`/`quarantine` bin is
 * perfectly adjustable, and arguably the one you most need to correct.
 */
export const BIN_LOCKS: Record<string, "picking" | "receiving"> = {
  "9": "picking",
  "18": "receiving",
}

export const binLock = (binId: string): "picking" | "receiving" | undefined =>
  BIN_LOCKS[binId]

export const isBinLocked = (binId: string): boolean => binId in BIN_LOCKS

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Counted minus recorded. Negative is a loss, positive a gain. */
export const delta = (req: AdjustmentRequest, bin: Bin): number =>
  req.countedQty - bin.qty

/**
 * Variance as a share of the recorded count.
 *
 * ponytail: an empty bin has no denominator. Rather than divide by zero we
 * treat any nonzero delta against an empty bin as infinite variance — stock
 * appearing in a bin the system believes is empty is exactly the case that
 * wants an approver, so this is the rule, not a fudge.
 */
export const variancePct = (req: AdjustmentRequest, bin: Bin): number => {
  const d = Math.abs(delta(req, bin))
  if (bin.qty === 0) return d === 0 ? 0 : Infinity
  return (d / bin.qty) * 100
}

export const needsApproval = (req: AdjustmentRequest, bin: Bin): boolean =>
  variancePct(req, bin) > VARIANCE_THRESHOLD_PCT

/** Whether a reason code permits the direction this delta implies. */
export const isDirectionLegal = (reason: ReasonCode, d: number): boolean =>
  !DECREASE_ONLY.includes(reason) || d <= 0

/**
 * A request whose direction was legal when counted but isn't any more — the
 * bin moved underneath it, so the count is stale and the right answer is to
 * re-count, not to post a nonsense increase against a `damage` code.
 */
export const isStale = (req: AdjustmentRequest, bin: Bin): boolean =>
  adjustmentStatus(req) === "pending" &&
  !isDirectionLegal(req.reason, delta(req, bin))

/**
 * Status is derived, never stored — mirroring the sibling WMS blocks. There is
 * no separate `approved` state: approving posts it, in one step.
 */
export function adjustmentStatus(req: AdjustmentRequest): AdjustmentStatus {
  if (req.rejected) return "rejected"
  return req.approvedBy === null ? "pending" : "posted"
}

/**
 * The submit gate. A count is an absolute number, so a below-zero bin isn't
 * expressible — `countedQty >= 0` is the whole of the "can't go negative" rule.
 */
export function canRequest(draft: AdjustmentDraft, bin: Bin): boolean {
  if (draft.countedQty < 0) return false
  if (draft.note.trim() === "") return false
  if (isBinLocked(draft.binId)) return false
  return isDirectionLegal(draft.reason, draft.countedQty - bin.qty)
}

/**
 * The approval gate. Re-derives direction against the live bin, so a request
 * that went stale between count and approval can't be posted.
 */
export function canApprove(req: AdjustmentRequest, bin: Bin): boolean {
  if (adjustmentStatus(req) !== "pending") return false
  if (isBinLocked(req.binId)) return false
  return isDirectionLegal(req.reason, delta(req, bin))
}

/** Applies the counted quantity to the bin, freeing it when the count is zero. */
export function postAdjustment(req: AdjustmentRequest, bin: Bin): Bin {
  return req.countedQty <= 0 ? clearBin(bin) : { ...bin, qty: req.countedQty }
}

/** The stock-levels-facing record. Only meaningful once the request posts. */
export const adjustmentPosting = (
  req: AdjustmentRequest,
  bin: Bin
): AdjustmentPosting => ({
  // A bin holding nothing still has a SKU in flight when stock is *found* in it;
  // an empty bin's SKU is null, so the posting names the counted SKU or nothing.
  sku: bin.sku ?? "",
  warehouse: bin.warehouse,
  delta: delta(req, bin),
})

// ── Mock data ──────────────────────────────────────────────────────────────

/** Fresh copy of the bin fixtures so posting can mutate occupancy locally. */
export const seedBins = (): Bin[] => BINS.map((b) => ({ ...b }))

// Bin ids line up with bin-location-map's BINS so adjustments hit real bins.
export const ADJUSTMENT_REQUESTS: AdjustmentRequest[] = [
  // Bin 1 (CEN-A1) holds 180 — a 40-unit loss is 22%, over threshold.
  {
    id: "1",
    binId: "1",
    countedQty: 140,
    reason: "damage",
    note: "Pallet corner crushed by forklift; 40 units unsellable.",
    requestedBy: "Mara Ilagan",
    approvedBy: null,
    rejected: false,
  },
  // Bin 2 (CEN-A2) holds 40 — a 2-unit variance is 5%, posts without approval.
  {
    id: "2",
    binId: "2",
    countedQty: 38,
    reason: "cycle-count",
    note: "Quarterly count; two units unaccounted for.",
    requestedBy: "Rey Santos",
    approvedBy: "Dana Cruz",
    rejected: false,
  },
  // Bin 3 (CEN-A3) is empty — any nonzero count is infinite variance.
  {
    id: "3",
    binId: "3",
    countedQty: 25,
    reason: "receipt-error",
    note: "Stock found in a bin the system shows as empty; likely mis-keyed put-away.",
    requestedBy: "Mara Ilagan",
    approvedBy: null,
    rejected: false,
  },
  // Bin 9 (NW-A1) is locked mid-pick — can't be approved until the pick clears.
  {
    id: "4",
    binId: "9",
    countedQty: 100,
    reason: "shrinkage",
    note: "Count short against the recorded 120 during the aisle sweep.",
    requestedBy: "Dana Cruz",
    approvedBy: null,
    rejected: false,
  },
  {
    id: "5",
    binId: "16",
    countedQty: 95,
    reason: "cycle-count",
    note: "Recount matched the system; original variance was a scan error.",
    requestedBy: "Rey Santos",
    approvedBy: null,
    rejected: true,
  },
]
