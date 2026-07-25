import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { DataTable01 } from "../page"

describe("DataTable01", () => {
  it("renders every payment as an editable grid row", () => {
    render(<DataTable01 />)
    expect(screen.getByText("12 payments")).toBeInTheDocument()
    expect(screen.getByDisplayValue("ken99@example.com")).toBeInTheDocument()
  })

  it("filters by email via the filter chip chain", async () => {
    const user = userEvent.setup()
    render(<DataTable01 />)

    await user.click(screen.getByRole("button", { name: /filter/i }))
    await user.click(await screen.findByRole("option", { name: "Email" }))
    await user.click(await screen.findByRole("button", { name: "contains" }))
    await user.type(screen.getByPlaceholderText("Value"), "abe45")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByDisplayValue("abe45@example.com")).toBeInTheDocument()
    expect(
      screen.queryByDisplayValue("ken99@example.com")
    ).not.toBeInTheDocument()
  })

  it("selects a row and shows the bulk toolbar", async () => {
    const user = userEvent.setup()
    render(<DataTable01 />)

    await user.click(
      screen.getAllByRole("checkbox", { name: /select row/i })[0]!
    )

    expect(
      screen.getByRole("toolbar", { name: "1 selected" })
    ).toBeInTheDocument()
  })

  it("bulk deletes selected rows after confirming", async () => {
    const user = userEvent.setup()
    render(<DataTable01 />)

    await user.click(
      screen.getAllByRole("checkbox", { name: /select row/i })[0]!
    )
    await user.click(screen.getByRole("button", { name: /delete/i }))
    await user.click(screen.getByRole("button", { name: "Delete" }))

    expect(
      screen.queryByDisplayValue("ken99@example.com")
    ).not.toBeInTheDocument()
  })
})
