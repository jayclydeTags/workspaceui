import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { InvoiceDetail } from "../page"

describe("InvoiceDetail", () => {
  it("shows the invoice list with no detail pane open", () => {
    render(<InvoiceDetail />)
    expect(screen.getByText("Bluepeak Logistics")).toBeInTheDocument()
    expect(screen.queryByText("INV-1042", { selector: "h1, [role=tab]" })).not.toBeInTheDocument()
  })

  it("opens an invoice detail tab when a row is selected", async () => {
    const user = userEvent.setup()
    render(<InvoiceDetail />)

    await user.click(screen.getByText("Bluepeak Logistics"))

    expect(screen.getByRole("tab", { name: "INV-1042" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Bluepeak Logistics" })).toBeInTheDocument()
    expect(screen.getByText("Warehouse management license")).toBeInTheDocument()
  })

  it("filters the invoice list by search", async () => {
    const user = userEvent.setup()
    render(<InvoiceDetail />)

    await user.type(screen.getByPlaceholderText("Search invoices…"), "Northwind")

    expect(screen.getByText("Northwind Traders")).toBeInTheDocument()
    expect(screen.queryByText("Bluepeak Logistics")).not.toBeInTheDocument()
  })

  it("switches between two opened invoices", async () => {
    const user = userEvent.setup()
    render(<InvoiceDetail />)

    await user.click(screen.getByText("Bluepeak Logistics"))
    await user.click(screen.getByText("Northwind Traders"))

    expect(screen.getByRole("tab", { name: "INV-1042" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "INV-1043" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Northwind Traders" })).toBeInTheDocument()
  })
})
