import { render, screen, within, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { DealsPipeline } from "../page"
import { emptyDraft, isValid, weightedForecast, winRate, type Deal } from "../data"

function makeDataTransfer(id: string) {
  return { setData: vi.fn(), getData: vi.fn(() => id), effectAllowed: "" }
}

describe("weightedForecast", () => {
  it("weights open deals by stage probability", () => {
    const deals = [
      { value: 100000, stage: "negotiation" },
      { value: 100000, stage: "qualify" },
    ] as Deal[]
    expect(weightedForecast(deals)).toBe(100000)
  })

  it("excludes closed deals", () => {
    const deals = [
      { value: 50000, stage: "won" },
      { value: 50000, stage: "lost" },
    ] as Deal[]
    expect(weightedForecast(deals)).toBe(0)
  })
})

describe("winRate", () => {
  it("is won over closed", () => {
    const deals = [
      { stage: "won" },
      { stage: "lost" },
      { stage: "qualify" },
    ] as Deal[]
    expect(winRate(deals)).toBe(50)
  })

  it("guards against a pipeline with nothing closed", () => {
    expect(winRate([{ stage: "qualify" }] as Deal[])).toBe(0)
  })
})

describe("isValid", () => {
  it("requires a name, a value, and a close date", () => {
    expect(isValid({ ...emptyDraft(), name: "X", value: 0, closeDate: "2026-09-01" })).toBe(
      false
    )
    expect(isValid({ ...emptyDraft(), name: "X", value: 1000, closeDate: "" })).toBe(false)
    expect(
      isValid({ ...emptyDraft(), name: "X", value: 1000, closeDate: "2026-09-01" })
    ).toBe(true)
  })
})

describe("DealsPipeline", () => {
  it("groups deals into stage columns with a weighted forecast", () => {
    render(<DealsPipeline />)
    expect(screen.getByText("Negotiation")).toBeInTheDocument()
    expect(screen.getByText("Platform renewal")).toBeInTheDocument()
    expect(screen.getByText("$194,500 weighted · 50% win rate")).toBeInTheDocument()
  })

  it("winning a deal drops it out of the forecast", () => {
    render(<DealsPipeline />)

    const card = screen.getByText("Platform renewal").closest("[draggable]")!
    const wonColumn = screen.getByText("Won").closest("div")!.parentElement!

    const dataTransfer = makeDataTransfer("1")
    fireEvent.dragStart(card, { dataTransfer })
    fireEvent.drop(wonColumn, { dataTransfer })

    expect(screen.getByText("$50,500 weighted · 67% win rate")).toBeInTheDocument()
  })

  it("creates a deal", async () => {
    const user = userEvent.setup()
    render(<DealsPipeline />)

    await user.click(screen.getByRole("button", { name: /new deal/i }))
    await user.type(screen.getByLabelText("Name"), "Support upgrade")
    await user.type(screen.getByLabelText("Value"), "10000")
    await user.type(screen.getByLabelText("Close date"), "2026-11-01")
    await user.click(screen.getByRole("button", { name: "Create deal" }))

    expect(screen.getByText("Support upgrade")).toBeInTheDocument()
    // +10,000 at qualify's 20% → +2,000 weighted.
    expect(screen.getByText("$196,500 weighted · 50% win rate")).toBeInTheDocument()
  })

  it("deletes a deal after confirmation", async () => {
    const user = userEvent.setup()
    render(<DealsPipeline />)

    await user.click(
      screen.getByRole("button", { name: "Actions for Analytics module" })
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Analytics module")).not.toBeInTheDocument()
    expect(screen.getByText("$178,500 weighted · 50% win rate")).toBeInTheDocument()
  })
})
