import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { fillPct, type Bin } from "../data"

const STATUS_BADGE_VARIANT: Record<
  Exclude<Bin["status"], "active">,
  "outline" | "secondary"
> = {
  blocked: "outline",
  quarantine: "secondary",
}

function BinCell({ bin, onSelect }: { bin: Bin; onSelect: (bin: Bin) => void }) {
  const pct = fillPct(bin)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={() => onSelect(bin)}
            aria-label={`Bin ${bin.code}`}
            className="relative flex aspect-square flex-col items-center justify-center gap-1 rounded-md border bg-card p-1 transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ gridRow: bin.row + 1, gridColumn: bin.col + 1 }}
          />
        }
      >
        {bin.status !== "active" && (
          <Badge
            variant={STATUS_BADGE_VARIANT[bin.status]}
            className="absolute -top-2 -right-2 px-1 text-[9px]"
          >
            {bin.status}
          </Badge>
        )}
        <span className="w-full truncate text-center text-[10px] font-medium">
          {bin.code}
        </span>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {bin.code} · {bin.status} · {bin.qty}/{bin.capacity}
        {bin.sku ? ` · ${bin.sku}` : " · empty"}
      </TooltipContent>
    </Tooltip>
  )
}

export function BinGrid({
  bins,
  onSelect,
}: {
  bins: Bin[]
  onSelect: (bin: Bin) => void
}) {
  if (bins.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No bins</EmptyTitle>
          <EmptyDescription>
            Add a bin to start mapping this warehouse&apos;s floor.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const rows = Math.max(...bins.map((b) => b.row)) + 1
  const cols = Math.max(...bins.map((b) => b.col)) + 1

  return (
    <TooltipProvider>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(4rem, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(4rem, 1fr))`,
        }}
      >
        {bins.map((bin) => (
          <BinCell key={bin.id} bin={bin} onSelect={onSelect} />
        ))}
      </div>
    </TooltipProvider>
  )
}
