import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  REASON_CODES,
  VARIANCE_THRESHOLD_PCT,
  canRequest,
  isBinLocked,
  isDirectionLegal,
  type AdjustmentDraft,
  type Bin,
  type ReasonCode,
} from "../data"

/** Bins a new count can be raised against — everything but the locked ones. */
const adjustableBins = (bins: Bin[]): Bin[] =>
  bins.filter((b) => !isBinLocked(b.id))

export function RequestDialog({
  bins,
  open,
  onOpenChange,
  onSubmit,
}: {
  bins: Bin[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (draft: AdjustmentDraft) => void
}) {
  const options = adjustableBins(bins)
  const [binId, setBinId] = React.useState("")
  const [countedQty, setCountedQty] = React.useState("")
  const [reason, setReason] = React.useState<ReasonCode>("cycle-count")
  const [note, setNote] = React.useState("")

  // Reset the form each time the dialog opens. Adjusted during render (not an
  // effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const [wasOpen, setWasOpen] = React.useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setBinId("")
      setCountedQty("")
      setReason("cycle-count")
      setNote("")
    }
  }

  const bin = options.find((b) => b.id === binId)
  const counted = Number(countedQty)
  const draft: AdjustmentDraft = { binId, countedQty: counted, reason, note }

  const countEntered = countedQty.trim() !== "" && Number.isFinite(counted)
  const valid = bin != null && countEntered && canRequest(draft, bin)

  // The one rejection worth explaining inline: the reason forbids the direction.
  const directionBroken =
    bin != null &&
    countEntered &&
    counted >= 0 &&
    !isDirectionLegal(reason, counted - bin.qty)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onSubmit(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New adjustment</DialogTitle>
          <DialogDescription>
            Enter the quantity you physically counted. Variance over{" "}
            {VARIANCE_THRESHOLD_PCT}% needs approval before it posts.
          </DialogDescription>
        </DialogHeader>

        <form id="adjustment-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="adjustment-bin">Bin</FieldLabel>
              <Select value={binId} onValueChange={(v) => setBinId(v ?? "")}>
                <SelectTrigger id="adjustment-bin" aria-label="Bin">
                  <SelectValue placeholder="Select bin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {options.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.code} — recorded {b.qty}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Bins held by a pick or receipt can&apos;t be adjusted.
              </FieldDescription>
            </Field>

            <Field data-invalid={directionBroken || undefined}>
              <FieldLabel htmlFor="adjustment-counted">Counted qty</FieldLabel>
              <Input
                id="adjustment-counted"
                type="number"
                min="0"
                step="1"
                value={countedQty}
                onChange={(e) => setCountedQty(e.target.value)}
                aria-invalid={directionBroken || undefined}
                required
              />
              {directionBroken && (
                <FieldDescription>
                  A {reason} adjustment can only reduce a count — {bin?.code}{" "}
                  has {bin?.qty} recorded.
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="adjustment-reason">Reason</FieldLabel>
              <Select
                value={reason}
                onValueChange={(v) => v && setReason(v as ReasonCode)}
              >
                <SelectTrigger id="adjustment-reason" aria-label="Reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {REASON_CODES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="adjustment-note">Note</FieldLabel>
              <Textarea
                id="adjustment-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What happened?"
                required
              />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="adjustment-form" disabled={!valid}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
