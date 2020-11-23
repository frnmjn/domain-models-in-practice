import { DomainEvent, State } from "./arch"
import { CustomerId } from "./customer"
import { ScreenScheduled, SeatReservationRefused, SeatReserved } from "./events"
import { ScreenId, Screen } from "./screen"
import { Seat } from "./seat"

// State
export class ReservationState implements State {
  reservedSeat: Seat[] = []
  screen!: Screen

  constructor(events: DomainEvent[]) {
    for (const event of events) {
      if (event instanceof ScreenScheduled) this.applyScreenScheduled(event)
      if (event instanceof SeatReserved) this.applySeatReserved(event)
    }
  }

  private applyScreenScheduled(event: ScreenScheduled) {
    this.screen = new Screen(event.screenId, event.startTime)
  }

  private applySeatReserved(event: SeatReserved) {
    this.reservedSeat.push(event.seat)
  }
}

// Aggregate
export class Reservation {
  reservationState: ReservationState

  constructor(reservationState: ReservationState, readonly publish: (event: DomainEvent) => void) {
    this.reservationState = reservationState
  }

  reservationIsOnTime() {
    return new Date(this.reservationState.screen.startTime.getTime() - 15 * 60 * 1000) > new Date()
  }

  seatIsAvailable(seat: Seat) {
    return !this.reservationState.reservedSeat.find((s) => s.equals(seat))
  }

  seatCanBeBooked(seat: Seat) {
    return this.reservationIsOnTime() && this.seatIsAvailable(seat)
  }

  reserveSeat(customerId: CustomerId, screenId: ScreenId, seat: Seat) {
    if (this.seatCanBeBooked(seat)) {
      this.publish(new SeatReserved(customerId, screenId, seat))
    } else {
      this.publish(new SeatReservationRefused(customerId, screenId, seat))
    }
  }
}
