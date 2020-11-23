import { DomainEvent } from "./arch"
import { CustomerId } from "./customer"
import { ScreenId } from "./screen"
import { Seat } from "./seat"

export abstract class ScreenEvent implements DomainEvent {
  constructor(readonly screenId: ScreenId) {}

  relatedTo(event: DomainEvent): boolean {
    return event instanceof ScreenEvent
  }
}
export abstract class ReservationEvent implements DomainEvent {
  constructor(readonly customerId: CustomerId, readonly screenId: ScreenId, readonly seat: Seat) {}

  relatedTo(event: DomainEvent): boolean {
    return event instanceof ScreenEvent
  }
}

// Event
export class ScreenScheduled extends ScreenEvent {
  constructor(readonly screenId: ScreenId, readonly startTime: Date) {
    super(screenId)
  }
}
export class SeatReserved extends ReservationEvent {}
export class SeatReservationRefused extends ReservationEvent {}
