"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  footer: boolean
  showCloseButton: boolean
}

function Preview({ title, description, footer, showCloseButton }: Args) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {footer && (
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button>Save changes</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default defineStory<Args>({
  args: {
    title: "Edit profile",
    description:
      "Make changes to your profile here. Click save when you're done.",
    footer: true,
    showCloseButton: true,
  },
  controls: {
    title: {
      type: "text",
      description:
        "Required for accessibility; hide it with sr-only if needed.",
    },
    description: { type: "text" },
    footer: { type: "boolean", group: "style" },
    showCloseButton: {
      type: "boolean",
      group: "style",
      description: "The corner close button.",
    },
  },
  preview: Preview,
})
