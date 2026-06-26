import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react"

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// June 2026: starts on Monday
const WEEKS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
]

const EVENTS: { day: number; title: string; time: string; color: string }[] = [
  { day: 23, title: "Sprint Planning", time: "10:00 AM", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { day: 25, title: "Team Standup", time: "9:00 AM", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  { day: 25, title: "Design Review", time: "2:00 PM", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  { day: 27, title: "Deployment Window", time: "4:00 PM", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  { day: 30, title: "Month Review", time: "11:00 AM", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
]

const TODAY = 25

function eventsForDay(day: number) {
  return EVENTS.filter((e) => e.day === day)
}

export function CalendarPage() {
  const upcoming = EVENTS.filter((e) => e.day >= TODAY).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))

  return (
    <div className="flex h-full overflow-hidden">
      {/* Calendar grid */}
      <div className="flex min-w-0 flex-1 flex-col overflow-auto p-5">
        {/* Month header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">June 2026</h1>
            <div className="flex items-center">
              <button className="rounded p-1 transition-colors hover:bg-muted">
                <ChevronLeftIcon className="size-4 text-muted-foreground" />
              </button>
              <button className="rounded p-1 transition-colors hover:bg-muted">
                <ChevronRightIcon className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background">
            <PlusIcon className="size-3" /> New Event
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-1 grid grid-cols-7 gap-px">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="py-1 text-center text-[11px] font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="flex-1">
          {WEEKS.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-px border-t border-border">
              {week.map((day, di) => {
                const isToday = day === TODAY
                const dayEvents = day != null ? eventsForDay(day) : []
                return (
                  <div
                    key={di}
                    className={cn(
                      "min-h-[76px] p-1.5 transition-colors",
                      day != null ? "hover:bg-muted/40 cursor-pointer" : "opacity-0 pointer-events-none",
                    )}
                  >
                    {day != null && (
                      <>
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium",
                            isToday
                              ? "bg-foreground text-background"
                              : "text-foreground/80",
                          )}
                        >
                          {day}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {dayEvents.map((ev, i) => (
                            <div
                              key={i}
                              className={cn("truncate rounded px-1 py-0.5 text-[10px] font-medium", ev.color)}
                            >
                              {ev.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming sidebar */}
      <div className="flex w-56 shrink-0 flex-col border-l border-border">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-[13px] font-medium">Upcoming</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {upcoming.map((ev, i) => (
            <div key={i} className="px-4 py-3">
              <p className="text-[11px] font-medium text-muted-foreground">Jun {ev.day}</p>
              <p className="mt-0.5 text-[13px] font-medium">{ev.title}</p>
              <p className="text-[11px] text-muted-foreground">{ev.time}</p>
              <div className={cn("mt-1.5 h-1 w-8 rounded-full", ev.color.split(" ")[0])} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
