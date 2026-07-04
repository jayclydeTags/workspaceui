"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { emptyDetails, emptyLineItem, type LineItem, type PODetails } from "@/registry/bases/base/blocks/purchase-order-form-01/data"
import { StepIndicator } from "@/registry/bases/base/blocks/purchase-order-form-01/components/step-indicator"
import { DetailsStep, LineItemsStep, ReviewStep } from "@/registry/bases/base/blocks/purchase-order-form-01/components/wizard-steps"

const LAST_STEP = 2

function isDetailsValid(details: PODetails): boolean {
  return Boolean(details.vendor && details.requestedBy && details.neededBy)
}

function isLineItemsValid(items: LineItem[]): boolean {
  return items.length > 0 && items.every((li) => li.item.trim() !== "" && li.quantity > 0)
}

export function PurchaseOrderForm01({ className }: { className?: string }) {
  const [step, setStep] = React.useState(0)
  const [details, setDetails] = React.useState<PODetails>(emptyDetails)
  const [items, setItems] = React.useState<LineItem[]>(() => [emptyLineItem()])
  const [submitted, setSubmitted] = React.useState(false)

  const canAdvance = step === 0 ? isDetailsValid(details) : step === 1 ? isLineItemsValid(items) : true

  function reset() {
    setStep(0)
    setDetails(emptyDetails())
    setItems([emptyLineItem()])
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <Page title="New Purchase Order" className={cn("@container overflow-hidden", className)} hasPadding>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CheckCircle2 className="text-primary" />
            </EmptyMedia>
            <EmptyTitle>Purchase order submitted</EmptyTitle>
            <EmptyDescription>
              Sent to {details.vendor} for approval. {items.length} line item{items.length === 1 ? "" : "s"}.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={reset}>Create another</Button>
        </Empty>
      </Page>
    )
  }

  return (
    <Page
      title="New Purchase Order"
      actions={<StepIndicator currentStep={step} />}
      className={cn("@container overflow-hidden", className)}
      hasPadding
    >
      <div className="flex h-full flex-col gap-6">
        <div className="flex-1">
          {step === 0 && <DetailsStep details={details} onChange={(patch) => setDetails((d) => ({ ...d, ...patch }))} />}
          {step === 1 && <LineItemsStep items={items} onChange={setItems} />}
          {step === 2 && <ReviewStep details={details} items={items} />}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-border pt-4">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            Back
          </Button>
          {step < LAST_STEP ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance}>
              Next
            </Button>
          ) : (
            <Button onClick={() => setSubmitted(true)}>Submit purchase order</Button>
          )}
        </div>
      </div>
    </Page>
  )
}
