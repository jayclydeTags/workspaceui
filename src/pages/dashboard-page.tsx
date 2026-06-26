import * as React from "react"
import { cn } from "@/lib/utils"
import { useWorkspace } from "@/registry/ui/workspace"
import {
  MailIcon,
  CalendarIcon,
  FileTextIcon,
  BarChart2Icon,
  CheckSquareIcon,
  ArrowRightIcon,
} from "lucide-react"

const RECENT_ACTIVITY = [
  { id: 1, icon: MailIcon, color: "text-blue-500 bg-blue-50", text: "Alice Chen sent Q3 Design Review slides", time: "9:41 AM" },
  { id: 2, icon: MailIcon, color: "text-blue-500 bg-blue-50", text: "Bob Martinez replied to Sprint planning", time: "8:22 AM" },
  { id: 3, icon: CalendarIcon, color: "text-purple-500 bg-purple-50", text: "Design Review at 2:00 PM today", time: "Today" },
  { id: 4, icon: FileTextIcon, color: "text-green-500 bg-green-50", text: "Component Registry v2.fig was updated", time: "Yesterday" },
  { id: 5, icon: CheckSquareIcon, color: "text-orange-500 bg-orange-50", text: "Sprint planning tickets groomed", time: "Yesterday" },
]

interface StatCardProps { label: string; value: string; sub?: string; color: string }

function StatCard({ label, value, sub, color }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4")}>
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-semibold tabular-nums", color)}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  )
}

export function DashboardPage({ paneId }: { paneId: string }) {
  const { openTabInPane } = useWorkspace()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const open = (id: string, title: string, icon: React.ReactNode) =>
    openTabInPane(paneId, { id, title, icon })

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold">{greeting}, Jay Clyde</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Here's what's happening today, June 25, 2026.</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Unread Emails" value="12" sub="+3 since yesterday" color="text-blue-600" />
          <StatCard label="Today's Events" value="3" sub="Next at 9:00 AM" color="text-purple-600" />
          <StatCard label="Documents" value="48" sub="4 recently modified" color="text-green-600" />
          <StatCard label="Active Tasks" value="7" sub="2 due today" color="text-orange-600" />
        </div>

        {/* Body */}
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          {/* Recent activity */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-medium">Recent Activity</h2>
            </div>
            <div className="divide-y divide-border">
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                  <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", item.color)}>
                    <item.icon className="size-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-medium">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-1.5">
              {[
                { id: "inbox", title: "Inbox", label: "Open Inbox", icon: <MailIcon className="size-3.5" />, color: "text-blue-600" },
                { id: "analytics", title: "Analytics", label: "View Analytics", icon: <BarChart2Icon className="size-3.5" />, color: "text-rose-600" },
                { id: "calendar", title: "Calendar", label: "Open Calendar", icon: <CalendarIcon className="size-3.5" />, color: "text-purple-600" },
                { id: "documents", title: "Documents", label: "Browse Documents", icon: <FileTextIcon className="size-3.5" />, color: "text-green-600" },
              ].map((action) => (
                <button
                  key={action.id}
                  onClick={() => open(action.id, action.title, action.icon)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                >
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted", action.color)}>
                    {action.icon}
                  </span>
                  <span className="text-sm">{action.label}</span>
                  <ArrowRightIcon className="ml-auto size-3 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
