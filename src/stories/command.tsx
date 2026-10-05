"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { defineStory } from "@/components/studio/studio"

interface Args {
  placeholder: string
  shortcuts: boolean
  groups: boolean
}

function Preview({ placeholder, shortcuts, groups }: Args) {
  return (
    <div className="w-80 rounded-xl border">
      <Command>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={groups ? "Suggestions" : undefined}>
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          {groups && <CommandSeparator />}
          <CommandGroup heading={groups ? "Settings" : undefined}>
            <CommandItem>
              Profile
              {shortcuts && <CommandShortcut>⌘P</CommandShortcut>}
            </CommandItem>
            <CommandItem>
              Billing
              {shortcuts && <CommandShortcut>⌘B</CommandShortcut>}
            </CommandItem>
            <CommandItem>
              Settings
              {shortcuts && <CommandShortcut>⌘S</CommandShortcut>}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export default defineStory<Args>({
  args: {
    placeholder: "Type a command or search…",
    shortcuts: true,
    groups: true,
  },
  controls: {
    placeholder: { type: "text" },
    shortcuts: { type: "boolean", group: "style" },
    groups: {
      type: "boolean",
      group: "style",
      description: "Group headings and a separator.",
    },
  },
  preview: Preview,
})
