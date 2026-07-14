# Bin / Location Map — floor redesign prototype

**Question:** The old floor was a generic square grid. What should it look like so
it reads as an actual warehouse instead of a spreadsheet?

**Shape:** UI prototype, sub-shape A. Three variants render on the real block
preview route, switchable via `?variant=` and a floating bottom bar (dev-only).

Preview: `pnpm dev` → `/blocks/preview/bin-location-map?variant=A` (or B / C).
← / → arrow keys cycle. All bin interactions (click → detail sheet, assign,
status hatching, heat colours) work in every variant.

## Variants

- **A — Floor plan (aisles + docks).** Top-down map: rack runs (R1/R2), a labelled
  aisle lane between them, receiving/shipping walls, dock doors along the outbound
  edge, dotted floor. Reads most like a physical warehouse map.
- **B — Rack elevation (side view).** Each column is a shelving bay framed by
  uprights/beams, rows become levels (L1/L2), fill drawn as pallet load height.
  Reads like looking at racking from the side.
- **C — Zoned heatmap.** Floor split into functional column-band zones (Fast pick /
  Bulk reserve / Overflow) with an occupancy heat legend. Best for "where's my
  capacity" at a glance.

Shared: green/amber/red occupancy heat, hatched overlay for blocked/quarantine.

## Verdict

_PENDING — waiting on user pick._ Likely "A for the map with the heat legend from C."
Once chosen: fold the winner into `bin-grid.tsx`, delete `bin-floor-variants.tsx`,
the losing variants, and the switcher. Tune cell density for the winner (A and C
cells stretch large on wide containers — cap with a `max-w`/fixed track instead of
`1fr`).
