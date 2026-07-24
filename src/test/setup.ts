import "@testing-library/jest-dom"

// react-resizable-panels uses ResizeObserver; jsdom does not ship it. Stateful
// rather than a no-op (like the pointer-capture mocks below) so container-width
// branches — data-grid's narrow card list, data-filter's sheet toolbar — are
// testable at all: `resizeTo(el, 320)` fires a width at an observed element.
// A WeakMap (like that mock) because observed elements are usually detached by
// the time a test ends and nothing clears the registry, keyed on the observer
// instance rather than the callback so two observers sharing one function
// reference can't unobserve each other.
type StubObserver = { callback: ResizeObserverCallback; elements: Set<Element> }
const observers = new WeakMap<Element, Set<StubObserver>>()

window.ResizeObserver = class ResizeObserver {
  private self: StubObserver
  constructor(callback: ResizeObserverCallback) {
    this.self = { callback, elements: new Set() }
  }
  observe(el: Element) {
    const set = observers.get(el) ?? new Set<StubObserver>()
    set.add(this.self)
    observers.set(el, set)
    this.self.elements.add(el)
  }
  unobserve(el: Element) {
    observers.get(el)?.delete(this.self)
    this.self.elements.delete(el)
  }
  disconnect() {
    for (const el of this.self.elements) observers.get(el)?.delete(this.self)
    this.self.elements.clear()
  }
}

/**
 * Fire a width at an element being observed by a ResizeObserver, synchronously
 * invoking every callback watching it. Height is left at 0 — nothing keys off
 * it. Does not touch the element's box: faking layout is `stubLayout()`'s job
 * (see workspace.test.tsx), and a second source of own-property rects would
 * silently outrank its prototype stub.
 */
export function resizeTo(el: Element, width: number) {
  // All three box arrays are populated: a consumer reading contentBoxSize
  // instead of borderBoxSize shouldn't crash on an undefined index.
  const box = [{ inlineSize: width, blockSize: 0 }]
  const entry = {
    target: el,
    contentRect: DOMRectReadOnly.fromRect({ width }),
    borderBoxSize: box,
    contentBoxSize: box,
    devicePixelContentBoxSize: box,
  } as ResizeObserverEntry
  for (const o of observers.get(el) ?? [])
    o.callback([entry], null as unknown as ResizeObserver)
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
