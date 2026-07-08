import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Leads } from "../page"
import { emptyDraft, isHot, isValid, qualificationRate, type Lead } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("isHot", () => {
  it("is true at or above the hot score", () => {
    expect(isHot({ score: 75, stage: "contacted" } as Lead)).toBe(true)
    expect(isHot({ score: 74, stage: "contacted" } as Lead)).toBe(false)
  })

  it("is never true for an unqualified lead", () => {
    expect(isHot({ score: 99, stage: "unqualified" } as Lead)).toBe(false)
  })
})

describe("qualificationRate", () => {
  it("ignores leads that haven't been worked", () => {
    const leads = [
      { stage: "new" },
      { stage: "qualified" },
      { stage: "unqualified" },
    ] as Lead[]
    expect(qualificationRate(leads)).toBe(50)
  })

  it("guards against an unworked pipeline", () => {
    expect(qualificationRate([{ stage: "new" }] as Lead[])).toBe(0)
  })
})

describe("isValid", () => {
  const filled = { ...emptyDraft(), name: "Iris", email: "iris@x.example" }

  it("rejects a malformed email", () => {
    expect(isValid({ ...filled, email: "iris@x" })).toBe(false)
  })

  it("rejects a score outside 0–100", () => {
    expect(isValid({ ...filled, score: 101 })).toBe(false)
  })
})

describe("Leads", () => {
  it("summarises hot and qualified leads", () => {
    render(<Leads />)
    expect(screen.getByText("5 leads · 2 hot · 25% qualified")).toBeInTheDocument()
    expect(screen.getAllByLabelText("Hot lead").length).toBeGreaterThan(0)
  })

  it("filters by stage", async () => {
    const user = userEvent.setup()
    render(<Leads />)

    await user.click(screen.getByLabelText("Filter by stage"))
    await user.click(await screen.findByRole("option", { name: "unqualified" }))

    expect(screen.getAllByText("Owen Blake").length).toBeGreaterThan(0)
    expect(screen.queryByText("Iris Muller")).not.toBeInTheDocument()
  })

  it("creates a lead", async () => {
    const user = userEvent.setup()
    render(<Leads />)

    await user.click(screen.getByRole("button", { name: /new lead/i }))
    await user.type(screen.getByLabelText("Name"), "Ken Adams")
    await user.type(screen.getByLabelText("Email"), "ken@acme.example")
    await user.click(screen.getByRole("button", { name: "Create lead" }))

    expect(screen.getAllByText("Ken Adams").length).toBeGreaterThan(0)
    expect(screen.getByText("6 leads · 2 hot · 25% qualified")).toBeInTheDocument()
  })

  it("only lets a qualified lead be converted", async () => {
    const user = userEvent.setup()
    render(<Leads />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Devon Park" })[0]
    )
    expect(await screen.findByRole("menuitem", { name: "Convert" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })

  it("converts a qualified lead out of the pipeline", async () => {
    const user = userEvent.setup()
    render(<Leads />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Iris Muller" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Convert" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Convert" }))

    expect(screen.queryByText("Iris Muller")).not.toBeInTheDocument()
    expect(screen.getByText("4 leads · 1 hot · 0% qualified")).toBeInTheDocument()
  })

  it("deletes a lead after confirmation", async () => {
    const user = userEvent.setup()
    render(<Leads />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Owen Blake" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Owen Blake")).not.toBeInTheDocument()
    expect(screen.getByText("4 leads · 2 hot · 33% qualified")).toBeInTheDocument()
  })
})
