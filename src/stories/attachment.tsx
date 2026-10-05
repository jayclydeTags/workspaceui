"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, File01Icon } from "@hugeicons/core-free-icons"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"
import { defineStory } from "@/components/studio/studio"

type State = "idle" | "uploading" | "processing" | "error" | "done"

interface Args {
  title: string
  description: string
  actions: boolean
  state: State
  size: "default" | "sm" | "xs"
  orientation: "horizontal" | "vertical"
}

function Preview({
  title,
  description,
  actions,
  state,
  size,
  orientation,
}: Args) {
  const busy = state === "uploading" || state === "processing"
  return (
    <Attachment state={state} size={size} orientation={orientation}>
      <AttachmentMedia>
        {busy ? (
          <Spinner />
        ) : (
          <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{title}</AttachmentTitle>
        {description && (
          <AttachmentDescription>{description}</AttachmentDescription>
        )}
      </AttachmentContent>
      {actions && (
        <AttachmentActions>
          <AttachmentAction variant="ghost" aria-label="Remove attachment">
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </AttachmentAction>
        </AttachmentActions>
      )}
    </Attachment>
  )
}

export default defineStory<Args>({
  args: {
    title: "quarterly-report.pdf",
    description: "2.4 MB",
    actions: true,
    state: "done",
    size: "default",
    orientation: "horizontal",
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    actions: { type: "boolean", description: "A remove action." },
    state: {
      type: "select",
      group: "style",
      options: ["idle", "uploading", "processing", "error", "done"],
    },
    size: { type: "select", group: "style", options: ["default", "sm", "xs"] },
    orientation: {
      type: "select",
      group: "style",
      options: ["horizontal", "vertical"],
    },
  },
  preview: Preview,
})
