"use client"

import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Alert01Icon,
  BellIcon,
  Compass01Icon,
  GitPullRequestIcon,
  GithubIcon,
  Logout01Icon,
  Search01Icon,
  Setting06Icon,
  SourceCodeSquareIcon,
  StoreIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

function PullRequestsIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={GitPullRequestIcon} {...props} strokeWidth={2} />
}
function IssuesIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Alert01Icon} {...props} strokeWidth={2} />
}
function MarketplaceIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={StoreIcon} {...props} strokeWidth={2} />
}
function ExploreIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Compass01Icon} {...props} strokeWidth={2} />
}

export const NAV_ITEMS = [
  { id: "pulls", title: "Pull requests", Icon: PullRequestsIcon },
  { id: "issues", title: "Issues", Icon: IssuesIcon },
  { id: "marketplace", title: "Marketplace", Icon: MarketplaceIcon },
  { id: "explore", title: "Explore", Icon: ExploreIcon },
] as const

export function TopNav({
  activeId,
  onNavClick,
}: {
  activeId: string
  onNavClick: (item: (typeof NAV_ITEMS)[number]) => void
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border px-4">
      <Button variant="ghost" size="icon" aria-label="Home">
        <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
      </Button>

      <InputGroup className="hidden w-64 sm:flex">
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        </InputGroupAddon>
        <InputGroupInput placeholder="Type / to search" />
      </InputGroup>

      <nav className="flex h-full items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavClick(item)}
              className={cn(
                "flex h-full items-center gap-1.5 border-b-2 border-transparent px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive && "border-foreground text-foreground"
              )}
            >
              <item.Icon className="size-4" />
              <span className="hidden md:inline">{item.title}</span>
            </button>
          )
        })}
      </nav>

      <div className="ms-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Create new" />
            }
          >
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>New repository</DropdownMenuItem>
              <DropdownMenuItem>New gist</DropdownMenuItem>
              <DropdownMenuItem>New organization</DropdownMenuItem>
              <DropdownMenuItem>Import repository</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <HugeiconsIcon icon={BellIcon} strokeWidth={2} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<button type="button" aria-label="Account menu" />}
          >
            <Avatar size="sm">
              <AvatarImage src="" alt="" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5 px-1.5 py-1">
                <span className="text-xs text-muted-foreground">
                  Signed in as
                </span>
                <span className="text-sm font-medium text-foreground">
                  jamie-doe
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={UserCircleIcon} strokeWidth={2} />
                Your profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={SourceCodeSquareIcon} strokeWidth={2} />
                Your repositories
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Setting06Icon} strokeWidth={2} />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
