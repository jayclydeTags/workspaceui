"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

// Hero image + thumbnail strip. Clicking a thumbnail swaps the hero. The strip
// is hidden for single-screenshot templates (nothing to switch between).
export function Screenshots({ screenshots, title }: { screenshots: string[]; title: string }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
        <img
          src={screenshots[active]}
          alt={`${title} screenshot ${active + 1}`}
          className="aspect-[16/10] w-full object-cover"
        />
      </div>

      {screenshots.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {screenshots.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`View screenshot ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "aspect-[16/10] w-24 overflow-hidden rounded-md border transition",
                i === active ? "border-primary" : "border-border hover:border-primary/40"
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
