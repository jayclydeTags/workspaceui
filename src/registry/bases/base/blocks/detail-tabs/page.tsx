"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { ACTIVITY, CUSTOMER, ORDERS, type Order } from "./data"

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

const orderStatus: Record<Order["status"], "secondary" | "outline" | "destructive"> =
  { paid: "secondary", pending: "outline", refunded: "destructive" }

export function DetailTabs() {
  const c = CUSTOMER

  return (
    <Page title="Customer" subtitle={c.company}>
      <div className="flex flex-col gap-6">
        {/* Record header */}
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarFallback>{initials(c.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-semibold">{c.name}</h2>
              <Badge
                variant={c.status === "active" ? "secondary" : "destructive"}
                className="capitalize"
              >
                {c.status}
              </Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">{c.email}</p>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <Field label="Company" value={c.company} />
              <Field label="Phone" value={c.phone} />
              <Field label="Plan" value={c.plan} />
              <Field label="Customer since" value={c.since} />
              <Field label="Lifetime value" value={c.lifetimeValue} />
            </dl>
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <ul className="flex flex-col">
              {ACTIVITY.map((a, i) => (
                <li key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 size-2 rounded-full bg-primary" />
                    {i < ACTIVITY.length - 1 && (
                      <span className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.at}</p>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="orders" className="pt-4">
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ORDERS.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.number}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {o.date}
                      </TableCell>
                      <TableCell className="text-right">{o.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={orderStatus[o.status]}
                          className="capitalize"
                        >
                          {o.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        <p className="text-xs text-muted-foreground">
          Record ID: {c.id}
        </p>
      </div>
    </Page>
  )
}
