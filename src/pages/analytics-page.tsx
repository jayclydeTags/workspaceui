import { cn } from "@/lib/utils"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

const WEEKLY = [
  { day: "Mon", visits: 4200, errors: 12 },
  { day: "Tue", visits: 3800, errors: 8 },
  { day: "Wed", visits: 5100, errors: 15 },
  { day: "Thu", visits: 4700, errors: 9 },
  { day: "Fri", visits: 6200, errors: 20 },
  { day: "Sat", visits: 2100, errors: 4 },
  { day: "Sun", visits: 1800, errors: 3 },
]

const MAX_VISITS = Math.max(...WEEKLY.map((d) => d.visits))

const SOURCES = [
  { source: "Direct", sessions: 5840, pct: 46 },
  { source: "Organic Search", sessions: 3210, pct: 25 },
  { source: "Referral", sessions: 1920, pct: 15 },
  { source: "Social Media", sessions: 1150, pct: 9 },
  { source: "Email", sessions: 640, pct: 5 },
]

interface MetricCardProps {
  label: string
  value: string
  change: string
  up: boolean
}

function MetricCard({ label, value, change, up }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <div className={cn("mt-1 flex items-center gap-1 text-[11px] font-medium", up ? "text-green-600" : "text-red-500")}>
        {up ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
        {change} vs last week
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold">Analytics</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Last 7 days — Jun 18 to Jun 25, 2026</p>
        </div>

        {/* Metric cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="Page Views" value="27.9k" change="+12.4%" up={true} />
          <MetricCard label="Uptime" value="99.8%" change="+0.2%" up={true} />
          <MetricCard label="Avg Response" value="142 ms" change="+8 ms" up={false} />
          <MetricCard label="Error Rate" value="0.02%" change="-0.01%" up={true} />
        </div>

        {/* Bar chart */}
        <div className="mb-4 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium">Page Views</h2>
            <span className="text-[11px] text-muted-foreground">Daily</span>
          </div>
          <div className="flex h-36 items-end gap-2">
            {WEEKLY.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {(d.visits / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full rounded-t-[3px] bg-foreground/80 transition-all"
                  style={{ height: `${(d.visits / MAX_VISITS) * 96}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium">Traffic Sources</h2>
          </div>
          <div className="divide-y divide-border">
            {SOURCES.map((row) => (
              <div key={row.source} className="flex items-center gap-4 px-4 py-2.5">
                <span className="w-32 shrink-0 text-sm">{row.source}</span>
                <div className="flex-1 rounded-full bg-muted h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-foreground/70"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                  {row.sessions.toLocaleString()}
                </span>
                <span className="w-8 text-right text-xs font-medium tabular-nums">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
