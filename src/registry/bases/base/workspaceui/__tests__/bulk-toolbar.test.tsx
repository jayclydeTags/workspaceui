import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { BulkToolbar } from "@/registry/bases/base/workspaceui/bulk-toolbar"

describe("BulkToolbar", () => {
  it("renders nothing when count is 0", () => {
    const { container } = render(
      <BulkToolbar count={0} onClear={() => {}}>
        <button>Delete</button>
      </BulkToolbar>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("renders the count and children when count is greater than 0", () => {
    render(
      <BulkToolbar count={3} onClear={() => {}}>
        <button>Delete</button>
      </BulkToolbar>
    )
    expect(screen.getByText("3 selected")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })

  it("calls onClear when the clear button is clicked", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(
      <BulkToolbar count={2} onClear={onClear}>
        <button>Delete</button>
      </BulkToolbar>
    )
    await user.click(screen.getByRole("button", { name: "Clear selection" }))
    expect(onClear).toHaveBeenCalledOnce()
  })
})
