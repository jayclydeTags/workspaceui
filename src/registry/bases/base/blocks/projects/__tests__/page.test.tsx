import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Projects } from "../page"
import { isOverdue, isValid, emptyDraft, type Project } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

const today = new Date("2026-07-08")

describe("isOverdue", () => {
  it("flags a past due date on an unfinished project", () => {
    const p = { due: "2026-06-15", status: "active" } as Project
    expect(isOverdue(p, today)).toBe(true)
  })

  it("never flags a completed project", () => {
    const p = { due: "2026-03-31", status: "completed" } as Project
    expect(isOverdue(p, today)).toBe(false)
  })

  it("ignores a missing due date", () => {
    expect(isOverdue({ due: "", status: "active" } as Project, today)).toBe(false)
  })
})

describe("isValid", () => {
  const filled = { ...emptyDraft(), code: "P-1", name: "X" }

  it("rejects progress outside 0–100", () => {
    expect(isValid({ ...filled, progress: 120 })).toBe(false)
    expect(isValid({ ...filled, progress: 100 })).toBe(true)
  })

  it("requires a code and a name", () => {
    expect(isValid(emptyDraft())).toBe(false)
  })
})

describe("Projects", () => {
  it("lists the seeded projects with the active count", () => {
    render(<Projects />)
    expect(screen.getAllByText("Billing migration").length).toBeGreaterThan(0)
    expect(screen.getByText("5 projects · 2 active")).toBeInTheDocument()
  })

  it("filters by status", async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(screen.getByLabelText("Filter by status"))
    await user.click(await screen.findByRole("option", { name: "on-hold" }))

    expect(screen.getAllByText("Data lake pilot").length).toBeGreaterThan(0)
    expect(screen.queryByText("Billing migration")).not.toBeInTheDocument()
  })

  it("creates a project", async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(screen.getByRole("button", { name: /new project/i }))
    await user.type(screen.getByLabelText("Name"), "Portal refresh")
    await user.type(screen.getByLabelText("Code"), "PRJ-106")
    await user.click(screen.getByRole("button", { name: "Create project" }))

    expect(screen.getAllByText("Portal refresh").length).toBeGreaterThan(0)
    expect(screen.getByText("6 projects · 2 active")).toBeInTheDocument()
  })

  it("edits a project", async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for PRJ-104" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    await user.click(screen.getByLabelText("Status"))
    await user.click(await screen.findByRole("option", { name: "active" }))
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getByText("5 projects · 3 active")).toBeInTheDocument()
  })

  it("deletes a project after confirmation", async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for PRJ-105" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("SSO integration")).not.toBeInTheDocument()
    expect(screen.getByText("4 projects · 2 active")).toBeInTheDocument()
  })
})
