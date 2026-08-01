import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ApprovalBoard } from "../page"
import { dragCard, mockRect } from "@/test/dnd"

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

  it("moves a request to a new column on drop", async () => {
    render(<ApprovalBoard />)

    const card = screen
      .getByText("Client dinner — Q2 kickoff")
      .closest('[role="button"]')!
    const approvedColumn = screen
      .getByText("Approved")
      .closest("div")!.parentElement!

    mockRect(card, {
      left: 0,
      top: 0,
      right: 100,
      bottom: 50,
      width: 100,
      height: 50,
    })
    mockRect(approvedColumn, {
      left: 500,
      top: 0,
      right: 700,
      bottom: 400,
      width: 200,
      height: 400,
    })

    await dragCard(card, approvedColumn)

    expect(screen.getByText("2 pending review")).toBeInTheDocument()
  })
})
