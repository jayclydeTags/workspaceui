"use client"

import { cn } from "@/lib/utils"
import { SETTINGS_SECTIONS, type SettingsSectionId } from "@/registry/bases/base/blocks/settings/data"

export function SettingsNav({
  activeId,
  onChange,
}: {
  activeId: SettingsSectionId
  onChange: (id: SettingsSectionId) => void
}) {
  return (
    <nav className="flex shrink-0 flex-col gap-1 border-r border-border p-3 @max-md:w-full @max-md:border-r-0 @max-md:border-b md:w-56">
      {SETTINGS_SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onChange(section.id)}
          className={cn(
            "flex flex-col gap-0.5 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
            activeId === section.id && "bg-muted font-medium"
          )}
        >
          <span>{section.label}</span>
          <span className="text-xs font-normal text-muted-foreground">{section.description}</span>
        </button>
      ))}
    </nav>
  )
}
