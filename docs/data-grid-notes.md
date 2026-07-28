# DataGrid — future improvements / known limitations

Notes extracted from inline comments in
`src/registry/bases/base/workspaceui/data-grid.tsx` during a comment cleanup
pass, so the deferred-work context isn't lost even though it no longer lives
inline.

## Validation

`validateForType` only checks "required" (+ "must be a number" for
`number`/`currency`) — `boolean` never fails, since a checkbox has no invalid
state. This is the only validation until a real validation hook lands;
consumers wanting custom rules currently have to validate inside `onCellEdit`
and throw. ponytail: upgrade path is a `validate` prop/column-meta hook when a
real requirement shows up.

## Row add/delete has no pending/error UI

Unlike `onCellEdit`, `onRowAdd`/`onRowDelete` render no pending spinner or
error state of their own — the grid just clears `pendingAdd` on rejection so
a later unrelated row-count change can't be mistaken for the add landing.
ponytail: add pending/error UI for row add/delete if the spec ever asks for
it; until then, failures are silent from the grid's perspective (the promise
rejection is swallowed after clearing `pendingAdd`/deleteTarget).

## Cell-range selection not implemented

Row-level range selection (anchor + Shift+Click/Shift+Arrow) is implemented,
but cell-range selection (`Shift+Left`/`Shift+Right` extending a selection
across columns) is deliberately not implemented — those keys stay unbound.
Would need its own anchor/extent state independent of the row-selection
anchor if built.

## Fixed row height / future virtualization

The multiSelect cell's trigger caps visible chips at `maxChips` and shows a
"+N" overflow badge specifically to keep row height fixed. This is
deliberate: virtualizing the grid's rows (for very large datasets) depends on
every row reporting the same height, so any future editor UI must preserve
this fixed-height invariant rather than allowing wrapping content.

## Column drag-and-drop (Columns panel)

Dragging a column row live-mutates order on every `dragover` (the row slides
via `layout` on `motion.li`) instead of showing an insertion-line indicator —
this applies even when dragging across the visible/hidden boundary, which
reveals or hides the column live too. Drag state (`draggingColumnRef`,
`dragOriginal*Ref`, `droppedRef`) lives in refs rather than state since it's
only read inside drag handlers and doesn't need to trigger renders.

`columnDropTarget`'s "before"/"after" collapsing: each gap between two rows
is really one drop zone, not two (the row above's "after" and the row
below's "before" mean the same slot). Naive insert-before-target math would
also no-op on an adjacent swap (removing the dragged id shifts the target
back into the slot being inserted at), so "after" folds into the next row's
"before" instead of inserting relative to the raw hovered id.

`e.dataTransfer.setDragImage(row, ...)` in `handleColumnDragStart` makes the
browser's drag ghost the whole row, not just the grip icon that's actually
`draggable` — otherwise the default ghost is only the small icon.

The `dragend` listener is attached via `addEventListener` directly on the
grip handle in `handleColumnDragStart`, not as a React `onDragEnd` prop, for
two reasons: (1) `motion.li` intercepts the `onDragEnd`/`onDragStart` prop
names for its own (unrelated, gesture-based) drag system, so a prop placed
on it never reaches the DOM as a real listener; and (2) crossing the
visible/hidden boundary mid-drag remounts the row into the other `<ul>`
(two separate `.map()` calls, i.e. two separate React trees), detaching the
original node — the browser still fires native `dragend` on that original
node, but a listener relying on React's delegated root wouldn't receive it
from a detached node (no bubble path). A listener bound directly to the node
via `addEventListener` still receives it as the direct target regardless.

`hiddenOrder` exists because tanstack's `columnOrder` state only ever holds
visible ids in this component (every `setColumnOrder` call here passes a
visible-only array) — the hidden group needs its own order state to support
the same live-reorder behavior. It's synced against the actual hidden set
inline during render (comparing and calling `setHiddenOrder` if different)
rather than in a `useEffect`, so a hide/show is reflected in the very same
render instead of one tick later.

`applyColumnDrag` only hides a column via drag if `column.getCanHide()` is
true, matching the Hide button's own guard — revealing is always allowed.
`reorderColumnIds` inserts the dragged id even when it's absent from the
target group's current order (e.g. a visibility toggle that hasn't landed
in this render's table state yet), so the result is correct regardless of
that timing — this is also why re-running the same operation in
`handleColumnDrop` after `handleColumnDragOver` already applied it is a
harmless no-op rather than a double-move.

`handleColumnDragEnd` reverts order, hidden order, and visibility together
when a drag ends without a drop (dropped outside a valid row, or
cancelled) — since the live preview during dragover already mutated all
three, all three need to be restored from the snapshot taken at dragstart.

## Narrow breakpoint shared with DataFilter

`NARROW_BREAKPOINT = 448` is deliberately the same constant `data-filter.tsx`
uses for its own narrow-mode threshold, so the common case (`DataGrid` and
`DataFilter` mounted together in one narrow pane) flips to their narrow
layouts together — even though each component measures its own container
independently. If the two ever need to diverge, this coupling is implicit or
only enforced by convention (each file just re-declares the literal `448`).

## Toolbar shape, wide vs. narrow

The two branches deliberately expose the same four concerns (search, filter,
sort, column visibility) through different affordances, because the cards
branch has no header row to hang sort/pin/hide off:

- **Wide** — one row (search, then Filter and Columns buttons), plus a chip
  row with "Clear filters". Sort stays on the headers.
- **Narrow** — search inline with a single badge-counted **Options** button
  opening one sheet that stacks Sort, Filters, and Visible fields.

The narrow shape came out of a throwaway prototype (three option bars,
`?variant=`, deleted after the call) that weighed it against two alternatives:
three sibling drawer buttons (Sort / Filter / Fields), and a status-pill rail
with search on demand. The single sheet won on **vertical chrome** — it costs
one row instead of two on a 390px screen where the card list is the point —
and on **genericness**: the pill rail needs a status-like select column to
exist, which `DataGrid` can't assume. Its cost is that everything is two taps
deep rather than one.

Both branches only show search/filter when `getFilteredRowModel` is wired, and
sort when `getSortedRowModel` is — the same "never render a no-op affordance"
rule the column headers' sort button already followed.
