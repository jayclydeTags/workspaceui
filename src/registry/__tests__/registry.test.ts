import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

import { describe, expect, it } from "vitest"

interface RegistryItem {
  name: string
  registryDependencies?: string[]
  files: { path: string }[]
}

// vitest always runs from the project root, so process.cwd() is the repo root.
const REPO_ROOT = process.cwd()
const REGISTRY_ADDRESS_PREFIX = "jayclydeTags/workspaceui/"

const registry: { items: RegistryItem[] } = JSON.parse(readFileSync(resolve(REPO_ROOT, "registry.json"), "utf-8"))
const itemNames = new Set(registry.items.map((item) => item.name))

describe("registry.json", () => {
  it("has unique item names", () => {
    expect(itemNames.size).toBe(registry.items.length)
  })

  it.each(registry.items)("$name: every file exists on disk", (item) => {
    for (const file of item.files) {
      expect(existsSync(resolve(REPO_ROOT, file.path)), `${item.name} references missing file: ${file.path}`).toBe(true)
    }
  })

  it.each(registry.items)("$name: sibling registryDependencies use the full jayclydeTags address", (item) => {
    for (const dep of item.registryDependencies ?? []) {
      const bareName = dep.startsWith(REGISTRY_ADDRESS_PREFIX) ? dep.slice(REGISTRY_ADDRESS_PREFIX.length) : dep
      if (itemNames.has(bareName)) {
        // A dependency name that matches one of our own items must be addressed with the
        // full jayclydeTags/workspaceui/<item> prefix — bare names resolve against the
        // consumer's default @shadcn registry and 404. See CLAUDE.md "Registry distribution model".
        expect(dep, `${item.name} -> "${dep}" must be "${REGISTRY_ADDRESS_PREFIX}${bareName}"`).toBe(`${REGISTRY_ADDRESS_PREFIX}${bareName}`)
      }
    }
  })

  it.each(registry.items)("$name: jayclydeTags registryDependencies resolve to a real item", (item) => {
    for (const dep of item.registryDependencies ?? []) {
      if (dep.startsWith(REGISTRY_ADDRESS_PREFIX)) {
        const bareName = dep.slice(REGISTRY_ADDRESS_PREFIX.length)
        expect(itemNames.has(bareName), `${item.name} -> "${dep}" does not match any registry item`).toBe(true)
      }
    }
  })
})
