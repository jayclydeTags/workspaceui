"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CircleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface OnboardingStep {
  id: string
  title: string
  description?: React.ReactNode
  /** Owned by your app — derive it from real state, not from clicks here. */
  completed?: boolean
  /** Call to action shown while the step is expanded, e.g. a button or link. */
  action?: React.ReactNode
}

export interface OnboardingChecklistProps extends Omit<
  React.ComponentProps<typeof Card>,
  "title" | "children"
> {
  steps: OnboardingStep[]
  title?: React.ReactNode
  description?: React.ReactNode
  /** Renders a dismiss button in the header when provided. */
  onDismiss?: () => void
  /** Shown in place of the step list once every step is complete. */
  completeMessage?: React.ReactNode
}

export function OnboardingChecklist({
  steps,
  title = "Get started",
  description,
  onDismiss,
  completeMessage = "You're all set. Nice work!",
  className,
  ...props
}: OnboardingChecklistProps) {
  const done = steps.filter((step) => step.completed).length
  const allDone = steps.length > 0 && done === steps.length
  const firstOpen = steps.find((step) => !step.completed)?.id ?? null
  // `undefined` = follow the next incomplete step; `null` = user collapsed all.
  const [openId, setOpenId] = React.useState<string | null | undefined>(
    undefined
  )
  const expanded = openId === undefined ? firstOpen : openId

  const titleId = React.useId()
  const baseId = React.useId()

  return (
    <Card
      role="region"
      aria-labelledby={titleId}
      data-slot="onboarding-checklist"
      className={cn("gap-3", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle id={titleId}>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {onDismiss && (
          <CardAction>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Dismiss checklist"
              onClick={onDismiss}
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Progress
          value={steps.length ? (done / steps.length) * 100 : 0}
          getAriaValueText={() => `${done} of ${steps.length} steps complete`}
          aria-label="Onboarding progress"
          className="gap-1.5"
        >
          <span className="text-xs text-muted-foreground tabular-nums">
            {done} of {steps.length} complete
          </span>
        </Progress>

        {allDone ? (
          <p className="flex items-center gap-2 text-sm">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              strokeWidth={2}
              className="size-4 text-success"
              aria-hidden="true"
            />
            {completeMessage}
          </p>
        ) : (
          <ol className="-mx-2 flex list-none flex-col p-0">
            {steps.map((step) => {
              const isOpen = expanded === step.id
              const panelId = `${baseId}-${step.id}`
              const hasBody = Boolean(step.description || step.action)
              return (
                <li key={step.id} data-completed={step.completed || undefined}>
                  <button
                    type="button"
                    aria-expanded={hasBody ? isOpen : undefined}
                    aria-controls={hasBody ? panelId : undefined}
                    onClick={() =>
                      hasBody && setOpenId(isOpen ? null : step.id)
                    }
                    className="flex min-h-9 w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-start text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <HugeiconsIcon
                      icon={step.completed ? CheckmarkCircle02Icon : CircleIcon}
                      strokeWidth={2}
                      className={cn(
                        "size-4 shrink-0",
                        step.completed
                          ? "text-success"
                          : "text-muted-foreground"
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "flex-1",
                        step.completed &&
                          "text-muted-foreground line-through decoration-muted-foreground/50"
                      )}
                    >
                      {step.title}
                      <span className="sr-only">
                        {step.completed ? " (complete)" : " (to do)"}
                      </span>
                    </span>
                    {hasBody && (
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        strokeWidth={2}
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  {hasBody && (
                    <div
                      id={panelId}
                      hidden={!isOpen}
                      className="flex flex-col items-start gap-2 ps-8.5 pe-2 pt-0.5 pb-3 text-sm text-muted-foreground"
                    >
                      {step.description && <div>{step.description}</div>}
                      {step.action}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
