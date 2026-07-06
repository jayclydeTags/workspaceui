import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { CompensationTable01 } from "../page"
import { COMP_RECORDS } from "../data"

describe("CompensationTable01", () => {
  it("renders every compensation record", () => {
    render(<CompensationTable01 />)
    for (const r of COMP_RECORDS) {
      expect(screen.getByText(r.name)).toBeInTheDocument()
    }
  })

  it("filters rows by the search query", async () => {
    const user = userEvent.setup()
    render(<CompensationTable01 />)
    await user.type(
      screen.getByPlaceholderText(/search by name/i),
      "Priya"
    )
    expect(screen.getByText("Priya Nair")).toBeInTheDocument()
    expect(screen.queryByText("Sarah Chen")).not.toBeInTheDocument()
  })
})
