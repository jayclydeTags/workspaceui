"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { defineStory } from "@/components/studio/studio"

interface Args {
  shortcuts: boolean
  destructive: boolean
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
}

function Preview({ shortcuts, destructive, side, align }: Args) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            {shortcuts && <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            {shortcuts && <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            {shortcuts && <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {destructive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default defineStory<Args>({
  args: { shortcuts: true, destructive: true, side: "bottom", align: "start" },
  controls: {
    shortcuts: { type: "boolean", description: "DropdownMenuShortcut hints." },
    destructive: {
      type: "boolean",
      description: "A destructive item after a separator.",
    },
    side: {
      type: "select",
      group: "style",
      options: ["top", "right", "bottom", "left"],
    },
    align: {
      type: "select",
      group: "style",
      options: ["start", "center", "end"],
    },
  },
  preview: Preview,
})
