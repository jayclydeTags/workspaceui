import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import type { TemplateMeta } from "@/lib/templates"
import { parsePage } from "@/lib/templates"
import { TemplatesGallery } from "../templates-gallery"

const make = (over: Partial<TemplateMeta>): TemplateMeta => ({
  slug: "s",
  type: "Application",
  title: "T",
  description: "d",
  category: "Cat",
  techStack: ["Next.js"],
  createdDate: "2026-01-01",
  updatedDate: "2026-01-02",
  features: [],
  pages: [],
  screenshots: ["/x.svg"],
  ...over,
})

const fixtures: TemplateMeta[] = [
  make({ slug: "app-one", title: "App One", type: "Application", category: "Payroll" }),
  make({ slug: "site-one", title: "Site One", type: "Website", category: "Marketing" }),
]

describe("parsePage", () => {
  it("splits route and source block on the arrow", () => {
    expect(parsePage("Overview → payroll-tasks")).toEqual({
      route: "Overview",
      block: "payroll-tasks",
    })
  })

  it("returns route only when no block is given", () => {
    expect(parsePage("Home")).toEqual({ route: "Home" })
  })
})

describe("TemplatesGallery", () => {
  it("shows a type badge and a category badge on each card", () => {
    render(<TemplatesGallery templates={fixtures} />)
    expect(screen.getByText("Payroll")).toBeInTheDocument()
    expect(screen.getByText("Marketing")).toBeInTheDocument()
    // techStack chip
    expect(screen.getAllByText("Next.js").length).toBeGreaterThan(0)
  })

  it("narrows cards by type when a filter pill is clicked", async () => {
    const user = userEvent.setup()
    render(<TemplatesGallery templates={fixtures} />)

    expect(screen.getByText("App One")).toBeInTheDocument()
    expect(screen.getByText("Site One")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Website" }))

    expect(screen.queryByText("App One")).not.toBeInTheDocument()
    expect(screen.getByText("Site One")).toBeInTheDocument()
  })
})
