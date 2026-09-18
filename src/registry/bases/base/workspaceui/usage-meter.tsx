"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Progress, ProgressLabel } from "@/components/ui/progress"

export type UsageStatus = "ok" | "warning" | "exceeded" | "unlimited"

/** Classifies usage against a limit. `limit: null` means the plan is unlimited. */
export function getUsageStatus(
  used: number,
  limit: number | null,
  warningAt = 0.8
): UsageStatus {
  if (limit === null) return "unlimited"
  if (limit <= 0 || used >= limit) return "exceeded"
  if (used / limit >= warningAt) return "warning"
  return "ok"
}

const defaultFormat = new Intl.NumberFormat()

// Targets Progress's indicator via its data-slot, since the component
// doesn't expose an indicatorClassName prop.
const INDICATOR: Record<UsageStatus, string> = {
  ok: "",
  warning: "[&_[data-slot=progress-indicator]]:bg-warning",
  exceeded: "[&_[data-slot=progress-indicator]]:bg-destructive",
  unlimited: "",
}

export interface UsageMeterProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** What is being metered, e.g. "API requests". */
  label: React.ReactNode
  /** Amount consumed in the current period. */
  used: number
  /** Plan allowance. Pass `null` for an unlimited plan — the bar is omitted. */
  limit: number | null
  /** Unit appended to the figures, e.g. "GB" or "seats". */
  unit?: string
  /** Formats `used` and `limit`. Defaults to `Intl.NumberFormat`. */
  formatValue?: (value: number) => string
  /** Fraction of the limit (0–1) at which the meter turns to a warning. */
  warningAt?: number
  /** Secondary line under the bar, e.g. "Resets Oct 1". */
  description?: React.ReactNode
  /** Trailing control under the bar, e.g. an upgrade button. */
  action?: React.ReactNode
}

export function UsageMeter({
  label,
  used,
  limit,
  unit,
  formatValue = defaultFormat.format,
  warningAt = 0.8,
  description,
  action,
  className,
  ...props
}: UsageMeterProps) {
  const status = getUsageStatus(used, limit, warningAt)
  const percent =
    limit === null ? 0 : limit <= 0 ? 100 : Math.round((used / limit) * 100)
  const suffix = unit ? ` ${unit}` : ""
  const figures =
    limit === null
      ? `${formatValue(used)}${suffix}`
      : `${formatValue(used)} / ${formatValue(limit)}${suffix}`

  const statusText =
    status === "unlimited"
      ? "Unlimited"
      : status === "exceeded"
        ? limit !== null && used > limit
          ? `Over limit by ${formatValue(used - limit)}${suffix}`
          : "Limit reached"
        : `${percent}% used`

  const footer = (
    <div className="flex min-h-6 flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span
        className={cn(
          "inline-flex items-center gap-1 font-medium tabular-nums",
          status === "warning" && "text-warning",
          status === "exceeded" && "text-destructive",
          (status === "ok" || status === "unlimited") && "text-muted-foreground"
        )}
      >
        {status === "warning" && (
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={2}
            className="size-3.5"
            aria-hidden="true"
          />
        )}
        {status === "exceeded" && (
          <HugeiconsIcon
            icon={AlertCircleIcon}
            strokeWidth={2}
            className="size-3.5"
            aria-hidden="true"
          />
        )}
        {statusText}
      </span>
      {description && (
        <span className="text-muted-foreground">{description}</span>
      )}
      {action && <div className="ms-auto">{action}</div>}
    </div>
  )

  if (limit === null) {
    return (
      <div
        data-slot="usage-meter"
        data-status={status}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {figures}
          </span>
        </div>
        {footer}
      </div>
    )
  }

  return (
    <div
      data-slot="usage-meter"
      data-status={status}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <Progress
        value={Math.min(percent, 100)}
        getAriaValueText={() => `${figures}, ${statusText}`}
        className={cn("gap-2", INDICATOR[status])}
      >
        <div className="flex w-full items-baseline justify-between gap-2">
          <ProgressLabel>{label}</ProgressLabel>
          <span className="text-sm text-muted-foreground tabular-nums">
            {figures}
          </span>
        </div>
      </Progress>
      {footer}
    </div>
  )
}
