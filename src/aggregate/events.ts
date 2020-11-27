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
export abstract class SeatChosenCancellationEvent implements DomainEvent {
  constructor(readonly customerId: CustomerId, readonly screenId: ScreenId, readonly seat: Seat) {}

  abstract name: string

  relatedTo(event: DomainEvent): boolean {
    return event instanceof SeatChosenCancellationEvent
  }
}

export abstract class TimerEvent implements DomainEvent {
  constructor(readonly time: Date = new Date()) {}

  abstract name: string

  relatedTo(event: DomainEvent): boolean {
    return event instanceof TimerEvent
  }
}

// Event
export class ScreenScheduled extends ScreenEvent {
  readonly name = "ScreenScheduled"
  constructor(readonly screenId: ScreenId, readonly title: string, readonly startTime: Date = new Date()) {
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

  constructor(
    readonly customerId: CustomerId,
    readonly screenId: ScreenId,
    readonly seat: Seat,
    readonly timestamp: Date = new Date()
  ) {
    super(customerId, screenId, seat)
  }
}
export class SeatChosenRefused extends ChooseSeatEvent {
  readonly name = "SeatChosenRefused"
}
export class SeatChosenCancelled extends SeatChosenCancellationEvent {
  readonly name = "SeatChosenCancelled"
}

export class SeatChosenCancellationRefused extends SeatChosenCancellationEvent {
  readonly name = "SeatChosenCancellationRefused"
}

export class OneMinutePassed extends TimerEvent {
  readonly name = "OneMinutePassed"
  relatedTo(event: DomainEvent): boolean {
    return event instanceof TimerEvent
  }
}
