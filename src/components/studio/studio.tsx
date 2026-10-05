"use client"

import { useCallback, useMemo, useState, useSyncExternalStore } from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Canvas } from "@/components/studio/canvas"
import { Inspector } from "@/components/studio/inspector"
import {
  StudioProvider,
  type StudioContextValue,
  type Viewport,
} from "@/components/studio/studio-context"
import type { Args, Story, StudioSlots } from "@/components/studio/types"

const DESKTOP = "(min-width: 1024px)"

// Three columns need room: below lg the inspector stacks under the canvas.
function useIsDesktop() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(DESKTOP)
      query.addEventListener("change", notify)
      return () => query.removeEventListener("change", notify)
    },
    () => window.matchMedia(DESKTOP).matches,
    () => true
  )
}

export function Studio({
  story,
  slug,
  title,
  description,
  examples,
  prev,
  next,
  install,
  docsUrl,
  api,
}: StudioSlots & { story?: Story }) {
  const [args, setArgs] = useState<Args>(() => story?.args ?? {})
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [viewport, setViewport] = useState<Viewport>("full")
  const [remountKey, setRemountKey] = useState(0)
  const isDesktop = useIsDesktop()

  const setArg = useCallback(
    (key: string, value: unknown) =>
      setArgs((current) => ({ ...current, [key]: value })),
    []
  )
  const value = useMemo<StudioContextValue>(
    () => ({
      story,
      slots: {
        slug,
        title,
        description,
        examples,
        prev,
        next,
        install,
        docsUrl,
        api,
      },
      examples,
      args,
      setArg,
      resetArgs: () => setArgs(story?.args ?? {}),
      inspectorOpen,
      setInspectorOpen,
      viewport,
      setViewport,
      remountKey,
      remount: () => setRemountKey((k) => k + 1),
    }),
    [
      story,
      slug,
      title,
      description,
      examples,
      prev,
      next,
      install,
      docsUrl,
      api,
      args,
      inspectorOpen,
      viewport,
      remountKey,
      setArg,
    ]
  )

  return (
    <StudioProvider value={value}>
      {isDesktop ? (
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          {/* ids keep the canvas mounted (and its layout) when the inspector
              panel is added or removed. */}
          <ResizablePanel id="canvas" defaultSize="68%" minSize="35%">
            <Canvas />
          </ResizablePanel>
          {inspectorOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                id="inspector"
                defaultSize="32%"
                minSize="24%"
                maxSize="55%"
              >
                <Inspector />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-col">
          <Canvas />
          {inspectorOpen && <Inspector />}
        </div>
      )}
    </StudioProvider>
  )
}

// Binds a story to the studio. Story modules default-export the result so the
// server page can render it with the slots (docs, examples) it builds at
// build time.
export function defineStory<A extends object>(story: Story<A>) {
  function StoryStudio(slots: StudioSlots) {
    return <Studio {...slots} story={story as unknown as Story} />
  }
  // Exposed so tests can inspect every story's args/controls without rendering.
  return Object.assign(StoryStudio, { story })
}
