"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  LOAN,
  PAID_THROUGH,
  buildSchedule,
  formatCurrency,
  nextUnpaid,
  remainingBalance,
  totalInterest,
  type Instalment,
} from "./data"
import { ScheduleTable } from "./components/schedule-table"

// ponytail: the schedule is derived from the loan terms on every render, not
// stored — only "how many instalments are settled" is state. Recording a
// payment moves that cursor forward; there's no edit or delete on a row.

export function RepaymentSchedule() {
  const [paidThrough, setPaidThrough] = React.useState(PAID_THROUGH)
  const [paying, setPaying] = React.useState<Instalment | null>(null)
  const [hidePaid, setHidePaid] = React.useState(false)

  const rows = buildSchedule(LOAN, paidThrough)
  const next = nextUnpaid(rows)
  const visible = hidePaid ? rows.filter((row) => !row.paid) : rows

  function confirmPay() {
    if (!paying) return
    setPaidThrough(paying.n)
    setPaying(null)
  }

  return (
    <Page
      title={`Repayment schedule · ${LOAN.reference}`}
      subtitle={`${formatCurrency(remainingBalance(rows))} outstanding · ${formatCurrency(totalInterest(rows))} total interest · ${paidThrough}/${LOAN.termMonths} paid`}
      className="@container overflow-hidden"
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => setHidePaid((prev) => !prev)}
        >
          {hidePaid ? "Show paid" : "Hide paid"}
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Loan settled</EmptyTitle>
              <EmptyDescription>
                Every instalment on {LOAN.reference} has been paid.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScheduleTable rows={visible} nextN={next?.n} onPay={setPaying} />
        )}
      </div>

      <AlertDialog
        open={paying !== null}
        onOpenChange={(open) => !open && setPaying(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record payment</AlertDialogTitle>
            <AlertDialogDescription>
              Record{" "}
              <span className="font-medium">
                {paying && formatCurrency(paying.payment)}
              </span>{" "}
              for instalment {paying?.n}, due {paying?.due}? Payments are settled in
              order and can&apos;t be reversed here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPay}>Record</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
