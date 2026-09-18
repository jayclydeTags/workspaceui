"use client"

import { Button } from "@/components/ui/button"
import { UsageMeter } from "@/registry/bases/base/workspaceui/usage-meter"

const gb = (n: number) => n.toFixed(1)

export function UsageMeterDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-x-10 gap-y-6 sm:grid-cols-2">
      <UsageMeter
        label="API requests"
        used={42_180}
        limit={100_000}
        description="Resets Oct 1"
      />
      <UsageMeter
        label="Storage"
        used={8.7}
        limit={10}
        unit="GB"
        formatValue={gb}
        action={
          <Button size="xs" variant="outline">
            Add storage
          </Button>
        }
      />
      <UsageMeter
        label="Seats"
        used={12}
        limit={10}
        action={<Button size="xs">Upgrade plan</Button>}
      />
      <UsageMeter label="Projects" used={37} limit={null} />
    </div>
  )
}
