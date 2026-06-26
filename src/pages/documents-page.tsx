import * as React from "react"
import { cn } from "@/lib/utils"
import { SearchIcon, FolderIcon, FileTextIcon, FileSpreadsheetIcon, PresentationIcon, UploadIcon } from "lucide-react"

const FILES = [
  { id: 1, name: "Q3 Design Review.pdf", size: "2.4 MB", modified: "2 hours ago", type: "pdf" },
  { id: 2, name: "Sprint Planning Notes.md", size: "12 KB", modified: "Yesterday", type: "md" },
  { id: 3, name: "Analytics Dashboard.xlsx", size: "1.1 MB", modified: "Yesterday", type: "xlsx" },
  { id: 4, name: "Component Registry v2.fig", size: "18 MB", modified: "Mon", type: "fig" },
  { id: 5, name: "API Documentation.pdf", size: "3.2 MB", modified: "Mon", type: "pdf" },
  { id: 6, name: "Team Roadmap 2026.pptx", size: "4.5 MB", modified: "Jun 20", type: "pptx" },
  { id: 7, name: "onboarding-checklist.md", size: "8 KB", modified: "Jun 18", type: "md" },
]

const FOLDERS = [
  { name: "Design System", count: 24, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30" },
  { name: "Engineering", count: 67, color: "text-green-500 bg-green-50 dark:bg-green-900/30" },
  { name: "Marketing", count: 31, color: "text-pink-500 bg-pink-50 dark:bg-pink-900/30" },
  { name: "Legal", count: 8, color: "text-orange-500 bg-orange-50 dark:bg-orange-900/30" },
]

function fileIcon(type: string) {
  if (type === "xlsx") return <FileSpreadsheetIcon className="size-4 text-green-600" />
  if (type === "pptx") return <PresentationIcon className="size-4 text-orange-500" />
  return <FileTextIcon className="size-4 text-blue-500" />
}

export function DocumentsPage() {
  const [query, setQuery] = React.useState("")
  const filtered = FILES.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Documents</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">48 files across 4 folders</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-80">
            <UploadIcon className="size-3" /> Upload
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Folders */}
        {query === "" && (
          <div className="mb-6">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Folders</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FOLDERS.map((folder) => (
                <button
                  key={folder.name}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-muted/40"
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", folder.color)}>
                    <FolderIcon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{folder.name}</p>
                    <p className="text-[11px] text-muted-foreground">{folder.count} files</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        <div>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {query ? `Results (${filtered.length})` : "Recent Files"}
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">No files found</div>
            ) : (
              filtered.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 cursor-pointer"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {fileIcon(file.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{file.name}</p>
                    <p className="text-[11px] text-muted-foreground">{file.size} · {file.modified}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
