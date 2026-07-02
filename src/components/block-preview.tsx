import { Fragment, useRef, useState } from "react"
import {
  Check,
  ChevronRight,
  File as FileIcon,
  Folder as FolderIcon,
  Maximize2,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  Terminal,
  X,
} from "lucide-react"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface BlockFile {
  name: string
  /** Optional display path (e.g. "app/dashboard/page.tsx"). Drives the tree view. */
  path?: string
  code: string
}

interface BlockPreviewProps {
  title: string
  installCmd: string
  files: BlockFile[]
  children: React.ReactNode
}

// Fixed preview/code viewport height — the block sits in a card of this height
// and the page scrolls around it (matches the shadcn/v0 blocks layout).
const CONTENT_HEIGHT = "h-[820px]"

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

// Small extension badge shown in the code header (e.g. "TS", "CSS"), matching
// the shadcn blocks code tab.
function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split(".").pop() ?? ""
  const label = ext === "ts" || ext === "tsx" ? "TS" : ext.toUpperCase()
  return (
    <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-foreground text-[8px] leading-none font-bold text-background">
      {label}
    </span>
  )
}

// ── File tree ──────────────────────────────────────────────────────────────

interface TreeNode {
  name: string
  /** Leaf: the file's key (path ?? name). Folder: undefined. */
  fileKey?: string
  children?: TreeNode[]
}

function buildTree(files: BlockFile[]): TreeNode[] {
  const root: TreeNode[] = []

  for (const file of files) {
    const key = file.path ?? file.name
    const parts = key.split("/")
    let nodes = root

    for (let i = 0; i < parts.length - 1; i++) {
      let folder = nodes.find((n) => n.name === parts[i] && n.children)
      if (!folder) {
        folder = { name: parts[i]!, children: [] }
        nodes.push(folder)
      }
      nodes = folder.children!
    }

    nodes.push({ name: parts[parts.length - 1]!, fileKey: key })
  }

  return root
}

function Divider({ className }: { className?: string }) {
  return <div className={cn("h-4 w-px shrink-0 bg-border", className)} />
}

// Full-bleed row: left padding indents by depth so the active highlight still
// spans the full panel width (matches the Paper design's file tree).
const rowClass =
  "flex h-8 w-full items-center gap-2 pr-2 text-left text-sm transition-colors [&_svg]:size-4 [&_svg]:shrink-0"
const indent = (depth: number) => ({ paddingLeft: 16 + depth * 22 })

function TreeFolder({
  node,
  depth,
  activeKey,
  onSelect,
}: {
  node: TreeNode
  depth: number
  activeKey: string
  onSelect: (key: string) => void
}) {
  const [open, setOpen] = useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        style={indent(depth)}
        className={cn(rowClass, "text-foreground hover:bg-muted")}
      >
        <ChevronRight
          className={cn(
            "text-muted-foreground transition-transform",
            open && "rotate-90"
          )}
        />
        <FolderIcon className="text-muted-foreground" />
        {node.name}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <FileTree
          nodes={node.children!}
          depth={depth + 1}
          activeKey={activeKey}
          onSelect={onSelect}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}

function FileTree({
  nodes,
  depth = 0,
  activeKey,
  onSelect,
}: {
  nodes: TreeNode[]
  depth?: number
  activeKey: string
  onSelect: (key: string) => void
}) {
  return nodes.map((node) =>
    node.children ? (
      <TreeFolder
        key={node.name}
        node={node}
        depth={depth}
        activeKey={activeKey}
        onSelect={onSelect}
      />
    ) : (
      <button
        key={node.fileKey}
        type="button"
        style={indent(depth)}
        onClick={() => onSelect(node.fileKey!)}
        className={cn(
          rowClass,
          activeKey === node.fileKey
            ? "bg-muted font-medium text-foreground"
            : "text-foreground hover:bg-muted"
        )}
      >
        {/* chevron spacer so file icons align under folder icons */}
        <span className="size-4 shrink-0" />
        <FileIcon className="text-muted-foreground" />
        {node.name}
      </button>
    )
  )
}

// ── BlockPreview ───────────────────────────────────────────────────────────

