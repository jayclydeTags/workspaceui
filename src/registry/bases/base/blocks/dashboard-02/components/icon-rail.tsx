"use client"

import type { ComponentProps, ComponentType } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  CheckListIcon,
  Home01Icon,
  InboxIcon,
  Logout01Icon,
  Setting06Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function HomeIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Home01Icon} {...props} strokeWidth={2} />
}
function TasksIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={CheckListIcon} {...props} strokeWidth={2} />
}
function CalendarIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Calendar01Icon} {...props} strokeWidth={2} />
}
function InboxNavIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={InboxIcon} {...props} strokeWidth={2} />
}
function SettingsIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Setting06Icon} {...props} strokeWidth={2} />
}

export const NAV_ITEMS = [
  { id: "home", title: "Home", Icon: HomeIcon },
  { id: "inbox", title: "Inbox", Icon: InboxNavIcon },
  { id: "tasks", title: "Tasks", Icon: TasksIcon },
  { id: "calendar", title: "Calendar", Icon: CalendarIcon },
] as const

export const SETTINGS_ITEM = {
  id: "settings",
  title: "Settings",
  Icon: SettingsIcon,
}

function RailButton({
  title,
  Icon,
  isActive,
  onClick,
}: {
  title: string
  Icon: ComponentType<{ className?: string }>
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={title}
            aria-current={isActive ? "page" : undefined}
            onClick={onClick}
            className={cn(
              "flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-accent text-accent-foreground"
            )}
          />
        }
      >
        <Icon className="size-4.5" />
      </TooltipTrigger>
      <TooltipContent side="right">{title}</TooltipContent>
    </Tooltip>
  )
}

export function IconRail({
  activeId,
  onNavClick,
}: {
  activeId: string
  onNavClick: (item: { id: string; title: string }) => void
}) {
  return (
    <nav className="flex w-14 shrink-0 flex-col items-center gap-1 border-e border-border py-3">
      <div className="flex flex-1 flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <RailButton
            key={item.id}
            title={item.title}
            Icon={item.Icon}
            isActive={item.id === activeId}
            onClick={() => onNavClick(item)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-1">
        <RailButton
          title={SETTINGS_ITEM.title}
          Icon={SETTINGS_ITEM.Icon}
          isActive={SETTINGS_ITEM.id === activeId}
          onClick={() => onNavClick(SETTINGS_ITEM)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<button type="button" aria-label="Account menu" />}
          >
            <Avatar size="sm">
              <AvatarImage src="" alt="" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5 px-1.5 py-1">
                <span className="text-sm font-medium text-foreground">
                  Jamie Doe
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  jamie@example.com
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={UserCircleIcon} strokeWidth={2} />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
