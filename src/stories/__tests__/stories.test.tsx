/// <reference types="vite/client" />
import { existsSync } from "fs"
import { resolve } from "path"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { ControlDef, Story } from "@/components/studio/types"

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

  it.each(stories)("$slug: belongs to a documented component", ({ slug }) => {
    expect(
      existsSync(
        resolve(process.cwd(), `src/content/docs/components/${slug}.mdx`)
      )
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
