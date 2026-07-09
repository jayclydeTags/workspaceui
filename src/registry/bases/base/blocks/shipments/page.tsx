"use client"

import * as React from "react"

import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  canCancel,
  canDeliver,
  canFlagException,
  canMarkShipped,
  pickFor,
  seedShipments,
  shipmentStatus,
  type Shipment,
} from "./data"
import { DataTable } from "./components/data-table"
import { ShipmentSheet } from "./components/shipment-sheet"

/** Stands in for the clock a real service would stamp these with. */
const today = () => new Date().toISOString().slice(0, 10)

/** Carrier and tracking are only editable before the parcel leaves the dock. */
const isDraft = (shipment: Shipment) =>
  shipmentStatus(shipment) === "ready-to-ship"

export function Shipments() {
  const [shipments, setShipments] = React.useState<Shipment[]>(seedShipments)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const selected = shipments.find((s) => s.id === selectedId) ?? null

  const openCount = shipments.filter(
    (s) => shipmentStatus(s) === "ready-to-ship"
  ).length

  /** Apply a change to the selected shipment, guarded by its own gate. */
  function patch(
    guard: (shipment: Shipment) => boolean,
    change: (shipment: Shipment) => Shipment
  ) {
    setShipments((prev) =>
      prev.map((s) => (s.id === selectedId && guard(s) ? change(s) : s))
    )
  }

  /** Every action is terminal for the sheet — apply it, then step back to the list. */
  function commit(
    guard: (shipment: Shipment) => boolean,
    change: (shipment: Shipment) => Shipment
  ) {
    patch(guard, change)
    setSelectedId(null)
  }

  function handleShip() {
    commit(
      (s) => canMarkShipped(s, pickFor(s)),
      (s) => ({ ...s, shippedAt: today() })
    )
  }

  function handleDeliver() {
    commit(canDeliver, (s) => ({ ...s, deliveredAt: today() }))
  }

  function handleCancel() {
    commit(canCancel, (s) => ({ ...s, cancelled: true }))
  }

  function handleException(reason: string) {
    commit(canFlagException, (s) => ({ ...s, exception: reason }))
  }

  return (
    <Page
      title="Shipments"
      subtitle={`${shipments.length} shipments · ${openCount} to ship`}
      className="@container overflow-hidden"
    >
      <div className="flex h-full flex-col">
        <DataTable shipments={shipments} onOpen={(s) => setSelectedId(s.id)} />
      </div>

      <ShipmentSheet
        shipment={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onCarrierChange={(carrier) =>
          patch(isDraft, (s) => ({ ...s, carrier }))
        }
        onTrackingChange={(trackingNumber) =>
          patch(isDraft, (s) => ({ ...s, trackingNumber }))
        }
        onShip={handleShip}
        onDeliver={handleDeliver}
        onCancel={handleCancel}
        onException={handleException}
      />
    </Page>
  )
}
