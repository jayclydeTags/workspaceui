/// <reference types="vite/client" />
import { existsSync } from "fs"
import { resolve } from "path"
import { render } from "@testing-library/react"
import { beforeAll, describe, expect, it, vi } from "vitest"

import type { ControlDef, Story } from "@/components/studio/types"
import { SHADCN_COMPONENTS } from "@/lib/shadcn-components"

const modules = import.meta.glob("../*.tsx", {
  eager: true,
})

const stories = (
  Object.entries(modules) as [string, { default: { story: Story } }][]
).map(([path, mod]) => ({
  slug: path.replace(/^\.\.\//, "").replace(/\.tsx$/, ""),
  story: mod.default.story,
}))

describe("component stories", () => {
  // jsdom has no matchMedia; some primitives (the sidebar's mobile hook) read it.
  beforeAll(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    )
  })

  it.each(stories)("$slug: variations are selects or toggles", ({ story }) => {
    for (const def of Object.values(story.controls) as (
      ControlDef | undefined
    )[]) {
      if (def?.group === "style") {
        expect(["select", "boolean"]).toContain(def.type)
      }
    }
  })

  it("finds the stories", () => {
    expect(stories.length).toBeGreaterThan(0)
  })

  it.each(stories)("$slug: belongs to a listed component", ({ slug }) => {
    const hasMdx = existsSync(
      resolve(process.cwd(), `src/content/docs/components/${slug}.mdx`)
    )
    expect(
      hasMdx || SHADCN_COMPONENTS.some((c) => c.slug === slug),
      `no docs page or shadcn entry for "${slug}"`
    ).toBe(true)
  })

  it.each(stories)("$slug: every control drives a real arg", ({ story }) => {
    for (const key of Object.keys(story.controls)) {
      expect(story.args, `control "${key}" has no matching arg`).toHaveProperty(
        key
      )
    }
  })

  it.each(stories)(
    "$slug: select controls offer their initial value",
    ({ story }) => {
      for (const [key, def] of Object.entries(story.controls) as [
        string,
        ControlDef | undefined,
      ][]) {
        if (def?.type !== "select") continue
        const initial = (story.args as Record<string, unknown>)[key]
        if (initial === undefined) expect(def.allowUnset).toBe(true)
        else expect(def.options).toContain(initial)
      }
    }
  )

  it.each(stories)("$slug: renders with its initial args", ({ story }) => {
    const Preview = story.preview
    const { container } = render(<Preview {...story.args} />)
    expect(container).not.toBeEmptyDOMElement()
  })
})
