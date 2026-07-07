import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { DataTable01 } from "../page"

describe("DataTable01", () => {
  it("renders the first page of payments", () => {
    render(<DataTable01 />)
    expect(screen.getByText("ken99@example.com")).toBeInTheDocument()
    expect(screen.getByText("12 payments")).toBeInTheDocument()
  })

  it("filters by email", async () => {
    const user = userEvent.setup()
    render(<DataTable01 />)

    await user.type(screen.getByPlaceholderText("Filter emails…"), "abe45")

    expect(screen.getByText("abe45@example.com")).toBeInTheDocument()
    expect(screen.queryByText("ken99@example.com")).not.toBeInTheDocument()
  })

  it("sorts by email when the header is clicked", async () => {
    const user = userEvent.setup()
    render(<DataTable01 />)

    await user.click(screen.getByRole("button", { name: /email/i }))

    const emails = screen
      .getAllByText(/@example\.com$/)
      .map((el) => el.textContent)
    const sorted = [...emails].sort()
    expect(emails).toEqual(sorted)
  })

  it("selects a row via its checkbox", async () => {
    const user = userEvent.setup()
    render(<DataTable01 />)

    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[0])

    expect(screen.getByText(/1 of 12 row\(s\) selected/i)).toBeInTheDocument()
  })

  it("paginates to the next page", async () => {
    const user = userEvent.setup()
    render(<DataTable01 />)

    // Default page size is 10; row 11 is hidden until the next page.
    expect(screen.queryByText("grace.liu@example.com")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByText("grace.liu@example.com")).toBeInTheDocument()
  })
})
