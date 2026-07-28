"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <HugeiconsIcon
        icon={Sun01Icon}
        strokeWidth={2}
        className="size-4 dark:hidden"
      />
      <HugeiconsIcon
        icon={Moon02Icon}
        strokeWidth={2}
        className="hidden size-4 dark:block"
      />
    </Button>
  )
}
