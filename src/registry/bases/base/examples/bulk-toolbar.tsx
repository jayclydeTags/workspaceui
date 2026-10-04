"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { BulkToolbar } from "@/registry/bases/base/workspaceui/bulk-toolbar"

export function BulkToolbarDemo() {
  const [count, setCount] = React.useState(2)

  return (
    <div className="flex flex-col gap-3">
      <BulkToolbar count={count} onClear={() => setCount(0)}>
        <Button variant="destructive" size="sm">
          <HugeiconsIcon
            icon={Delete02Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Delete
        </Button>
      </BulkToolbar>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCount((c) => c + 1)}
      >
        Select one more
      </Button>
    </div>
  )
}
