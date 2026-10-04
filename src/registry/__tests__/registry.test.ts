import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

import { describe, expect, it } from "vitest"

interface RegistryItem {
  name: string
  type: string
  registryDependencies?: string[]
  // Theme-only items (e.g. status-colors) carry cssVars and no files.
  files?: { path: string }[]
  cssVars?: {
    theme?: Record<string, string>
    light?: Record<string, string>
    dark?: Record<string, string>
  }
}

// vitest always runs from the project root, so process.cwd() is the repo root.
const REPO_ROOT = process.cwd()
const REGISTRY_ADDRESS_PREFIX = "jayclydeTags/workspaceui/"

const registry: { items: RegistryItem[] } = JSON.parse(
  readFileSync(resolve(REPO_ROOT, "registry.json"), "utf-8")
)
const itemNames = new Set(registry.items.map((item) => item.name))

describe("registry.json", () => {
  it("has unique item names", () => {
    expect(itemNames.size).toBe(registry.items.length)
  })

  it.each(registry.items)("$name: every file exists on disk", (item) => {
    for (const file of item.files ?? []) {
      expect(
        existsSync(resolve(REPO_ROOT, file.path)),
        `${item.name} references missing file: ${file.path}`
      ).toBe(true)
    }
  })

  it.each(registry.items)(
    "$name: sibling registryDependencies use the full jayclydeTags address",
    (item) => {
      for (const dep of item.registryDependencies ?? []) {
        const bareName = dep.startsWith(REGISTRY_ADDRESS_PREFIX)
          ? dep.slice(REGISTRY_ADDRESS_PREFIX.length)
          : dep
        if (itemNames.has(bareName)) {
          // A dependency name that matches one of our own items must be addressed with the
          // full jayclydeTags/workspaceui/<item> prefix — bare names resolve against the
          // consumer's default @shadcn registry and 404. See CLAUDE.md "Registry distribution model".
          expect(
            dep,
            `${item.name} -> "${dep}" must be "${REGISTRY_ADDRESS_PREFIX}${bareName}"`
          ).toBe(`${REGISTRY_ADDRESS_PREFIX}${bareName}`)
        }
      }
    }
  )

  it.each(registry.items)(
    "$name: jayclydeTags registryDependencies resolve to a real item",
    (item) => {
      for (const dep of item.registryDependencies ?? []) {
        if (dep.startsWith(REGISTRY_ADDRESS_PREFIX)) {
          const bareName = dep.slice(REGISTRY_ADDRESS_PREFIX.length)
          expect(
            itemNames.has(bareName),
            `${item.name} -> "${dep}" does not match any registry item`
          ).toBe(true)
        }
      }
    }
  )

  // Status tokens (success, warning) are not in a stock shadcn theme. An item
  // that ships a file using them must pull in `status-colors`, directly or
  // through a sibling dependency, or consumers get unstyled output.
  describe("status color tokens", () => {
    const STATUS_ITEM = "status-colors"
    const STATUS_UTILITY =
      /\b(?:[a-z-]+:)*(?:text|bg|border|ring|fill|stroke|outline|from|to|via|decoration|divide|accent|caret)-(?:success|warning)\b/
    const byName = new Map(registry.items.map((item) => [item.name, item]))

    function siblingClosure(item: RegistryItem, seen = new Set<string>()) {
      for (const dep of item.registryDependencies ?? []) {
        const name = dep.startsWith(REGISTRY_ADDRESS_PREFIX)
          ? dep.slice(REGISTRY_ADDRESS_PREFIX.length)
          : dep
        const sibling = byName.get(name)
        if (sibling && !seen.has(name)) {
          seen.add(name)
          siblingClosure(sibling, seen)
        }
      }
      return seen
    }

    it("status-colors declares every token in theme, light and dark", () => {
      const item = byName.get(STATUS_ITEM)
      expect(
        item,
        "registry.json is missing the status-colors item"
      ).toBeDefined()
      for (const token of ["success", "warning"]) {
        expect(item?.cssVars?.theme?.[`color-${token}`]).toBe(`var(--${token})`)
        expect(item?.cssVars?.light?.[token], `light ${token}`).toBeTruthy()
        expect(item?.cssVars?.dark?.[token], `dark ${token}`).toBeTruthy()
      }
    })

    it.each(registry.items.filter((item) => item.files?.length))(
      "$name: depends on status-colors if its files use status tokens",
      (item) => {
        const usesStatusToken = item.files!.some((file) =>
          STATUS_UTILITY.test(
            readFileSync(resolve(REPO_ROOT, file.path), "utf-8")
          )
        )
        if (!usesStatusToken) return
        expect(
          siblingClosure(item).has(STATUS_ITEM),
          `${item.name} uses text-/bg-success|warning but does not depend on "${REGISTRY_ADDRESS_PREFIX}${STATUS_ITEM}"`
        ).toBe(true)
      }
    )
  })
})
