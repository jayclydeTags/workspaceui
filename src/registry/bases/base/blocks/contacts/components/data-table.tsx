import { MoreHorizontalIcon, StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { initials, type Contact } from "../data"

interface RowProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onSetPrimary: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

function RowActions({ contact, onEdit, onSetPrimary, onDelete }: RowProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${contact.name}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(contact)}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          disabled={contact.primary}
          onClick={() => !contact.primary && onSetPrimary(contact)}
        >
          {contact.primary ? "Already primary" : "Make primary"}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(contact)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Person({ contact }: { contact: Contact }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        <AvatarFallback>{initials(contact.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium">{contact.name}</span>
          {contact.primary && (
            <StarIcon
              aria-label={`Primary contact for ${contact.account}`}
              className="size-3.5 shrink-0 fill-current"
            />
          )}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {contact.title}
        </div>
      </div>
    </div>
  )
}

export function DataTable({
  contacts,
  onEdit,
  onSetPrimary,
  onDelete,
}: {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onSetPrimary: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Contact</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="hidden @md:table-cell">Email</TableHead>
              <TableHead className="hidden @md:table-cell">Phone</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="px-6">
                  <Person contact={contact} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{contact.account}</Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {contact.email}
                </TableCell>
                <TableCell className="hidden tabular-nums text-muted-foreground @md:table-cell">
                  {contact.phone}
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    contact={contact}
                    onEdit={onEdit}
                    onSetPrimary={onSetPrimary}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {contacts.map((contact) => (
          <li key={contact.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <Person contact={contact} />
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {contact.account} · {contact.email}
              </p>
            </div>
            <RowActions
              contact={contact}
              onEdit={onEdit}
              onSetPrimary={onSetPrimary}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
