import { DomainEvent } from "./arch"
import { CustomerId } from "./customer"
import { ScreenId } from "./screen"
import { Seat } from "./seat"

export abstract class ScreenEvent implements DomainEvent {
  constructor(readonly screenId: ScreenId) {}

  abstract name: string

  relatedTo(event: DomainEvent): boolean {
    return event instanceof ScreenEvent
  }
}
export abstract class ReservationEvent implements DomainEvent {
  constructor(readonly customerId: CustomerId, readonly screenId: ScreenId, readonly seat: Seat) {}

  abstract name: string

  relatedTo(event: DomainEvent): boolean {
    return event instanceof ScreenEvent
  }
}

// Event
export class ScreenScheduled extends ScreenEvent {
  readonly name = "ScreenScheduled"
  constructor(readonly screenId: ScreenId, readonly startTime: Date) {
    super(screenId)
  }
}
export class SeatReserved extends ReservationEvent {
  readonly name = "SeatReserved"
}
export class SeatReservationRefused extends ReservationEvent {
  readonly name = "SeatReservationRefused"
}
