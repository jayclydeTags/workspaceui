"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDocsSearch } from "fumadocs-core/search/client"
import { oramaStaticClient } from "fumadocs-core/search/client/orama-static"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

const client = oramaStaticClient({ from: "/api/search" })

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { search, setSearch, query } = useDocsSearch({ client, delayMs: 100 })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const results = query.data === "empty" || !query.data ? [] : query.data

  return (
    <>
      <Button
        variant="outline"
        className="h-8 w-full max-w-56 justify-start gap-2 rounded-full px-3 text-muted-foreground shadow-none sm:w-56"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4" />
        <span className="flex-1 text-left text-sm">Search documentation...</span>
        <kbd className="pointer-events-none hidden h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
          <span>⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search documentation..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {query.isLoading ? "Searching..." : "No results found."}
            </CommandEmpty>
            <CommandGroup heading="Pages">
              {results.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => {
                    setOpen(false)
                    router.push(item.url)
                  }}
                >
                  <div className="flex flex-col">
                    {item.breadcrumbs && item.breadcrumbs.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {item.breadcrumbs.join(" / ")}
                      </span>
                    )}
                    {/* item.content is markdown with trusted <mark> highlight tags,
                        generated server-side from our own static search index. */}
                    <span
                      className="[&_mark]:bg-primary/20 [&_mark]:text-foreground"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
