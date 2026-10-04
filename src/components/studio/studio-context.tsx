"use client"

import { createContext, use } from "react"

import type {
  Args,
  Story,
  StudioExample,
  StudioSlots,
} from "@/components/studio/types"

export type Viewport = "full" | "tablet" | "mobile"

export interface StudioContextValue {
  story?: Story
  slots: StudioSlots
  examples: StudioExample[]
  args: Args
  setArg: (key: string, value: unknown) => void
  resetArgs: () => void
  viewport: Viewport
  setViewport: (viewport: Viewport) => void
  /** Bumped to remount the canvas content from scratch. */
  remountKey: number
  remount: () => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

export const StudioProvider = StudioContext.Provider

export function useStudio(): StudioContextValue {
  const value = use(StudioContext)
  if (!value) throw new Error("useStudio must be used inside <Studio>")
  return value
}
