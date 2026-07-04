"use client"

import { useRef, useState } from "react"
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
import type { PanelImperativeHandle } from "react-resizable-panels"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
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
  /** Block slug from lib/blocks.ts — drives the /blocks/preview/:slug iframe. */
  slug: string
}

type Viewport = "desktop" | "tablet" | "mobile"

// Viewport toggles resize the preview panel to real device widths. The v4
// panel API accepts px strings, so we get true 768/390px frames (clamped to
// the container) instead of container-relative percentages. Dragging the
// handle resizes the same panel.
const VIEWPORT_SIZE: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
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
  slug,
}: BlockPreviewProps) {
  const firstKey = files[0] ? (files[0].path ?? files[0].name) : ""
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [activeFile, setActiveFile] = useState(firstKey)
  const [previewKey, setPreviewKey] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const panelRef = useRef<PanelImperativeHandle>(null)

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
    panelRef.current?.resize(VIEWPORT_SIZE[v])
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="mx-auto flex w-full min-h-0 max-w-[1600px] flex-1 flex-col gap-4 px-6 py-8">
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
        <div className="min-h-0 flex-1">
          {tab === "preview" ? (
            <ResizablePanelGroup
              orientation="horizontal"
              className="h-full overflow-hidden rounded-[14px] bg-muted/40"
            >
              {/* Border + radius live on the panel itself so the frame tracks
                  the resized preview; the group only supplies the bg backdrop. */}
              <ResizablePanel
                panelRef={panelRef}
                defaultSize="100%"
                minSize="320px"
                className="overflow-hidden rounded-[14px] border border-border bg-background"
              >
                {/* Real iframe: the block sees the panel's width as its own
                    viewport, so its md: breakpoints + useIsMobile fire for real
                    as the panel is resized/toggled. key=previewKey reloads it. */}
                <iframe
                  key={previewKey}
                  src={`/blocks/preview/${slug}`}
                  title={title}
                  className="h-full w-full border-0"
                />
              </ResizablePanel>
              {/* bg-transparent drops the full-height divider line (it clashed
                  with the rounded frame); only the grip pill shows. after:w-3
                  gives a ~12px grab area without adding a layout gap. */}
              <ResizableHandle
                withHandle
                className="bg-transparent w-3"
              />
              {/* Empty panel reveals the gray backdrop as the preview shrinks. */}
              <ResizablePanel defaultSize={0} />
            </ResizablePanelGroup>
          ) : (
            <div className="flex h-full overflow-hidden rounded-[14px] border border-border bg-muted/40">
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
            <iframe
              key={previewKey}
              src={`/blocks/preview/${slug}`}
              title={title}
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  )
}
