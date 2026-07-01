import { Search } from "lucide-react"
import { useSearchContext } from "fumadocs-ui/contexts/search"

import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform)

export function DocSearch() {
  const { setOpenSearch } = useSearchContext()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setOpenSearch(true)}
      className="w-52 justify-start gap-2 font-normal text-muted-foreground"
    >
      <Search className="size-3.5 shrink-0" />
      <span className="flex-1 text-left text-xs truncate">Search documentation...</span>
      <KbdGroup>
        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Button>
  )
}
