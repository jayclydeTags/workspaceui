"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  side: "top" | "right" | "bottom" | "left"
  showCloseButton: boolean
}

function Preview({ title, description, side, showCloseButton }: Args) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default defineStory<Args>({
  args: {
    title: "Edit profile",
    description: "Make changes to your profile here.",
    side: "right",
    showCloseButton: true,
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    side: {
      type: "select",
      group: "style",
      options: ["top", "right", "bottom", "left"],
    },
    showCloseButton: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
