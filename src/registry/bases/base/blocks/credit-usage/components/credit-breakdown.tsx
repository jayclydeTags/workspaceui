"use client"

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
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  PERIODS,
  formatCompact,
  formatDecimal,
  formatNumber,
  formatShare,
  type Period,
  type PeriodSummary,
  type Plan,
} from "@/registry/bases/base/blocks/credit-usage/data"

interface CreditBreakdownProps {
  plan: Plan
  period: Period
  summary: PeriodSummary
  onManagePlan?: () => void
}

export function CreditBreakdown({
  plan,
  period,
  summary,
  onManagePlan,
}: CreditBreakdownProps) {
  const phrase = PERIODS.find((p) => p.value === period)?.phrase ?? ""
  // Only the month maps onto the plan allowance; shorter periods show the split
  // of what was used, with the monthly share alongside.
  const isBillingPeriod = period === "month"
  const remaining = Math.max(plan.limit - summary.used, 0)

  const stats = [
    { label: "Hours saved", value: formatNumber(summary.hoursSaved) },
    { label: "Agents used", value: formatNumber(summary.agentsUsed) },
    { label: "Agent runs", value: formatNumber(summary.runs) },
    {
      label: "Credits per run",
      value: formatDecimal(summary.runs ? summary.used / summary.runs : 0),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>
          <span className="tabular-nums">
            {isBillingPeriod
              ? `${formatNumber(summary.used)} of ${formatNumber(plan.limit)} credits used ${phrase}`
              : `${formatNumber(summary.used)} credits used ${phrase}`}
          </span>
        </CardDescription>
        <CardAction>
          <Button variant="outline" onClick={onManagePlan}>
            Manage plan
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div
          role="group"
          aria-label={`Credits used ${phrase}, by category`}
          className="flex h-2 w-full gap-1"
        >
          {summary.byCategory.map(({ category, credits }) =>
            credits > 0 ? (
              <Tooltip key={category.id}>
                <TooltipTrigger
                  render={
                    <span
                      tabIndex={0}
                      role="img"
                      aria-label={`${category.label}: ${formatNumber(credits)} credits, ${formatShare(credits, summary.used)} of used`}
                      style={{ "--share": credits } as React.CSSProperties}
                      className={cn(
                        "min-w-1 grow-(--share) basis-0 rounded-full transition-opacity outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
                        category.swatch
                      )}
                    />
                  }
                />
                <TooltipContent className="flex-col items-start gap-0.5">
                  <span className="font-medium">{category.label}</span>
                  <span className="tabular-nums opacity-80">
                    {formatNumber(credits)} credits ·{" "}
                    {formatShare(credits, summary.used)} of used
                  </span>
                </TooltipContent>
              </Tooltip>
            ) : null
          )}
          {isBillingPeriod && remaining > 0 && (
            <span
              aria-hidden="true"
              style={{ "--share": remaining } as React.CSSProperties}
              className="grow-(--share) basis-0 rounded-full bg-muted"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {summary.byCategory.map(({ category, credits }) => (
              <li key={category.id} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn("size-2 rounded-full", category.swatch)}
                />
                <span className="text-muted-foreground">{category.label}</span>
                <span className="font-medium tabular-nums">
                  {formatCompact(credits)}
                </span>
              </li>
            ))}
          </ul>
          <span className="ms-auto text-muted-foreground tabular-nums">
            {isBillingPeriod
              ? `Resets on ${plan.resetsOn}`
              : `${formatShare(summary.used, plan.limit)} of monthly allowance`}
          </span>
        </div>

        <Separator />

        <dl className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
          {stats.map((stat) => (
            // Divider before every column but the first in each row: odd items
            // start a row at 2 columns, only the first does at 4.
            <div
              key={stat.label}
              className="flex flex-col-reverse gap-1 border-s ps-4 odd:border-s-0 odd:ps-0 md:nth-3:border-s md:nth-3:ps-4"
            >
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="text-2xl font-medium tracking-tight tabular-nums sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
