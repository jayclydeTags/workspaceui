# Bin / Location Map — floor redesign prototype

**Question:** The old floor was a generic square grid. What should it look like so
it reads as an actual warehouse instead of a spreadsheet?

**Shape:** UI prototype, sub-shape A. Three variants render on the real block
preview route, switchable via `?variant=` and a floating bottom bar (dev-only).

Preview: `pnpm dev` → `/blocks/preview/bin-location-map?variant=A` (or B / C).
← / → arrow keys cycle. All bin interactions (click → detail sheet, assign,
status hatching, heat colours) work in every variant.

## Variants — round 2 (A+B fusion, per user pick)

User liked round-1 A (top-down floor plan) and B (side elevation) and asked to
combine them. All three below keep A's warehouse shell (walls, R labels, aisle
lanes, receiving/shipping, dock doors) and fold in B's stock-height read:

- **A — Floor plan · rack-slot loads.** Each position is a rack slot with the load
  rising from the floor edge (stock height = fill %). Overview map.
- **B — Map + side elevation strip.** Top-down footprint row PLUS a side-profile
  strip of load-height bars on a floor line under each rack run. Dual projection.
- **C — Detailed floor (SKU on slot).** Same fusion as A but taller slots surface
  the SKU inline — a working operator view rather than an overview.

Shared: green/amber/red occupancy heat, hatched overlay for blocked/quarantine,
cell track capped at `minmax(4rem,7rem)` so slots no longer stretch on wide screens.

## Verdict

_PENDING — waiting on user pick among A / B / C above._
Once chosen: fold the winner into `bin-grid.tsx`, delete `bin-floor-variants.tsx`,
the losing variants, and the switcher.
