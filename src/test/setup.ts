import "@testing-library/jest-dom"

// react-resizable-panels uses ResizeObserver; jsdom does not ship it.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom does not implement pointer capture APIs used by the tab drag handler.
Element.prototype.setPointerCapture = () => {}
Element.prototype.releasePointerCapture = () => {}
