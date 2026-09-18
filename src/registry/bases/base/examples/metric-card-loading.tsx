"use client"

import { MetricCard } from "@/registry/bases/base/workspaceui/metric-card"

export function MetricCardLoadingDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <MetricCard label="MRR" value="" trend={[]} loading />
      <MetricCard label="Active users" value="" loading />
    </div>
  )
}
