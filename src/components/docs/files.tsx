"use client"

import { cva } from "class-variance-authority"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File01Icon,
  Folder01Icon,
  FolderOpenIcon,
} from "@hugeicons/core-free-icons"
import { type HTMLAttributes, type ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const ITEM =
  "flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4"
const itemVariants = cva(ITEM)

export function Files({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn("not-prose rounded-md border bg-fd-card p-2", className)}
      {...props}
    >
      {props.children}
    </div>
  )
}

export interface FileProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  icon?: ReactNode
}

export interface FolderProps extends HTMLAttributes<HTMLDivElement> {
  name: string

  disabled?: boolean

  /**
   * Open folder by default
   *
   * @defaultValue false
   */
  defaultOpen?: boolean
}

export function File({
  name,
  icon = <HugeiconsIcon icon={File01Icon} strokeWidth={2} />,
  className,
  ...rest
}: FileProps): React.ReactElement {
  return (
    <div className={cn(itemVariants({ className }))} {...rest}>
      {icon}
      {name}
    </div>
  )
}

export function Folder({
  name,
  defaultOpen = false,
  ...props
}: FolderProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <CollapsibleTrigger className={cn(ITEM, "w-full")}>
        {open ? (
          <HugeiconsIcon icon={FolderOpenIcon} strokeWidth={2} />
        ) : (
          <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} />
        )}
        {name}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-2 flex flex-col border-l ps-2">{props.children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
