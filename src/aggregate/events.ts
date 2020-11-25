import { DomainEvent } from "../infra/arch"
import { CustomerId } from "../value_object/customer"
import { ScreenId } from "../value_object/screen"
import { Seat } from "../value_object/seat"

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
    return event instanceof ReservationEvent
  }
}

export abstract class ChooseSeatEvent implements DomainEvent {
  constructor(readonly customerId: CustomerId, readonly screenId: ScreenId, readonly seat: Seat) {}

  abstract name: string

  relatedTo(event: DomainEvent): boolean {
    return event instanceof ChooseSeatEvent
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

export class SeatChosen extends ChooseSeatEvent {
  readonly name = "SeatChosen"
}
export class SeatChosenRefused extends ChooseSeatEvent {
  readonly name = "SeatChosenRefused"
}
