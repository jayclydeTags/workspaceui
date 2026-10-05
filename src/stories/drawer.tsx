"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  swipeDirection: "down" | "up" | "left" | "right"
  showSwipeHandle: boolean
}

function Preview({
  title,
  description,
  swipeDirection,
  showSwipeHandle,
}: Args) {
  return (
    // The swipe direction is read at mount, so a new value remounts the drawer.
    <Drawer
      key={swipeDirection}
      swipeDirection={swipeDirection}
      showSwipeHandle={showSwipeHandle}
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose render={<Button variant="outline" />}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default defineStory<Args>({
  args: {
    title: "Move goal",
    description: "Set your daily activity goal.",
    swipeDirection: "down",
    showSwipeHandle: true,
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    swipeDirection: {
      type: "select",
      group: "style",
      options: ["down", "up", "left", "right"],
      description:
        "Which edge it slides from and the direction you swipe to dismiss.",
    },
    showSwipeHandle: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
