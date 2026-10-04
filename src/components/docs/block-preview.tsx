"use client"

import { useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ArrowRight01Icon,
  File01Icon,
  Folder01Icon,
  Maximize02Icon,
  ComputerIcon,
  RotateClockwiseIcon,
  SmartPhone01Icon,
  Tablet01Icon,
  TerminalIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { DynamicCodeBlock } from "@/components/docs/dynamic-codeblock"
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
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NavArrows, Tip } from "@/components/studio/toolbar"
import type { StudioLink } from "@/components/studio/types"

export interface BlockFile {
  name: string
  /** Optional display path (e.g. "app/dashboard/page.tsx"). Drives the tree view. */
  path?: string
  code: string
}

interface BlockPreviewProps {
  title: string
  /** Omitted for copy-only blocks, which have no CLI install. */
  installCmd?: string
  files: BlockFile[]
  /** Block slug from lib/blocks.ts — drives the /blocks/preview/:slug iframe. */
  slug: string
  /** Neighbouring blocks, in sidebar order, for the toolbar arrows. */
  prev?: StudioLink
  next?: StudioLink
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
  desktop: (props: React.ComponentProps<"svg">) => (
    <HugeiconsIcon icon={ComputerIcon} {...props} strokeWidth={2} />
  ),
  tablet: (props: React.ComponentProps<"svg">) => (
    <HugeiconsIcon icon={Tablet01Icon} {...props} strokeWidth={2} />
  ),
  mobile: (props: React.ComponentProps<"svg">) => (
    <HugeiconsIcon icon={SmartPhone01Icon} {...props} strokeWidth={2} />
  ),
} satisfies Record<Viewport, React.ComponentType<{ className?: string }>>

const VIEWPORT_LABELS: Record<Viewport, { name: string; tip: string }> = {
  desktop: { name: "Desktop", tip: "Desktop: fill the canvas" },
  tablet: { name: "Tablet", tip: "Tablet: 768px wide" },
  mobile: { name: "Mobile", tip: "Mobile: 390px wide" },
}

// Small extension badge shown in the code header (e.g. "TS", "CSS"), matching
// the shadcn blocks code tab.
function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split(".").pop() ?? ""
  const label = ext === "ts" || ext === "tsx" ? "TS" : ext.toUpperCase()
  return (
    <span className="inline-flex size-4 items-center justify-center rounded-xs bg-foreground text-xs leading-none font-bold text-background">
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

// Full-bleed row: left padding indents by depth so the active highlight still
// spans the full panel width (matches the Paper design's file tree).
const rowClass =
  "flex h-8 w-full items-center gap-2 pr-2 text-left text-sm transition-colors pl-(--indent) [&_svg]:size-4 [&_svg]:shrink-0"

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
        style={{ "--indent": `${16 + depth * 22}px` } as React.CSSProperties}
        className={cn(rowClass, "text-foreground hover:bg-muted")}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          className={cn(
            "text-muted-foreground transition-transform",
            open && "rotate-90"
          )}
        />
        <HugeiconsIcon
          icon={Folder01Icon}
          strokeWidth={2}
          className="text-muted-foreground"
        />
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
        style={{ "--indent": `${16 + depth * 22}px` } as React.CSSProperties}
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
        <HugeiconsIcon
          icon={File01Icon}
          strokeWidth={2}
          className="text-muted-foreground"
        />
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
  prev,
  next,
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
    if (!installCmd) return
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
      {/* ── Toolbar: same shape as the component canvas's ─────────────────── */}
      <TooltipProvider delay={300}>
        <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b px-4 py-2">
          <NavArrows prev={prev} next={next} noun="block" />
          <span className="min-w-0 truncate text-sm font-medium">{title}</span>

          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "preview" | "code")}
          >
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="ml-auto flex items-center gap-1">
            {tab === "preview" && (
              <>
                <div
                  role="group"
                  aria-label="Preview width"
                  className="flex items-center gap-0.5 rounded-lg border p-0.5"
                >
                  {(["desktop", "tablet", "mobile"] as const).map((v) => {
                    const Icon = VIEWPORT_ICONS[v]
                    const label = VIEWPORT_LABELS[v]
                    return (
                      <Tip
                        key={v}
                        label={label.tip}
                        render={
                          <Button
                            variant={viewport === v ? "secondary" : "ghost"}
                            size="icon-sm"
                            aria-label={label.name}
                            aria-pressed={viewport === v}
                            onClick={() => handleViewport(v)}
                          />
                        }
                      >
                        <Icon />
                      </Tip>
                    )
                  })}
                </div>
                <Tip
                  label="Open the block full screen"
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Fullscreen"
                      onClick={() => setFullscreen(true)}
                    />
                  }
                >
                  <HugeiconsIcon icon={Maximize02Icon} strokeWidth={2} />
                </Tip>
                <Tip
                  label="Reload the preview, resetting its state"
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Reload preview"
                      onClick={() => setPreviewKey((k) => k + 1)}
                    />
                  }
                >
                  <HugeiconsIcon icon={RotateClockwiseIcon} strokeWidth={2} />
                </Tip>
              </>
            )}

            {/* Install command — click to copy */}
            {installCmd && (
              <Tip
                label="Copy the install command"
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Copy install command"
                    onClick={copyInstall}
                  />
                }
              >
                {copied ? (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    className="text-success"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={TerminalIcon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                )}
                <span className="max-w-72 truncate">{installCmd}</span>
              </Tip>
            )}
          </div>
        </div>
      </TooltipProvider>

      {/* ── Canvas ───────────────────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1">
        {tab === "preview" ? (
          <div className="h-full overflow-hidden bg-muted/30 canvas-dots p-4">
            <ResizablePanelGroup orientation="horizontal" className="h-full">
              {/* Border + radius live on a frame inside the panel so it tracks
                  the resized preview; the dotted canvas shows around it. */}
              <ResizablePanel
                panelRef={panelRef}
                defaultSize="100%"
                minSize="320px"
                className="overflow-hidden"
              >
                <div className="h-full overflow-hidden rounded-xl border border-border bg-background">
                  {/* Real iframe: the block sees the panel's width as its own
                      viewport, so its md: breakpoints + useIsMobile fire for real
                      as the panel is resized/toggled. key=previewKey reloads it. */}
                  <iframe
                    key={previewKey}
                    src={`/blocks/preview/${slug}`}
                    title={title}
                    className="h-full w-full border-0"
                  />
                </div>
              </ResizablePanel>
              {/* bg-transparent drops the full-height divider line (it clashed
                  with the rounded frame); only the grip pill shows. w-3 gives a
                  ~12px grab area without adding a layout gap. */}
              <ResizableHandle withHandle className="w-3 bg-transparent" />
              {/* Empty panel reveals the canvas as the preview shrinks. */}
              <ResizablePanel defaultSize={0} />
            </ResizablePanelGroup>
          </div>
        ) : (
          <div className="flex h-full overflow-hidden bg-muted/40">
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
            <div className="min-w-0 flex-1 [&_[role=region]]:max-h-none [&_[role=region]]:flex-1 [&_figure]:m-0 [&_figure]:flex [&_figure]:h-full [&_figure]:flex-col [&_figure]:rounded-none [&_figure]:border-0 [&_figure]:border-l-0 [&_figure>div:first-child]:h-12">
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

      {/* Fullscreen preview overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2.5">
            <p className="min-w-0 flex-1 truncate text-sm font-medium">
              {title}
            </p>
            <Button
              variant="outline"
              size="icon"
              aria-label="Exit fullscreen"
              onClick={() => setFullscreen(false)}
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </Button>
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
