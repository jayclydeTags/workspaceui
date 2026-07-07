import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { ImportExport } from "../page"
import { autoMap, parseCsv, SAMPLE_CSV, TARGET_FIELDS } from "../data"

describe("parseCsv / autoMap", () => {
  it("parses headers and rows and auto-maps matching columns", () => {
    const { headers, rows } = parseCsv(SAMPLE_CSV)
    expect(headers).toEqual(["name", "email", "role", "department"])
    expect(rows).toHaveLength(5)
    expect(rows[0][0]).toBe("Ada Lovelace")

    const map = autoMap(headers, TARGET_FIELDS)
    expect(map.name).toBe(0)
    expect(map.email).toBe(1)
  })

  it("ignores blank lines", () => {
    expect(parseCsv("a,b\n1,2\n\n3,4\n").rows).toHaveLength(2)
  })
})

describe("ImportExport", () => {
  it("walks the upload → map → done wizard", async () => {
    const user = userEvent.setup()
    render(<ImportExport />)

    // Step 1: load sample and continue
    await user.click(screen.getByRole("button", { name: /load sample/i }))
    await user.click(screen.getByRole("button", { name: /continue/i }))

    // Step 2: preview shows mapped data
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /import 5 records/i }))

    // Step 3: success
    expect(screen.getByText("Import complete")).toBeInTheDocument()
    expect(
      screen.getByText("Imported 5 records successfully.")
    ).toBeInTheDocument()
  })

  it("disables Continue until CSV is entered", () => {
    render(<ImportExport />)
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled()
  })
})
