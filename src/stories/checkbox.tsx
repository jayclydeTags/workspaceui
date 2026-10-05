"use client"

import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { defineStory } from "@/components/studio/studio"

interface Args {
  label: string
  checked: boolean
  disabled: boolean
}

function Preview({ label, checked, disabled }: Args) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      {/* Uncontrolled, so a changed `checked` control remounts it. */}
      <Checkbox
        key={String(checked)}
        id={id}
        defaultChecked={checked}
        disabled={disabled}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

export default defineStory<Args>({
  args: {
    label: "Accept terms and conditions",
    checked: false,
    disabled: false,
  },
  controls: {
    label: { type: "text" },
    checked: { type: "boolean", label: "Initially checked" },
    disabled: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
