"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  DollarCircleIcon,
  UserGroupIcon,
  ChartDecreaseIcon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/registry/bases/base/workspaceui/metric-card"

export function MetricCardDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <MetricCard
        label="MRR"
        value="$48,210"
        delta={12.5}
        deltaLabel="vs last month"
        trend={[31, 34, 33, 38, 41, 40, 45, 48]}
        icon={<HugeiconsIcon icon={DollarCircleIcon} strokeWidth={2} />}
      />
      <MetricCard
        label="Active users"
        value="1,204"
        delta={-3.2}
        deltaLabel="vs last week"
        trend={[1310, 1290, 1302, 1260, 1244, 1230, 1204]}
        icon={<HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />}
      />
      <MetricCard
        label="Churn rate"
        value="2.1%"
        delta={-0.4}
        deltaLabel="vs last month"
        invertDelta
        trend={[2.8, 2.7, 2.6, 2.6, 2.4, 2.2, 2.1]}
        icon={<HugeiconsIcon icon={ChartDecreaseIcon} strokeWidth={2} />}
      />
    </div>
  )
}
