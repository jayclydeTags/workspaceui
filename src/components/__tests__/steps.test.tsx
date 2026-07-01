import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Step, Steps } from "@/components/steps"

describe("Steps", () => {
  it("does not nest a heading inside Step", () => {
    const { container } = render(
      <Steps>
        <Step>
          <h3>Install dependencies</h3>
        </Step>
      </Steps>
    )

    expect(container.querySelectorAll("h3").length).toBe(1)
  })
})
