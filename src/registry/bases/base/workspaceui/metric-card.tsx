import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export interface MetricCardProps extends Omit<
  React.ComponentProps<typeof Card>,
  "children"
> {
  /** What the number measures, e.g. "Monthly recurring revenue". */
  label: React.ReactNode
  /** The headline figure, already formatted, e.g. "$48,210". */
  value: React.ReactNode
  /** Percent change against the comparison period, e.g. `12.5` or `-3.2`. */
  delta?: number
  /** Comparison period shown after the delta, e.g. "vs last month". */
  deltaLabel?: React.ReactNode
  /** Treat a decrease as good — for churn, latency, cost. */
  invertDelta?: boolean
  /** Series for an inline sparkline, oldest first. Needs at least two points. */
  trend?: number[]
  /** Leading icon beside the label. */
  icon?: React.ReactNode
  /** Render a skeleton in place of the figure and delta. */
  loading?: boolean
}

const percentFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})

const SPARK_W = 96
const SPARK_H = 32

// Maps the series into the SVG box, inset by a pixel so the stroke isn't clipped.
function sparklinePoints(values: number[]) {
  const min = Math.min(...values)
  const range = Math.max(...values) - min
  const step = SPARK_W / (values.length - 1)
  return values
    .map((v, i) => {
      const y =
        range === 0 ? SPARK_H / 2 : 1 + (1 - (v - min) / range) * (SPARK_H - 2)
      return `${(i * step).toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")
}

export function MetricCard({
  label,
  value,
  delta,
  deltaLabel,
  invertDelta = false,
  trend,
  icon,
  loading = false,
  className,
  ...props
}: MetricCardProps) {
  const direction =
    delta === undefined || delta === 0 ? "flat" : delta > 0 ? "up" : "down"
  const tone =
    direction === "flat"
      ? "neutral"
      : (direction === "up") !== invertDelta
        ? "positive"
        : "negative"

  return (
    <Card
      data-slot="metric-card"
      aria-busy={loading || undefined}
      className={cn("gap-3 px-(--card-spacing)", className)}
      {...props}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon && (
          <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
            {icon}
          </span>
        )}
        <span className="truncate">{label}</span>
      </div>

      {loading ? (
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
          {trend && <Skeleton className="h-8 w-24" />}
        </div>
      ) : (
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="flex flex-col gap-1">
            <span className="font-heading text-2xl font-semibold tracking-tight whitespace-nowrap tabular-nums">
              {value}
            </span>
            {delta !== undefined && (
              <span className="flex flex-wrap items-center gap-x-1.5 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-medium whitespace-nowrap tabular-nums",
                    tone === "positive" && "text-success",
                    tone === "negative" && "text-destructive",
                    tone === "neutral" && "text-muted-foreground"
                  )}
                >
                  <HugeiconsIcon
                    icon={
                      direction === "up"
                        ? ArrowUpRight01Icon
                        : direction === "down"
                          ? ArrowDownRight01Icon
                          : MinusSignIcon
                    }
                    strokeWidth={2}
                    className="size-3.5"
                    aria-hidden="true"
                  />
                  <span className="sr-only">
                    {direction === "up"
                      ? "Up "
                      : direction === "down"
                        ? "Down "
                        : "No change, "}
                  </span>
                  {percentFormat.format(delta)}%
                </span>
                {deltaLabel && (
                  <span className="text-muted-foreground">{deltaLabel}</span>
                )}
              </span>
            )}
          </div>
          {trend && trend.length >= 2 && (
            <svg
              viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
              width={SPARK_W}
              height={SPARK_H}
              preserveAspectRatio="none"
              aria-hidden="true"
              className={cn(
                "shrink-0 overflow-visible",
                tone === "positive" && "text-success",
                tone === "negative" && "text-destructive",
                tone === "neutral" && "text-muted-foreground"
              )}
            >
              <polyline
                points={sparklinePoints(trend)}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
        </div>
      )}
    </Card>
  )
}
