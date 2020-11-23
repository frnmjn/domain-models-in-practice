import { DomainEvent, ReadModel, ReadModelResponse } from "./arch"
import { CustomerId } from "./customer"
import { SeatReserved } from "./events"
import { Seat } from "./seat"

// State
export class CustomerReservation implements ReadModel {
  reservedSeat: Map<CustomerId, Seat[]> = new Map()

  constructor(events: DomainEvent[]) {
    events.forEach((e) => this.apply(e))
  }

  apply(event: DomainEvent) {
    if (event instanceof SeatReserved) this.applySeatReserved(event)
  }

  private applySeatReserved(event: SeatReserved) {
    const customerId = event.customerId
    const reserverSeat = this.reservedSeat.get(customerId) || []
    this.reservedSeat.set(customerId, [...reserverSeat, event.seat])
  }

  of(customerId: CustomerId) {
    return this.reservedSeat.get(customerId) || []
  }
}

export class MyReservationResponse implements ReadModelResponse {
  constructor(readonly data: Seat[]) {}
}
