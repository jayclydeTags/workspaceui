import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import {
  OnboardingChecklist,
  type OnboardingStep,
} from "../onboarding-checklist"

const steps: OnboardingStep[] = [
  { id: "profile", title: "Complete your profile", completed: true },
  {
    id: "invite",
    title: "Invite your team",
    description: "Collaborate with teammates.",
    action: <button type="button">Invite</button>,
  },
  {
    id: "connect",
    title: "Connect a data source",
    description: "Pull in your first records.",
  },
]

describe("OnboardingChecklist", () => {
  it("shows progress and marks step state in text", () => {
    render(<OnboardingChecklist steps={steps} />)
    expect(
      screen.getByRole("region", { name: "Get started" })
    ).toBeInTheDocument()
    expect(screen.getByText("1 of 3 complete")).toBeInTheDocument()
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "1 of 3 steps complete"
    )
    expect(
      screen.getByRole("button", {
        name: /complete your profile\s*\(complete\)/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /invite your team\s*\(to do\)/i })
    ).toBeInTheDocument()
  })

  it("expands the first incomplete step by default", () => {
    render(<OnboardingChecklist steps={steps} />)
    expect(
      screen.getByRole("button", { name: /invite your team/i })
    ).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Collaborate with teammates.")).toBeVisible()
    expect(screen.getByRole("button", { name: "Invite" })).toBeVisible()
    expect(
      screen.getByRole("button", { name: /connect a data source/i })
    ).toHaveAttribute("aria-expanded", "false")
  })

  it("opens one step at a time and can collapse all", async () => {
    const user = userEvent.setup()
    render(<OnboardingChecklist steps={steps} />)
    const invite = screen.getByRole("button", { name: /invite your team/i })
    const connect = screen.getByRole("button", {
      name: /connect a data source/i,
    })

    await user.click(connect)
    expect(connect).toHaveAttribute("aria-expanded", "true")
    expect(invite).toHaveAttribute("aria-expanded", "false")

    await user.click(connect)
    expect(connect).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByText("Pull in your first records.")).not.toBeVisible()
  })

  it("does not make steps without a body expandable", () => {
    render(<OnboardingChecklist steps={steps} />)
    expect(
      screen.getByRole("button", { name: /complete your profile/i })
    ).not.toHaveAttribute("aria-expanded")
  })

  it("renders a dismiss control only when onDismiss is passed", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<OnboardingChecklist steps={steps} />)
    expect(
      screen.queryByRole("button", { name: "Dismiss checklist" })
    ).not.toBeInTheDocument()

    const onDismiss = vi.fn()
    rerender(<OnboardingChecklist steps={steps} onDismiss={onDismiss} />)
    await user.click(screen.getByRole("button", { name: "Dismiss checklist" }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it("replaces the list with the complete message when every step is done", () => {
    render(
      <OnboardingChecklist
        title="Setup"
        steps={steps.map((s) => ({ ...s, completed: true }))}
        completeMessage="All done!"
      />
    )
    const region = screen.getByRole("region", { name: "Setup" })
    expect(within(region).getByText("All done!")).toBeInTheDocument()
    expect(within(region).queryByRole("list")).not.toBeInTheDocument()
    expect(within(region).getByText("3 of 3 complete")).toBeInTheDocument()
  })
})
