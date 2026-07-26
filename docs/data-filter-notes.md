# DataFilter — future improvements / known limitations

Notes extracted from inline comments in
`src/registry/bases/base/workspaceui/data-filter.tsx` during a comment
cleanup pass.

## `dataGridFilterFn`'s `FilterFn<any>` typing

ponytail: `dataGridFilterFn` is typed `FilterFn<any>` (with an eslint-disable
for `no-explicit-any`), matching TanStack's own documented pattern for a
filterFn meant to be assigned across arbitrary tables. `Row<TData>`'s
variance rejects a real generic (or `unknown`) at the
`ColumnDef<Employee>`-style assignment site a consumer uses. This is a
permanent TypeScript-variance ceiling, not something expected to be
"upgraded" later — noted here mainly so a future reader doesn't mistake the
`any` for an oversight.

## Narrow breakpoint shared with DataGrid

`NARROW_BREAKPOINT = 448` intentionally matches `data-grid.tsx`'s own
constant, so `DataFilter` and `DataGrid` — when mounted together in one
narrow pane — flip to their narrow layouts together, even though each
measures its own container independently via its own `ResizeObserver`. If
the two ever need to diverge, this is currently just a convention (each file
re-declares the literal `448`), not an enforced shared constant.
