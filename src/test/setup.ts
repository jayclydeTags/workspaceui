import "@testing-library/jest-dom"

// react-resizable-panels uses ResizeObserver; jsdom does not ship it. Stateful
// rather than a no-op (like the pointer-capture mocks below) so container-width
// branches — data-grid's narrow card list, data-filter's sheet toolbar — are
// testable at all: `resizeTo(el, 320)` fires a width at an observed element.
const observed = new Map<Element, Set<ResizeObserverCallback>>()

window.ResizeObserver = class ResizeObserver {
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  observe(el: Element) {
    const cbs = observed.get(el) ?? new Set<ResizeObserverCallback>()
    cbs.add(this.callback)
    observed.set(el, cbs)
  }
  unobserve(el: Element) {
    observed.get(el)?.delete(this.callback)
  }
  disconnect() {
    for (const cbs of observed.values()) cbs.delete(this.callback)
  }
}

/**
 * Fire a width at an element being observed by a ResizeObserver, synchronously
 * invoking every callback watching it. Also pins the element's box so a
 * component that measures on mount (getBoundingClientRect) agrees with the
 * observer. Height is left at 0 — nothing here keys off it.
 */
export function resizeTo(el: Element, width: number) {
  const rect = { x: 0, y: 0, top: 0, left: 0, bottom: 0, height: 0, width, right: width } // prettier-ignore
  el.getBoundingClientRect = () => rect as DOMRect
  const entry = {
    target: el,
    contentRect: rect as DOMRectReadOnly,
    borderBoxSize: [{ inlineSize: width, blockSize: 0 }],
    contentBoxSize: [{ inlineSize: width, blockSize: 0 }],
    devicePixelContentBoxSize: [{ inlineSize: width, blockSize: 0 }],
  } as ResizeObserverEntry
  for (const cb of observed.get(el) ?? [])
    cb([entry], null as unknown as ResizeObserver)
}

// jsdom does not implement the pointer capture APIs the tab drag handler uses.
// Stateful rather than no-ops, so has/release round-trips are actually testable.
const captured = new WeakMap<Element, Set<number>>()
Element.prototype.setPointerCapture = function (pointerId: number) {
  const ids = captured.get(this) ?? new Set<number>()
  ids.add(pointerId)
  captured.set(this, ids)
}
Element.prototype.releasePointerCapture = function (pointerId: number) {
  captured.get(this)?.delete(pointerId)
}
Element.prototype.hasPointerCapture = function (pointerId: number) {
  return captured.get(this)?.has(pointerId) ?? false
}

// input-otp calls document.elementFromPoint in a timer for caret tracking; jsdom
// lacks it and throws an unhandled error after the test unmounts.
document.elementFromPoint = () => null
