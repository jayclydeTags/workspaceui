import { useEffect } from "react"
import { useNavigate } from "react-router"

import { blocks } from "@/lib/blocks"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

// Group blocks by category once — the manifest is static.
const groups = Object.entries(
  blocks.reduce<Record<string, typeof blocks>>((acc, b) => {
    ;(acc[b.category] ??= []).push(b)
    return acc
  }, {})
)

export function BlockCommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  function go(slug: string) {
    onOpenChange(false)
    navigate(`/blocks/${slug}`)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Search blocks..." />
        <CommandList>
          <CommandEmpty>No blocks found.</CommandEmpty>
          {groups.map(([category, items]) => (
            <CommandGroup key={category} heading={category}>
              {items.map((b) => (
                <CommandItem
                  key={b.slug}
                  value={`${b.title} ${b.category}`}
                  onSelect={() => go(b.slug)}
                >
                  {b.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
