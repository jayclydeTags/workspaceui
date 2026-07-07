import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { TaxTables } from "../page"

describe("TaxTables", () => {
  it("lists all brackets across jurisdictions by default", () => {
    render(<TaxTables />)
    expect(
      screen.getByText("3 jurisdictions · 16 brackets")
    ).toBeInTheDocument()

    const table = screen.getByRole("table")
    expect(within(table).getAllByText("Federal").length).toBeGreaterThan(0)
    expect(within(table).getAllByText("California").length).toBeGreaterThan(0)
    expect(within(table).getAllByText("New York").length).toBeGreaterThan(0)
  })

  it("filters brackets by jurisdiction", async () => {
    const user = userEvent.setup()
    render(<TaxTables />)

    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "California" }))

    const table = screen.getByRole("table")
    expect(within(table).queryAllByText("Federal")).toHaveLength(0)
    expect(within(table).getAllByText("California").length).toBeGreaterThan(0)
  })
})
