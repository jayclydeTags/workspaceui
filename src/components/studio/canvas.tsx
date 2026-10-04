"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ComputerIcon,
  RotateClockwiseIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { useStudio, type Viewport } from "@/components/studio/studio-context"
import type { StudioLink } from "@/components/studio/types"

const VIEWPORTS: {
  id: Viewport
  label: string
  icon: typeof ComputerIcon
  width: string
}[] = [
  { id: "full", label: "Full width", icon: ComputerIcon, width: "max-w-full" },
  { id: "tablet", label: "Tablet", icon: Tablet01Icon, width: "max-w-3xl" },
  { id: "mobile", label: "Mobile", icon: SmartPhone01Icon, width: "max-w-sm" },
]

export function Canvas() {
  return (
    <section
      id="studio-canvas"
      aria-label="Canvas"
      className="flex min-h-[28rem] min-w-0 flex-1 flex-col lg:h-full lg:min-h-0"
    >
      <CanvasToolbar />
      <CanvasSurface />
    </section>
  )
}

function CanvasToolbar() {
  const { slots, viewport, setViewport, remount } = useStudio()

  return (
    <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b px-4 py-2">
      <div className="flex items-center gap-1">
        <NavArrow
          link={slots.prev}
          icon={ArrowLeft01Icon}
          label="Previous component"
        />
        <NavArrow
          link={slots.next}
          icon={ArrowRight01Icon}
          label="Next component"
        />
      </div>
      <span className="text-sm font-medium">{slots.title}</span>
      <div className="ml-auto flex items-center gap-1">
        <div
          role="group"
          aria-label="Canvas width"
          className="flex items-center gap-0.5 rounded-lg border p-0.5"
        >
          {VIEWPORTS.map(({ id, label, icon }) => (
            <Button
              key={id}
              variant={viewport === id ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label={label}
              aria-pressed={viewport === id}
              onClick={() => setViewport(id)}
            >
              <HugeiconsIcon icon={icon} strokeWidth={2} />
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Reload canvas"
          onClick={remount}
        >
          <HugeiconsIcon icon={RotateClockwiseIcon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}

// Links to the neighbouring component; disabled at either end of the list.
function NavArrow({
  link,
  icon,
  label,
}: {
  link?: StudioLink
  icon: typeof ArrowLeft01Icon
  label: string
}) {
  if (!link) {
    return (
      <Button variant="ghost" size="icon-sm" aria-label={label} disabled>
        <HugeiconsIcon icon={icon} strokeWidth={2} />
      </Button>
    )
  }
  return (
    // A real <a>, not a button: this navigates.
    <Link
      href={link.href}
      aria-label={`${label}: ${link.title}`}
      className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} />
    </Link>
  )
}

// An unbounded dotted surface with the component centered on it, no frame. The
// surface scrolls when the component is bigger than the viewport.
function CanvasSurface() {
  const { story, examples, args, viewport, remountKey } = useStudio()
  const Preview = story?.preview

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-muted/30 canvas-dots">
      <div className="flex min-h-full flex-col items-center justify-center gap-12 p-6 sm:p-10">
        {Preview ? (
          <Stage width={viewport}>
            <Boundary resetKey={args} key={remountKey}>
              <Preview {...args} />
            </Boundary>
          </Stage>
        ) : (
          // No story: the mdx's examples are all there is to show, labelled
          // when there's more than one to tell apart.
          examples.map((example) => (
            <Stage key={example.id} width={viewport}>
              {examples.length > 1 && (
                <p className="mb-3 text-xs text-muted-foreground">
                  {example.label}
                </p>
              )}
              <Boundary resetKey={remountKey} key={remountKey}>
                {example.node}
              </Boundary>
            </Stage>
          ))
        )}
      </div>
    </div>
  )
}

// The width presets cap the stage; the component is centered inside it.
function Stage({ width, children }: { width: Viewport; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center transition-[max-width] motion-reduce:transition-none",
        VIEWPORTS.find((v) => v.id === width)?.width
      )}
    >
      {children}
    </div>
  )
}

// A control combination can make a component throw (e.g. an invalid prop pair);
// show that instead of blanking the whole page, and retry when the args change.
class Boundary extends Component<
  { children: ReactNode; resetKey: unknown },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  componentDidUpdate(prev: { resetKey: unknown }) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="max-w-md rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
        >
          <p className="font-medium text-destructive">
            This component threw while rendering.
          </p>
          <p className="mt-1 text-muted-foreground">
            {this.state.error.message}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
