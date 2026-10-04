"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FileExportIcon,
  FilterIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  CATEGORIES,
  CATEGORY_BY_ID,
  PERIODS,
  PLAN,
  getAgents,
  getPowerUsers,
  summarize,
  type CategoryId,
  type Period,
} from "@/registry/bases/base/blocks/credit-usage/data"
import { CreditBreakdown } from "@/registry/bases/base/blocks/credit-usage/components/credit-breakdown"
import {
  AgentsTable,
  PowerUsersTable,
} from "@/registry/bases/base/blocks/credit-usage/components/usage-tables"

type View = "agents" | "users"

function toCsv(rows: (string | number)[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell)
          return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
        })
        .join(",")
    )
    .join("\n")
}

function downloadCsv(filename: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function CreditUsage({ className }: { className?: string }) {
  const [period, setPeriod] = React.useState<Period>("month")
  const [view, setView] = React.useState<View>("agents")
  const [query, setQuery] = React.useState("")
  const [categories, setCategories] = React.useState<Set<CategoryId>>(
    () => new Set()
  )

  const agents = React.useMemo(() => getAgents(period), [period])
  const users = React.useMemo(() => getPowerUsers(period), [period])
  const summary = React.useMemo(() => summarize(agents), [agents])

  const needle = query.trim().toLowerCase()
  const matchesCategory = (category: CategoryId) =>
    categories.size === 0 || categories.has(category)

  const visibleAgents = agents.filter(
    (agent) =>
      matchesCategory(agent.category) &&
      agent.name.toLowerCase().includes(needle)
  )
  const visibleUsers = users.filter(
    (user) =>
      matchesCategory(user.category) &&
      [user.name, user.email, user.team, user.topAgent].some((field) =>
        field.toLowerCase().includes(needle)
      )
  )

  function toggleCategory(id: CategoryId) {
    setCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function reset() {
    setQuery("")
    setCategories(new Set())
  }

  function exportView() {
    const csv =
      view === "agents"
        ? toCsv([
            ["Agent", "Category", "Runs", "Hours saved", "Credits"],
            ...visibleAgents.map((a) => [
              a.name,
              CATEGORY_BY_ID[a.category].label,
              a.runs,
              a.hoursSaved,
              a.credits,
            ]),
          ])
        : toCsv([
            ["User", "Email", "Team", "Top agent", "Runs", "Credits"],
            ...visibleUsers.map((u) => [
              u.name,
              u.email,
              u.team,
              u.topAgent,
              u.runs,
              u.credits,
            ]),
          ])
    downloadCsv(`credit-usage-${view}-${period}.csv`, csv)
  }

  return (
    <div className={cn("h-full overflow-y-auto bg-background", className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:py-12">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Credit usage
            </h1>
            <p className="text-sm text-muted-foreground">
              Where credits went, by category and agent.
            </p>
          </div>
          <ToggleGroup
            aria-label="Period"
            value={[period]}
            onValueChange={(value) => {
              // Single-select: ignore the deselect that would leave no period.
              if (value[0]) setPeriod(value[0] as Period)
            }}
            spacing={0}
            className="bg-muted p-0.75"
          >
            {PERIODS.map((p) => (
              <ToggleGroupItem
                key={p.value}
                value={p.value}
                className="h-7 rounded-md! px-3 text-muted-foreground hover:bg-transparent aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
              >
                {p.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </header>

        <CreditBreakdown plan={PLAN} period={period} summary={summary} />

        <Tabs value={view} onValueChange={(value) => setView(value as View)}>
          <div className="flex flex-wrap items-center gap-2">
            <TabsList>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="users">Power users</TabsTrigger>
            </TabsList>
            <div className="ms-auto flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <InputGroup className="flex-1 sm:w-64 sm:flex-none">
                <InputGroupAddon>
                  <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  aria-label={
                    view === "agents" ? "Search agents" : "Search users"
                  }
                  placeholder={
                    view === "agents" ? "Search agents…" : "Search users…"
                  }
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
              <Button variant="outline" onClick={exportView}>
                <HugeiconsIcon
                  icon={FileExportIcon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline">
                      <HugeiconsIcon
                        icon={FilterIcon}
                        strokeWidth={2}
                        data-icon="inline-start"
                      />
                      Filter
                      {categories.size > 0 && (
                        <Badge variant="secondary">
                          <span className="tabular-nums">
                            {categories.size}
                          </span>
                        </Badge>
                      )}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Category</DropdownMenuLabel>
                    {CATEGORIES.map((category) => (
                      <DropdownMenuCheckboxItem
                        key={category.id}
                        checked={categories.has(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      >
                        <span
                          aria-hidden="true"
                          className={cn("size-2 rounded-full", category.swatch)}
                        />
                        {category.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      disabled={categories.size === 0}
                      onClick={() => setCategories(new Set())}
                    >
                      Clear filters
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="agents" className="mt-2">
            <Card className="gap-0 py-0">
              <AgentsTable
                rows={visibleAgents}
                totalCredits={summary.used}
                onReset={reset}
              />
            </Card>
          </TabsContent>
          <TabsContent value="users" className="mt-2">
            <Card className="gap-0 py-0">
              <PowerUsersTable
                rows={visibleUsers}
                totalCredits={summary.used}
                onReset={reset}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
