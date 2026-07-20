import "@testing-library/jest-dom"

// react-resizable-panels uses ResizeObserver; jsdom does not ship it.
window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
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
