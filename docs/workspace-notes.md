# Workspace — future improvements / known limitations

Notes extracted from inline comments in
`src/registry/bases/base/workspaceui/workspace.tsx` during a comment cleanup
pass.

## Panel sizes aren't part of `serialize()`/`restore()`

`WorkspaceSnapshot` only captures column/pane/tab structure, not panel
sizes — those are left to `react-resizable-panels`' own `autoSaveId`
mechanism instead of being persisted a second time through
`serialize()`/`restore()`. ponytail: if a consumer ever needs sizes bundled
into the same snapshot (e.g. to restore both structure and sizes from one
blob without wiring `autoSaveId` separately), `normalizeColumnSizes`'s output
would need to be captured in `PaneSnapshot`/`WorkspaceSnapshot` and applied
back on restore.
