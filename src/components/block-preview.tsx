import { useState, useEffect, useRef } from "react"
import { Code2, Eye, FileText, Monitor, Smartphone, Tablet } from "lucide-react"
import { codeToHtml } from "shiki"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

export interface BlockFile {
  name: string
  code: string
}

interface BlockPreviewProps {
  title: string
  description: string
  installCmd: string
  files: BlockFile[]
  children: React.ReactNode
}

type Viewport = "desktop" | "tablet" | "mobile"

const VIEWPORT_PRESET: Record<Viewport, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 390,
}

const VIEWPORT_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} satisfies Record<Viewport, React.ComponentType<{ className?: string }>>

export function BlockPreview({
  title,
  description,
  installCmd,
  files,
  children,
}: BlockPreviewProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [previewWidth, setPreviewWidth] = useState(1440)
  const [isDragging, setIsDragging] = useState(false)
  const [activeFile, setActiveFile] = useState(files[0]?.name ?? "")
  const [codeHtml, setCodeHtml] = useState("")
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null)

  const activeCode = files.find((f) => f.name === activeFile)?.code ?? ""

  useEffect(() => {
    if (!activeCode) return
    codeToHtml(activeCode, {
      lang: "tsx",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }).then(setCodeHtml)
  }, [activeCode])

  function handleViewport(v: Viewport) {
    setViewport(v)
    setPreviewWidth(VIEWPORT_PRESET[v])
  }

  function onResizeStart(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startWidth: previewWidth }
    setIsDragging(true)
  }

  function onResizeMove(e: React.PointerEvent) {
    if (!dragRef.current) return
    setPreviewWidth(
      Math.max(320, Math.min(1440, dragRef.current.startWidth + e.clientX - dragRef.current.startX))
    )
  }

  function onResizeEnd() {
    dragRef.current = null
    setIsDragging(false)
  }

  return (
    // h-14 = header height
    <div className="flex h-[calc(100svh-3.5rem)] flex-col overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border bg-background px-6 py-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold leading-tight">{title}</h1>
          <p className="truncate text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {/* Preview / Code */}
          <div className="flex overflow-hidden rounded-md border border-border">
            {(["preview", "code"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
                  tab === t
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "preview" ? (
                  <Eye className="size-3.5" />
                ) : (
                  <Code2 className="size-3.5" />
                )}
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>

          {/* Viewport switcher — preview only */}
          {tab === "preview" && (
            <div className="flex overflow-hidden rounded-md border border-border">
              {(["desktop", "tablet", "mobile"] as const).map((v) => {
                const Icon = VIEWPORT_ICONS[v]
                return (
                  <button
                    key={v}
                    onClick={() => handleViewport(v)}
                    title={v[0]!.toUpperCase() + v.slice(1)}
                    className={cn(
                      "px-2.5 py-1.5 transition-colors",
                      viewport === v
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                )
              })}
            </div>
          )}

          {/* Install command */}
          <div className="flex items-center gap-1 overflow-hidden rounded-md border border-border bg-muted/50 py-1 pl-3 pr-1">
            <code className="text-xs text-muted-foreground">{installCmd}</code>
            <CopyButton value={installCmd} />
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {tab === "preview" ? (
        <div className="flex flex-1 items-start justify-center overflow-hidden bg-muted/30 p-6">
          {/* left spacer balances the resize handle so the frame stays centered */}
          <div className="w-4 shrink-0" />
          <div className="flex h-full min-w-0 items-stretch">
            {/* Preview frame */}
            <div
              className="relative translate-x-0 overflow-hidden rounded-xl border border-border shadow-lg"
              style={{ width: previewWidth, height: "100%" }}
            >
              {children}
              {isDragging && (
                <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded bg-foreground/80 px-2 py-0.5 text-xs text-background">
                  {previewWidth}px
                </div>
              )}
            </div>
            {/* Resize handle */}
            <div
              className="group flex w-4 shrink-0 cursor-col-resize items-center justify-center select-none touch-none"
              onPointerDown={onResizeStart}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
            >
              <div
                className={cn(
                  "h-10 w-1 rounded-full transition-colors",
                  isDragging ? "bg-primary" : "bg-border group-hover:bg-muted-foreground/40"
                )}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* File tree */}
          <div className="w-56 shrink-0 overflow-auto border-r border-border bg-muted/20 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Files
            </p>
            {files.map((f) => (
              <button
                key={f.name}
                onClick={() => setActiveFile(f.name)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
                  activeFile === f.name
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <FileText className="size-3.5 shrink-0" />
                <span className="truncate font-mono text-xs">{f.name}</span>
              </button>
            ))}
          </div>

          {/* Code viewer */}
          <div className="relative flex-1 overflow-auto">
            <div className="absolute right-4 top-4 z-10">
              <CopyButton value={activeCode} />
            </div>
            <div
              className="min-h-full p-6 text-sm [&_.shiki]:bg-transparent! [&_pre]:!m-0 [&_pre]:bg-transparent!"
              dangerouslySetInnerHTML={{ __html: codeHtml }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
