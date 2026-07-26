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

## Narrow breakpoint shared with DataFilter

`NARROW_BREAKPOINT = 448` is deliberately the same constant `data-filter.tsx`
uses for its own narrow-mode threshold, so the common case (`DataGrid` and
`DataFilter` mounted together in one narrow pane) flips to their narrow
layouts together — even though each component measures its own container
independently. If the two ever need to diverge, this coupling is implicit or
only enforced by convention (each file just re-declares the literal `448`).
