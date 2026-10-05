"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { defineStory } from "@/components/studio/studio"

interface Args {
  multiple: boolean
  items: number
}

const ITEMS = [
  ["Is it accessible?", "Yes. It follows the WAI-ARIA accordion pattern."],
  ["Is it styled?", "Yes. It comes with default styles that match the theme."],
  ["Is it animated?", "Yes. It animates open and closed by default."],
  ["Can I restyle it?", "The source lives in your project, so edit it freely."],
]

function Preview({ multiple, items }: Args) {
  return (
    <Accordion
      key={String(multiple)}
      multiple={multiple}
      defaultValue={["item-0"]}
      className="w-80"
    >
      {ITEMS.slice(0, Math.min(Math.max(items, 1), ITEMS.length)).map(
        ([question, answer], i) => (
          <AccordionItem key={question} value={`item-${i}`}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        )
      )}
    </Accordion>
  )
}

export default defineStory<Args>({
  args: { multiple: false, items: 3 },
  controls: {
    items: { type: "number", min: 1, max: ITEMS.length },
    multiple: {
      type: "boolean",
      group: "style",
      description: "Allow several items open at once.",
    },
  },
  preview: Preview,
})
