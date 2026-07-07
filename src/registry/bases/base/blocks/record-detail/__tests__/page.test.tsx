import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { RecordDetail } from "../page"

describe("RecordDetail", () => {
  it("renders the record header and grouped fields", () => {
    render(<RecordDetail />)
    expect(screen.getByText("Priya Nair")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("Employment")).toBeInTheDocument()
    expect(screen.getByText("Contact")).toBeInTheDocument()
    expect(screen.getByText("Emma Davis")).toBeInTheDocument()
    expect(screen.getByText("Record ID: EMP-1042")).toBeInTheDocument()
  })
})
