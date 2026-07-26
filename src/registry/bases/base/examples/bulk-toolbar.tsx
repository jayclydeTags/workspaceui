"use client"

import * as React from "react"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BulkToolbar } from "@/registry/bases/base/workspaceui/bulk-toolbar"

export function BulkToolbarDemo() {
  const [count, setCount] = React.useState(2)

  return (
    <div className="flex flex-col gap-3">
      <BulkToolbar count={count} onClear={() => setCount(0)}>
        <Button variant="outline" size="sm">
          <Trash2Icon data-icon="inline-start" />
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
