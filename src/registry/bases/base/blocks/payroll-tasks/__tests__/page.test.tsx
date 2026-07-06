import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { PayrollTasks } from "../page"
import { TASKS, countByStatus } from "../data"

describe("PayrollTasks", () => {
  it("renders overview counts and every task", () => {
    render(<PayrollTasks />)
    const counts = countByStatus(TASKS)
    // First "Overdue" in DOM is the overview card label; its sibling is the count.
    expect(screen.getAllByText("Overdue")[0].nextSibling).toHaveTextContent(
      String(counts.overdue)
    )
    for (const t of TASKS) {
      expect(screen.getByText(t.title)).toBeInTheDocument()
    }
  })

  it("requires a summary before completing a task", async () => {
    const user = userEvent.setup()
    render(<PayrollTasks />)

    // Open the first incomplete task's complete dialog.
    await user.click(screen.getAllByRole("button", { name: "Complete" })[0])
    const dialog = screen.getByRole("dialog")

    const markComplete = within(dialog).getByRole("button", {
      name: "Mark complete",
    })
    expect(markComplete).toBeDisabled() // conditional button

    await user.type(within(dialog).getByLabelText("Summary"), "Reviewed and approved.")
    expect(markComplete).toBeEnabled()
  })
})
