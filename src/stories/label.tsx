"use client"

import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { defineStory } from "@/components/studio/studio"

interface Args {
  text: string
}

function Preview({ text }: Args) {
  const id = useId()
  return (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor={id}>{text}</Label>
      <Input id={id} placeholder="Clicking the label focuses this" />
    </div>
  )
}

export default defineStory<Args>({
  args: { text: "Email address" },
  controls: { text: { type: "text" } },
  preview: Preview,
})
