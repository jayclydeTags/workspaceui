"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { FolderOpenIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  action: boolean
  media: "default" | "icon"
}

function Preview({ title, description, action, media }: Args) {
  return (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMedia variant={media}>
          <HugeiconsIcon icon={FolderOpenIcon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button>Create project</Button>
        </EmptyContent>
      )}
    </Empty>
  )
}

export default defineStory<Args>({
  args: {
    title: "No projects yet",
    description: "Get started by creating your first project.",
    action: true,
    media: "icon",
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    action: { type: "boolean", description: "An action under the message." },
    media: { type: "select", group: "style", options: ["default", "icon"] },
  },
  preview: Preview,
})
