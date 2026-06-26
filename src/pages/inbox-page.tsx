import * as React from "react"
import { cn } from "@/lib/utils"
import { PenSquareIcon } from "lucide-react"

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  unread?: boolean
}

const EMAILS: Email[] = [
  { id: "1", from: "Alice Chen", subject: "Q3 design review — slides attached", preview: "Hi team, please find the updated slides for tomorrow's review…", time: "9:41 AM", unread: true },
  { id: "2", from: "Bob Martinez", subject: "Re: Sprint planning", preview: "Confirmed. I'll have the tickets groomed before Thursday's call.", time: "8:22 AM", unread: true },
  { id: "3", from: "GitHub", subject: "[workspaceui] PR #7 merged", preview: "workspace-tabs: fix active connector offset in dark mode", time: "Yesterday" },
  { id: "4", from: "Vercel", subject: "Deployment successful", preview: "Your production deployment to workspaceui.vercel.app is live.", time: "Yesterday" },
  { id: "5", from: "Diana Park", subject: "Component registry feedback", preview: "Love the curved connector trick — really nails the Arc browser feel!", time: "Mon" },
  { id: "6", from: "Linear", subject: "7 issues assigned to you", preview: "You have 7 open issues in Workspace UI project.", time: "Mon" },
  { id: "7", from: "Notion", subject: "Sprint 14 retrospective notes", preview: "The notes from yesterday's retro have been published to the team workspace.", time: "Sun" },
]

const VIEW_LABELS: Record<string, string> = {
  inbox: "Inbox",
  starred: "Starred",
  sent: "Sent",
  drafts: "Drafts",
  trash: "Trash",
}

function ComposeButton() {
  return (
    <button className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-80">
      <PenSquareIcon className="size-3" />
      Compose
    </button>
  )
}

function EmailDetail({ email }: { email: Email | undefined }) {
  if (email == null) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
        <p className="text-sm">No email selected</p>
        <p className="text-xs opacity-60">Click an email to read it</p>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col overflow-auto p-6">
      <h2 className="mb-1 text-base font-semibold">{email.subject}</h2>
      <div className="mb-4 text-sm text-muted-foreground">
        From <span className="font-medium text-foreground">{email.from}</span> · {email.time}
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
        <p>{email.preview}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </div>
  )
}

export function InboxPage({ view = "inbox" }: { view?: string }) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const label = VIEW_LABELS[view] ?? "Inbox"
  const emails = view === "starred"
    ? EMAILS.filter((e) => e.unread)
    : view === "sent" || view === "drafts"
    ? EMAILS.slice(2, 5)
    : view === "trash"
    ? EMAILS.slice(5)
    : EMAILS

  const selectedEmail = emails.find((e) => e.id === selectedId)

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="flex w-[280px] shrink-0 flex-col border-r border-border">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-3">
          <span className="text-[13px] font-medium">{label}</span>
          <ComposeButton />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelectedId(email.id)}
              className={cn(
                "flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors",
                selectedId === email.id ? "bg-accent" : "hover:bg-muted/50",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn("truncate text-[13px]", email.unread ? "font-semibold" : "font-medium text-foreground/80")}>
                  {email.from}
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{email.time}</span>
              </div>
              <span className={cn("truncate text-[12px]", email.unread ? "text-foreground" : "text-foreground/70")}>
                {email.subject}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">{email.preview}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="min-w-0 flex-1">
        <EmailDetail email={selectedEmail} />
      </div>
    </div>
  )
}
