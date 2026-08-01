import { fireEvent } from "@testing-library/react"
import { vi } from "vitest"

/**
 * Stub an element's getBoundingClientRect so dnd-kit's rectIntersection
 * collision detection has real numbers to compare, since jsdom reports
 * every element as a 0×0 box at (0, 0).
 */
export function mockRect(el: Element, r: Partial<Omit<DOMRect, "toJSON">>) {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
    ...r,
  } as DOMRect)
}

/**
 * Drive a real dnd-kit PointerSensor drag: pointerdown on `card`, then a
 * pointermove far enough that the card's (rect-mocked) collision box lands
 * inside `target`'s (rect-mocked) box, then pointerup. Requires both
 * elements' rects to be stubbed via `mockRect` first. Async: dnd-kit's sensor
 * removes its document-level listeners on a 50ms timeout after pointerup, so
 * this waits it out — otherwise that listener (which stops click propagation
 * while a drag is live) can swallow an unrelated click in the next test.
 */
const nativeGetBoundingClientRect = Element.prototype.getBoundingClientRect

export async function dragCard(card: Element, target: Element) {
  const cardRect = card.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const from = {
    x: (cardRect.left + cardRect.right) / 2,
    y: (cardRect.top + cardRect.bottom) / 2,
  }
  const to = {
    x: (targetRect.left + targetRect.right) / 2,
    y: (targetRect.top + targetRect.bottom) / 2,
  }

  // A board with a <DragOverlay> mounts a fresh clone node once the drag
  // activates; dnd-kit measures *that* node's rect for collision math
  // instead of the original card's, and jsdom never lays it out (always
  // 0×0). Stand in with the card's own (already-stubbed) rect for the
  // overlay clone — identified by BoardCard's `data-overlay` marker —
  // everything else keeps jsdom's real (0×0) behavior.
  const overlayRectStub = vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      if (this instanceof HTMLElement && this.dataset.overlay !== undefined) {
        return card.getBoundingClientRect()
      }
      return nativeGetBoundingClientRect.call(this)
    })

  fireEvent.pointerDown(card, {
    pointerId: 1,
    button: 0,
    isPrimary: true,
    clientX: from.x,
    clientY: from.y,
  })
  // PointerSensor uses a distance activation constraint (see board pages) so
  // a plain click on nested buttons doesn't arm a drag: the first move past
  // that threshold only activates the drag, it doesn't reposition anything.
  // Fire it twice so the second move actually reports the target coordinates.
  const move = () =>
    fireEvent.pointerMove(document, {
      pointerId: 1,
      clientX: to.x,
      clientY: to.y,
    })
  move()
  move()
  fireEvent.pointerUp(document, { pointerId: 1 })
  await new Promise((resolve) => setTimeout(resolve, 60))
  overlayRectStub.mockRestore()
}
