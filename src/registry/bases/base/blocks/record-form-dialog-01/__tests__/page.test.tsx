import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { RecordFormDialog01 } from "../page"

describe("RecordFormDialog01", () => {
  it("lists the seeded contacts", () => {
    render(<RecordFormDialog01 />)
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
    expect(screen.getByText("3 contacts")).toBeInTheDocument()
  })

  it("creates a new contact", async () => {
    const user = userEvent.setup()
    render(<RecordFormDialog01 />)

    await user.click(screen.getByRole("button", { name: /new contact/i }))
    await user.type(screen.getByLabelText("Name"), "Margaret Hamilton")
    await user.type(screen.getByLabelText("Email"), "margaret@nasa.gov")
    await user.type(screen.getByLabelText("Company"), "NASA")
    await user.click(screen.getByRole("button", { name: "Create contact" }))

    expect(screen.getByText("Margaret Hamilton")).toBeInTheDocument()
    expect(screen.getByText("4 contacts")).toBeInTheDocument()
  })

  it("edits an existing contact using the same form", async () => {
    const user = userEvent.setup()
    render(<RecordFormDialog01 />)

    const row = screen.getByText("Grace Hopper").closest("li")!
    await user.click(within(row).getByRole("button", { name: "Edit" }))

    const nameInput = screen.getByLabelText("Name")
    await user.clear(nameInput)
    await user.type(nameInput, "Grace M. Hopper")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getByText("Grace M. Hopper")).toBeInTheDocument()
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument()
  })
})
