import { existsSync } from "fs"
import { join } from "path"

import { describe, expect, it } from "vitest"

import { templates } from "@/lib/templates"
import { templateUrl, templateZipPath } from "@/lib/template-url"

// vitest runs from the repo root, so process.cwd() is the repo root — same
// assumption templates.ts makes when it fs-reads the manifests.
const REPO_ROOT = process.cwd()

// Required (non-optional) TemplateMeta keys, split by shape. `liveDemoUrl` is
// optional and deliberately excluded.
const REQUIRED_STRINGS = [
  "slug",
  "type",
  "title",
  "description",
  "category",
  "createdDate",
  "updatedDate",
] as const
const REQUIRED_ARRAYS = [
  "techStack",
  "features",
  "pages",
  "screenshots",
] as const

// Valid ISO calendar date: YYYY-MM-DD that also parses to a real day
// (rejects e.g. 2026-02-30, which Date rolls over to Invalid).
function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return !Number.isNaN(new Date(value).getTime())
}

describe("templates metadata", () => {
  it("aggregates at least one template", () => {
    // Guards against the whole suite silently passing on an empty list.
    expect(templates.length).toBeGreaterThan(0)
  })

  it("includes the payroll template in the catalog", () => {
    expect(templates.some((template) => template.slug === "payroll")).toBe(true)
  })

  it("has unique slugs", () => {
    const slugs = templates.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(templates)(
    "$slug: required string fields are present and non-empty",
    (template) => {
      for (const key of REQUIRED_STRINGS) {
        const value = template[key]
        expect(
          typeof value === "string" && value.trim().length > 0,
          `${template.slug}: "${key}" must be a non-empty string`
        ).toBe(true)
      }
    }
  )

  it.each(templates)(
    "$slug: required array fields are non-empty lists of non-empty strings",
    (template) => {
      for (const key of REQUIRED_ARRAYS) {
        const value = template[key]
        expect(
          Array.isArray(value) && value.length > 0,
          `${template.slug}: "${key}" must be a non-empty array`
        ).toBe(true)
        for (const entry of value) {
          expect(
            typeof entry === "string" && entry.trim().length > 0,
            `${template.slug}: "${key}" has an empty entry`
          ).toBe(true)
        }
      }
    }
  )

  it.each(templates)(
    "$slug: createdDate and updatedDate are valid ISO dates",
    (template) => {
      expect(
        isIsoDate(template.createdDate),
        `${template.slug}: createdDate "${template.createdDate}" is not a valid ISO date`
      ).toBe(true)
      expect(
        isIsoDate(template.updatedDate),
        `${template.slug}: updatedDate "${template.updatedDate}" is not a valid ISO date`
      ).toBe(true)
    }
  )

  it.each(templates)(
    "$slug: directory matches the slug and contains a package.json",
    (template) => {
      const dir = join(REPO_ROOT, "templates", template.slug)
      // slug is read from template.json but must equal the containing dir name —
      // this existence check fails when they drift.
      expect(
        existsSync(dir),
        `templates/${template.slug}/ does not exist (slug/dir mismatch?)`
      ).toBe(true)
      expect(
        existsSync(join(dir, "package.json")),
        `templates/${template.slug}/package.json is missing`
      ).toBe(true)
    }
  )

  it.each(templates)(
    "$slug: every screenshot resolves under public/templates/<slug>/",
    (template) => {
      const prefix = `/templates/${template.slug}/`
      for (const screenshot of template.screenshots) {
        expect(
          screenshot.startsWith(prefix),
          `${template.slug}: screenshot "${screenshot}" must live under ${prefix}`
        ).toBe(true)
        // public asset paths are rooted at /public; strip the leading slash to hit disk.
        expect(
          existsSync(join(REPO_ROOT, "public", screenshot)),
          `${template.slug}: screenshot file "${screenshot}" not found on disk`
        ).toBe(true)
      }
    }
  )
})

// The detail URL and zip path are derived from the slug in one place so the
// nav link, the gallery, and the search index can't drift apart. Guard the
// derivation and that every real manifest slug produces a valid detail path.
describe("template url helpers", () => {
  it("derives the detail page and zip paths from a slug", () => {
    expect(templateUrl("starter-stub")).toBe("/templates/starter-stub")
    expect(templateZipPath("starter-stub")).toBe("/templates/starter-stub.zip")
  })

  it("maps every template to its detail route", () => {
    expect(templates.length).toBeGreaterThan(0)
    for (const t of templates) {
      expect(templateUrl(t.slug)).toBe(`/templates/${t.slug}`)
    }
  })
})