export function BlockPreview({
  title,
  installCmd,
  files,
  children,
}: BlockPreviewProps) {
  const firstKey = files[0] ? (files[0].path ?? files[0].name) : ""
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [previewWidth, setPreviewWidth] = useState(1440)
  const [isDragging, setIsDragging] = useState(false)
  const [activeFile, setActiveFile] = useState(firstKey)
  const [previewKey, setPreviewKey] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null)

  async function copyInstall() {
    await navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const activeCode =
    files.find((f) => (f.path ?? f.name) === activeFile)?.code ?? ""
  const tree = buildTree(files)

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
      Math.max(
        320,
        Math.min(
          1440,
          dragRef.current.startWidth + e.clientX - dragRef.current.startX
        )
      )
    )
  }

  function onResizeEnd() {
    dragRef.current = null
    setIsDragging(false)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-6 py-8">
        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-2 pr-4 pl-2">
          {/* Preview / Code toggle */}
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "preview" | "code")}
          >
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>

          <Divider className="mx-1" />

          {/* Title */}
          <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>

          {/* Viewport + preview actions — preview only */}
          {tab === "preview" && (
            <>
              <div className="flex items-center gap-1 rounded-lg border border-border p-[3px]">
                {(["desktop", "tablet", "mobile"] as const).map((v) => {
                  const Icon = VIEWPORT_ICONS[v]
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleViewport(v)}
                      title={v[0]!.toUpperCase() + v.slice(1)}
                      className={cn(
                        "flex size-6 items-center justify-center rounded-md transition-colors [&_svg]:size-4",
                        viewport === v
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon />
                    </button>
                  )
                })}
                <Divider className="mx-0.5" />
                <button
                  type="button"
                  onClick={() => setFullscreen(true)}
                  title="Fullscreen"
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
                >
                  <Maximize2 />
                </button>
                <Divider className="mx-0.5" />
                <button
                  type="button"
                  onClick={() => setPreviewKey((k) => k + 1)}
                  title="Refresh"
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
                >
                  <RotateCw />
                </button>
              </div>
              <Divider className="mx-1" />
            </>
          )}

          {/* Install command — click to copy */}
          <button
            type="button"
            onClick={copyInstall}
            title="Copy install command"
            className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted [&_svg]:size-4 [&_svg]:shrink-0"
          >
            {copied ? (
              <Check className="text-emerald-600" />
            ) : (
              <Terminal className="text-muted-foreground" />
            )}
            <span className="truncate">{installCmd}</span>
          </button>
        </div>

        {/* ── Content card ─────────────────────────────────────────────────── */}
        <div
          className={cn(
            CONTENT_HEIGHT,
            "shrink-0 overflow-hidden rounded-[14px] border border-border bg-muted/40"
          )}
        >
          {tab === "preview" ? (
            <div className="flex h-full items-stretch justify-center p-6">
              {/* left spacer balances the resize handle so the frame stays centered */}
              <div className="w-4 shrink-0" />
              <div className="flex h-full min-w-0 items-stretch">
                {/* Preview frame */}
                <div
                  className="relative translate-x-0 overflow-hidden rounded-xl border border-border shadow-lg"
                  style={{ width: previewWidth, height: "100%" }}
                >
                  <Fragment key={previewKey}>{children}</Fragment>
                  {isDragging && (
                    <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded bg-foreground/80 px-2 py-0.5 text-xs text-background">
                      {previewWidth}px
                    </div>
                  )}
                </div>
                {/* Resize handle */}
                <div
                  className="group flex w-4 shrink-0 cursor-col-resize touch-none items-center justify-center select-none"
                  onPointerDown={onResizeStart}
                  onPointerMove={onResizeMove}
                  onPointerUp={onResizeEnd}
                >
                  <div
                    className={cn(
                      "h-10 w-1 rounded-full transition-colors",
                      isDragging
                        ? "bg-primary"
                        : "bg-border group-hover:bg-muted-foreground/40"
                    )}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full">
              {/* File tree */}
              <div className="flex w-72 shrink-0 flex-col overflow-auto border-r border-border bg-muted/40">
                <div className="flex h-12 shrink-0 items-center border-b border-border px-4 text-sm font-medium text-muted-foreground">
                  Files
                </div>
                <div className="flex flex-col py-2">
                  <FileTree
                    nodes={tree}
                    activeKey={activeFile}
                    onSelect={setActiveFile}
                  />
                </div>
              </div>

              {/* Code viewer — figure fills the card height; the scroll
                  viewport (role=region) grows to fill instead of capping at
                  fumadocs' default max-h-[600px]. Header (figure's first-child
                  div) is bumped h-9.5 → h-12 to line up with the Files header. */}
              <div className="min-w-0 flex-1 [&_[role=region]]:max-h-none [&_[role=region]]:flex-1 [&_figure>div:first-child]:h-12 [&_figure]:m-0 [&_figure]:flex [&_figure]:h-full [&_figure]:flex-col [&_figure]:rounded-none [&_figure]:border-0 [&_figure]:border-l-0">
                {activeCode && (
                  <DynamicCodeBlock
                    lang="tsx"
                    code={activeCode}
                    codeblock={{
                      title: activeFile,
                      icon: <FileTypeIcon name={activeFile} />,
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen preview overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2.5">
            <p className="min-w-0 flex-1 truncate text-sm font-medium">
              {title}
            </p>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              title="Exit fullscreen"
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4"
            >
              <X />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <Fragment key={previewKey}>{children}</Fragment>
          </div>
        </div>
      )}
    </div>
  )
}
