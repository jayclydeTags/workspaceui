"use client"

import * as React from "react"
import {
  FileImage,
  FileText,
  File as FileIcon,
  RefreshCw,
  TriangleAlert,
  UploadCloud,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  ATTACHMENTS,
  extLabel,
  formatBytes,
  type FileAttachment,
} from "./data"

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
    return <FileImage />
  if (["pdf", "doc", "docx", "txt", "md", "csv", "xlsx"].includes(ext))
    return <FileText />
  return <FileIcon />
}

function FileRow({
  file,
  onRemove,
  onRetry,
}: {
  file: FileAttachment
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}) {
  return (
    <Attachment state={file.status} className="w-full">
      <AttachmentMedia>
        {file.status === "uploading" ? (
          <Spinner />
        ) : file.status === "error" ? (
          <TriangleAlert />
        ) : (
          fileIcon(file.name)
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{file.name}</AttachmentTitle>
        <AttachmentDescription>
          {file.status === "uploading"
            ? `Uploading · ${file.progress}%`
            : file.status === "error"
              ? "Upload failed. Try again."
              : `${extLabel(file.name)} · ${formatBytes(file.size)}`}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {file.status === "error" && (
          <AttachmentAction
            aria-label={`Retry ${file.name}`}
            onClick={() => onRetry(file.id)}
          >
            <RefreshCw />
          </AttachmentAction>
        )}
        <AttachmentAction
          aria-label={`Remove ${file.name}`}
          onClick={() => onRemove(file.id)}
        >
          <X />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}

export function FileUpload() {
  const [files, setFiles] = React.useState<FileAttachment[]>(ATTACHMENTS)
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return
    const added: FileAttachment[] = Array.from(list).map((f) => ({
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

  // ponytail: retry just flips the row back to done — no real re-upload/network
  // call to retry, this is a static demo. Wire to the real upload request when
  // this block is adapted to an actual endpoint.
  const retry = (id: string) =>
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "done", progress: 100 } : f
      )
    )

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
          <div className="flex flex-col gap-2">
            {files.map((f) => (
              <FileRow key={f.id} file={f} onRemove={remove} onRetry={retry} />
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}
