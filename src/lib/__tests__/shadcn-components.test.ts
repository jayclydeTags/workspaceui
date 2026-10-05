import { existsSync, readdirSync } from "fs"
import { resolve } from "path"
import { describe, expect, it } from "vitest"

import {
  SHADCN_COMPONENTS,
  getShadcnComponent,
  shadcnDocsUrl,
  shadcnInstallCommand,
} from "@/lib/shadcn-components"

const ROOT = process.cwd()

describe("SHADCN_COMPONENTS", () => {
  it("lists exactly the primitives installed in src/components/ui", () => {
    const installed = readdirSync(resolve(ROOT, "src/components/ui"))
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => file.replace(/\.tsx$/, ""))
      .sort()

    expect(SHADCN_COMPONENTS.map((c) => c.slug).sort()).toEqual(installed)
  })

  it("has unique slugs and a title and description for each", () => {
    const slugs = SHADCN_COMPONENTS.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const component of SHADCN_COMPONENTS) {
      expect(component.title.trim()).not.toBe("")
      expect(component.description.trim()).not.toBe("")
    }
  })

  it("has a playground story for every component", () => {
    for (const { slug } of SHADCN_COMPONENTS) {
      expect(
        existsSync(resolve(ROOT, `src/stories/${slug}.tsx`)),
        `missing story: src/stories/${slug}.tsx`
      ).toBe(true)
    }
  })

  it("doesn't collide with a WorkspaceUI component page", () => {
    for (const { slug } of SHADCN_COMPONENTS) {
      expect(
        existsSync(resolve(ROOT, `src/content/docs/components/${slug}.mdx`)),
        `"${slug}" is both a shadcn primitive and a WorkspaceUI page`
      ).toBe(false)
    }
  })
})

describe("shadcn links", () => {
  it("installs from the default shadcn registry, not this one", () => {
    expect(shadcnInstallCommand("button")).toBe("npx shadcn@latest add button")
  })

  it("links to the base docs page", () => {
    expect(shadcnDocsUrl("alert-dialog")).toBe(
      "https://ui.shadcn.com/docs/components/base/alert-dialog"
    )
  })

  it("looks a component up by slug", () => {
    expect(getShadcnComponent("tabs")?.title).toBe("Tabs")
    expect(getShadcnComponent("nope")).toBeUndefined()
  })
})
