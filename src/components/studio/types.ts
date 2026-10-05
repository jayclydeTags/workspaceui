import type { ComponentType, ReactNode } from "react"

import type { ApiBlock } from "@/lib/api-reference"

export type Args = Record<string, unknown>

interface ControlBase {
  label?: string
  description?: string
  /**
   * "style" marks a variation of the component (size, variant, a state like
   * disabled). Those get their own "Variations" section in the inspector;
   * everything else is a "props" control.
   */
  group?: "props" | "style"
}

export type ControlDef = ControlBase &
  (
    | { type: "text"; placeholder?: string; multiline?: boolean }
    | { type: "number"; min?: number; max?: number; step?: number }
    | { type: "boolean" }
    | {
        type: "select"
        options: readonly string[]
        /** Adds an "Unset" option so an optional prop can be omitted. */
        allowUnset?: boolean
      }
    // comma-separated list of numbers, e.g. a sparkline series
    | { type: "numbers" }
  )

export interface Story<A extends object = Args> {
  /** Initial values; also what "Reset" restores. */
  args: A
  controls: { [K in keyof A]?: ControlDef }
  /** Renders the component from the current args. A real component, so it may use hooks. */
  preview: ComponentType<A>
}

export interface StudioExample {
  /** Example file name — also the stable id used to select it. */
  id: string
  label: string
  node: ReactNode
}

export interface StudioLink {
  title: string
  href: string
}

export interface StudioSlots {
  slug: string
  title: string
  description?: string
  /** Only used when a component has no story: they become the canvas content. */
  examples: StudioExample[]
  /** Neighbouring components, in sidebar order, for the toolbar's arrows. */
  prev?: StudioLink
  next?: StudioLink
  /** CLI command that installs the component. */
  install: string
  /** External documentation, for components whose API tables aren't ours to host. */
  docsUrl?: string
  /** The component's "## API Reference" section, as data. */
  api: ApiBlock[]
}
