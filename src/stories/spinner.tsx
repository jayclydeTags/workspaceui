"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { defineStory } from "@/components/studio/studio"

interface Args {
  context: "standalone" | "in a button"
}

function Preview({ context }: Args) {
  if (context === "in a button") {
    return (
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Saving
      </Button>
    )
  }
  return <Spinner />
}

export default defineStory<Args>({
  args: { context: "standalone" },
  controls: {
    context: {
      type: "select",
      group: "style",
      options: ["standalone", "in a button"],
      description:
        "Buttons have no loading prop; compose a Spinner and disable it.",
    },
  },
  preview: Preview,
})
