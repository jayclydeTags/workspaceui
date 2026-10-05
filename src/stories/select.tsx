"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { defineStory } from "@/components/studio/studio"

interface Args {
  placeholder: string
  size: "default" | "sm"
  disabled: boolean
}

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
]

function Preview({ placeholder, size, disabled }: Args) {
  return (
    <Select items={FRUITS} disabled={disabled}>
      <SelectTrigger size={size} aria-label="Fruit" className="w-48">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {FRUITS.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default defineStory<Args>({
  args: { placeholder: "Select a fruit", size: "default", disabled: false },
  controls: {
    placeholder: { type: "text" },
    size: { type: "select", group: "style", options: ["default", "sm"] },
    disabled: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
