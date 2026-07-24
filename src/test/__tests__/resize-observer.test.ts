import { describe, expect, it, vi } from "vitest"

import { resizeTo } from "@/test/setup"

describe("ResizeObserver test stub", () => {
  it("drives an observed element's callback with the given width", () => {
    const el = document.createElement("div")
    const cb = vi.fn()
    const ro = new ResizeObserver(cb)
    ro.observe(el)

    resizeTo(el, 320)

    expect(cb).toHaveBeenCalledTimes(1)
    const [entries] = cb.mock.calls[0]
    expect(entries[0].target).toBe(el)
    expect(entries[0].contentRect.width).toBe(320)
    expect(entries[0].borderBoxSize[0].inlineSize).toBe(320)
    expect(el.getBoundingClientRect().width).toBe(320)
  })

  it("stops driving after unobserve and disconnect", () => {
    const el = document.createElement("div")
    const cb = vi.fn()
    const ro = new ResizeObserver(cb)

    ro.observe(el)
    ro.unobserve(el)
    resizeTo(el, 100)
    expect(cb).not.toHaveBeenCalled()

    ro.observe(el)
    ro.disconnect()
    resizeTo(el, 100)
    expect(cb).not.toHaveBeenCalled()
  })
})
