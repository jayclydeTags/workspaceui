import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { CreditUsage } from "../page"
import { getAgents, summarize } from "../data"

describe("summarize", () => {
  it("derives category totals from the agent rows", () => {
    const summary = summarize(getAgents("month"))
    expect(summary.used).toBe(487_300)
    expect(
      summary.byCategory.reduce((sum, { credits }) => sum + credits, 0)
    ).toBe(summary.used)
    expect(
      summary.byCategory.find((c) => c.category.id === "research")?.credits
    ).toBe(168_400)
  })

  it("scales shorter periods down", () => {
    const month = summarize(getAgents("month")).used
    const week = summarize(getAgents("week")).used
    const day = summarize(getAgents("day")).used
    expect(week).toBeLessThan(month)
    expect(day).toBeLessThan(week)
  })
})

describe("CreditUsage", () => {
  it("shows the plan against its monthly allowance", () => {
    render(<CreditUsage />)
    expect(
      screen.getByRole("heading", { level: 1, name: "Credit usage" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("487,300 of 600,000 credits used this month")
    ).toBeInTheDocument()
    expect(screen.getByText("Resets on 1 Oct")).toBeInTheDocument()
    expect(
      screen.getByRole("img", {
        name: "Research: 168,400 credits, 34.6% of used",
      })
    ).toBeInTheDocument()
  })

  it("switches period and rescopes the summary", async () => {
    const user = userEvent.setup()
    render(<CreditUsage />)
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )

    await user.click(screen.getByRole("button", { name: "Week" }))
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByText(/credits used this week$/)).toBeInTheDocument()
    expect(screen.getByText(/of monthly allowance$/)).toBeInTheDocument()
    expect(screen.queryByText("Resets on 1 Oct")).not.toBeInTheDocument()
  })

  it("keeps a period selected when the active one is clicked again", async () => {
    const user = userEvent.setup()
    render(<CreditUsage />)
    await user.click(screen.getByRole("button", { name: "Month" }))
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("lists agents by credits and filters them by search", async () => {
    const user = userEvent.setup()
    render(<CreditUsage />)
    const table = screen.getByRole("table")
    const rows = within(table).getAllByRole("row").slice(1)
    expect(rows[0]).toHaveTextContent("Content impact scoring")
    expect(rows[0]).toHaveTextContent("10.3%")

    await user.type(screen.getByLabelText("Search agents"), "teardown")
    const filtered = within(screen.getByRole("table"))
      .getAllByRole("row")
      .slice(1)
    expect(filtered).toHaveLength(1)
    expect(filtered[0]).toHaveTextContent("Competitor teardown")
    expect(filtered[0]).toHaveTextContent("Research")
  })

  it("filters by category and shows a resettable empty state", async () => {
    const user = userEvent.setup()
    render(<CreditUsage />)

    await user.click(screen.getByRole("button", { name: /Filter/ }))
    await user.click(
      await screen.findByRole("menuitemcheckbox", { name: "Research" })
    )
    await user.keyboard("{Escape}")
    const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1)
    expect(rows).toHaveLength(5)
    expect(
      screen.getByRole("button", { name: /Filter\s*1/ })
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText("Search agents"), "zzz")
    expect(screen.getByText("No matches")).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", { name: "Clear search and filters" })
    )
    expect(screen.getByLabelText("Search agents")).toHaveValue("")
    expect(
      within(screen.getByRole("table")).getAllByRole("row").slice(1)
    ).toHaveLength(16)
  })

  it("switches to the power users table", async () => {
    const user = userEvent.setup()
    render(<CreditUsage />)
    await user.click(screen.getByRole("tab", { name: "Power users" }))
    expect(
      screen.getByRole("columnheader", { name: "Top agent" })
    ).toBeInTheDocument()
    expect(screen.getByText("maya@northwind.io")).toBeInTheDocument()

    await user.type(screen.getByLabelText("Search users"), "growth")
    const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toHaveTextContent("Maya Chen")
  })

  it("exports the visible rows as CSV", async () => {
    const user = userEvent.setup()
    const createObjectURL = vi.fn<(blob: Blob) => string>(() => "blob:csv")
    const revokeObjectURL = vi.fn()
    Object.assign(URL, { createObjectURL, revokeObjectURL })
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {})
    render(<CreditUsage />)

    await user.type(screen.getByLabelText("Search agents"), "teardown")
    await user.click(screen.getByRole("button", { name: "Export" }))

    expect(click).toHaveBeenCalledOnce()
    const anchor = click.mock.contexts[0] as HTMLAnchorElement
    expect(anchor.download).toBe("credit-usage-agents-month.csv")
    const csv = await createObjectURL.mock.calls[0][0].text()
    expect(csv).toBe(
      "Agent,Category,Runs,Hours saved,Credits\nCompetitor teardown,Research,1245,312,24832"
    )
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:csv")
  })
})
