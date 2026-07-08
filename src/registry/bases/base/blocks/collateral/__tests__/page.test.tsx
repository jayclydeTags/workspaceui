import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest"

import { CollateralRegister } from "../page"
import {
  COLLATERAL,
  canPerfect,
  emptyDraft,
  isAppraisalStale,
  isUnderSecured,
  isValid,
  lendableValue,
  ltv,
  securedValue,
  type Collateral,
} from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

// Appraisal staleness is derived from the clock, so pin it.
const TODAY = new Date("2026-07-08T00:00:00Z")

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(TODAY)
})
afterAll(() => vi.useRealTimers())

describe("lendableValue", () => {
  it("applies the type's advance rate", () => {
    expect(lendableValue({ type: "property", value: 90000 })).toBe(72000)
    expect(lendableValue({ type: "vehicle", value: 26000 })).toBe(13000)
  })
})

describe("securedValue / ltv", () => {
  it("sums the lendable value of unreleased liens", () => {
    expect(securedValue(COLLATERAL, "LN-2041")).toBe(96000)
  })

  it("ignores released liens", () => {
    // LN-2045's bond portfolio is released; only the van secures it.
    expect(securedValue(COLLATERAL, "LN-2045")).toBe(13000)
  })

  it("is Infinity with no security left", () => {
    expect(ltv([], "LN-2041")).toBe(Infinity)
  })
})

describe("isUnderSecured", () => {
  it("is true when exposure exceeds lendable security", () => {
    expect(isUnderSecured(COLLATERAL, "LN-2045")).toBe(true) // 18,000 vs 13,000
    expect(isUnderSecured(COLLATERAL, "LN-2041")).toBe(false) // 54,200 vs 96,000
  })
})

describe("isAppraisalStale / canPerfect", () => {
  const item = (appraisedOn: string, lien = "pending") =>
    ({ appraisedOn, lien }) as Collateral

  it("goes stale after a year", () => {
    expect(isAppraisalStale(item("2024-05-02"), TODAY)).toBe(true)
    expect(isAppraisalStale(item("2026-05-30"), TODAY)).toBe(false)
  })

  it("only perfects a pending lien on a current appraisal", () => {
    expect(canPerfect(item("2026-05-30"), TODAY)).toBe(true)
    expect(canPerfect(item("2024-05-02"), TODAY)).toBe(false)
    expect(canPerfect(item("2026-05-30", "perfected"), TODAY)).toBe(false)
  })
})

describe("isValid", () => {
  it("requires a description and a positive value", () => {
    expect(isValid({ ...emptyDraft(), description: "X", value: 0 })).toBe(false)
    expect(isValid({ ...emptyDraft(), description: "X", value: 1000 })).toBe(true)
  })
})

describe("CollateralRegister", () => {
  it("summarises lendable security and flags under-secured loans", () => {
    render(<CollateralRegister />)
    expect(screen.getByText("5 assets · $277,000 lendable security")).toBeInTheDocument()
    expect(
      screen.getByText("LN-2045 owes more than its lendable security.")
    ).toBeInTheDocument()
  })

  it("filters by loan", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CollateralRegister />)

    await user.click(screen.getByLabelText("Filter by loan"))
    await user.click(await screen.findByRole("option", { name: "LN-2043" }))

    expect(screen.getAllByText("Office floor, Atlanta").length).toBeGreaterThan(0)
    expect(screen.queryByText("Delivery van, 2023")).not.toBeInTheDocument()
  })

  it("can't perfect a lien on a stale appraisal", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CollateralRegister />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Forklift fleet (3 units)" })[0]
    )
    expect(
      await screen.findByRole("menuitem", { name: "Appraisal stale" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  it("re-appraising unblocks perfecting the lien", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CollateralRegister />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Forklift fleet (3 units)" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))
    await user.clear(screen.getByLabelText("Appraised on"))
    await user.type(screen.getByLabelText("Appraised on"), "2026-07-01")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Forklift fleet (3 units)" })[0]
    )
    expect(await screen.findByRole("menuitem", { name: "Perfect lien" })).toBeInTheDocument()
  })

  it("releasing a lien drops it out of the loan's security", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CollateralRegister />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Office floor, Atlanta" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Release lien" }))

    expect(screen.getByText("5 assets · $109,000 lendable security")).toBeInTheDocument()
    expect(
      screen.getByText("LN-2043, LN-2045 owes more than its lendable security.")
    ).toBeInTheDocument()
  })

  it("pledges new collateral as a pending lien", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CollateralRegister />)

    await user.click(screen.getByRole("button", { name: /pledge collateral/i }))
    await user.type(screen.getByLabelText("Description"), "Land parcel 12")
    await user.type(screen.getByLabelText("Appraised value"), "50000")
    await user.click(screen.getByRole("button", { name: "Pledge" }))

    expect(screen.getAllByText("Land parcel 12").length).toBeGreaterThan(0)
    expect(screen.getByText("6 assets · $317,000 lendable security")).toBeInTheDocument()
  })

  it("deletes collateral after confirmation", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CollateralRegister />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Forklift fleet (3 units)" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Forklift fleet (3 units)")).not.toBeInTheDocument()
    expect(screen.getByText("4 assets · $253,000 lendable security")).toBeInTheDocument()
  })
})
