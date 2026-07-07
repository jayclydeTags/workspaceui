"use client"

import * as React from "react"
import {
  FileImage,
  FileText,
  File as FileIcon,
  Trash2,
  TriangleAlert,
  UploadCloud,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  ATTACHMENTS,
  formatBytes,
  type Attachment,
  type AttachmentStatus,
} from "./data"

function iconFor(name: string): React.ComponentType<{ className?: string }> {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
    return FileImage
  if (["pdf", "doc", "docx", "txt", "md", "csv", "xlsx"].includes(ext))
    return FileText
  return FileIcon
}

const STATUS_HINT: Record<AttachmentStatus, string> = {
  uploading: "Uploading…",
  done: "Uploaded",
  error: "Upload failed",
}

export function FileUpload01() {
  const [files, setFiles] = React.useState<Attachment[]>(ATTACHMENTS)
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return
    const added: Attachment[] = Array.from(list).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      progress: 100,
      status: "done",
    }))
    setFiles((prev) => [...added, ...prev])
  }

  const remove = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id))

  const doneCount = files.filter((f) => f.status === "done").length

  return (
    <Page
      title="Attachments"
      subtitle={`${files.length} files · ${doneCount} uploaded`}
      className="@container overflow-hidden"
      hasPadding
    >
      <div className="flex h-full flex-col gap-4 overflow-auto">
        {/* ── Dropzone ── */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            addFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            dragging
              ? "border-primary bg-accent"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <UploadCloud className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, images, or documents up to 25 MB
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="sr-only"
            aria-label="Upload files"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </div>

        {/* ── File list ── */}
        {files.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UploadCloud />
              </EmptyMedia>
              <EmptyTitle>No attachments</EmptyTitle>
              <EmptyDescription>
                Uploaded files will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {files.map((f) => {
              const Icon = iconFor(f.name)
              return (
                <li
                  key={f.id}
                  className="flex items-center gap-3 rounded-md border p-3"
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted [&_svg]:size-4.5",
                      f.status === "error"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  >
                    {f.status === "error" ? <TriangleAlert /> : <Icon />}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {f.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatBytes(f.size)}
                      </span>
                    </div>
                    {f.status === "uploading" ? (
                      <div
                        role="progressbar"
                        aria-valuenow={f.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Uploading ${f.name}`}
                        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                    ) : (
                      <span
                        className={cn(
                          "text-xs",
                          f.status === "error"
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      >
                        {STATUS_HINT[f.status]}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-muted-foreground"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => remove(f.id)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Page>
  )
}
