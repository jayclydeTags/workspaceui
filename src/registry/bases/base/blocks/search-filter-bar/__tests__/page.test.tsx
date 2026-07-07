import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { SearchFilterBar } from "../page"

describe("SearchFilterBar", () => {
  it("filters by search query", async () => {
    const user = userEvent.setup()
    render(<SearchFilterBar />)

    await user.type(screen.getByPlaceholderText("Search name or email…"), "priya")

    expect(screen.getByText("Priya Nair")).toBeInTheDocument()
    expect(screen.queryByText("Sarah Chen")).not.toBeInTheDocument()
    expect(screen.getByText("1 of 8 members")).toBeInTheDocument()
  })

  it("filters by role select", async () => {
    const user = userEvent.setup()
    render(<SearchFilterBar />)

    await user.click(screen.getByRole("combobox", { name: "Filter by role" }))
    await user.click(await screen.findByRole("option", { name: "admin" }))

    // 2 admins: Sarah, Priya
    expect(screen.getByText("2 of 8 members")).toBeInTheDocument()
    expect(screen.queryByText("Mike Johnson")).not.toBeInTheDocument()
  })

  it("clears all filters", async () => {
    const user = userEvent.setup()
    render(<SearchFilterBar />)

    await user.type(screen.getByPlaceholderText("Search name or email…"), "zzz")
    expect(screen.getByText("No members match")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /clear/i }))
    expect(screen.getByText("8 of 8 members")).toBeInTheDocument()
  })
})
