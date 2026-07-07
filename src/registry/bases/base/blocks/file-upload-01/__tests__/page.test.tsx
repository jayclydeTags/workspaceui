import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { FileUpload01 } from "../page"

describe("FileUpload01", () => {
  it("lists seeded attachments with formatted sizes and upload/error states", () => {
    render(<FileUpload01 />)
    expect(screen.getByText("4 files · 2 uploaded")).toBeInTheDocument()
    expect(screen.getByText("Q3-financials.pdf")).toBeInTheDocument()
    expect(screen.getByText("PDF · 2.3 MB")).toBeInTheDocument()
    expect(screen.getByText("Uploading · 62%")).toBeInTheDocument()
    expect(screen.getByText("Upload failed. Try again.")).toBeInTheDocument()
  })

  it("removes an attachment", async () => {
    const user = userEvent.setup()
    render(<FileUpload01 />)

    await user.click(
      screen.getByRole("button", { name: "Remove logo-final.png" })
    )

    expect(screen.queryByText("logo-final.png")).not.toBeInTheDocument()
    expect(screen.getByText(/^3 files/)).toBeInTheDocument()
  })

  it("adds files selected through the input", async () => {
    const user = userEvent.setup()
    render(<FileUpload01 />)

    const file = new File(["hello"], "notes.txt", { type: "text/plain" })
    await user.upload(screen.getByLabelText("Upload files"), file)

    expect(screen.getByText("notes.txt")).toBeInTheDocument()
    expect(screen.getByText(/^5 files/)).toBeInTheDocument()
  })

  it("retries a failed upload", async () => {
    const user = userEvent.setup()
    render(<FileUpload01 />)

    await user.click(
      screen.getByRole("button", { name: "Retry warehouse-photo.jpg" })
    )

    expect(
      screen.queryByText("Upload failed. Try again.")
    ).not.toBeInTheDocument()
    expect(screen.getByText("4 files · 3 uploaded")).toBeInTheDocument()
  })
})
