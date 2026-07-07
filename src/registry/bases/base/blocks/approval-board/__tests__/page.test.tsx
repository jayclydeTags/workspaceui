import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import { ApprovalBoard } from "../page"

function makeDataTransfer(id: string) {
  return {
    setData: vi.fn(),
    getData: vi.fn(() => id),
    effectAllowed: "",
  }
}

describe("ApprovalBoard", () => {
  it("groups requests into their status columns", () => {
    render(<ApprovalBoard />)

    expect(screen.getByText("Pending Review")).toBeInTheDocument()
    expect(screen.getByText("Client dinner — Q2 kickoff")).toBeInTheDocument()
    expect(screen.getByText("Conference travel — SaaStr")).toBeInTheDocument()
    expect(screen.getByText("Sick leave — Jun 22")).toBeInTheDocument()
  })

  it("shows the count of pending requests in the subtitle", () => {
    render(<ApprovalBoard />)
    expect(screen.getByText("3 pending review")).toBeInTheDocument()
  })

  it("moves a request to a new column on drop", () => {
    render(<ApprovalBoard />)

    const card = screen.getByText("Client dinner — Q2 kickoff").closest("[draggable]")!
    const approvedColumn = screen.getByText("Approved").closest("div")!.parentElement!

    const dataTransfer = makeDataTransfer("req-1")
    fireEvent.dragStart(card, { dataTransfer })
    fireEvent.drop(approvedColumn, { dataTransfer })

    expect(screen.getByText("2 pending review")).toBeInTheDocument()
  })
})
