import { isEmpty } from "lodash"
import moment from "moment"
import { DomainEvent, State } from "../infra/arch"
import { CustomerId } from "../value_object/customer"
import { ScreenScheduled, SeatReservationRefused, SeatReserved } from "./events"
import { ScreenId, Screen } from "../value_object/screen"
import { Seat } from "../value_object/seat"

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
    return moment(this.reservationState.screen.startTime).subtract(15, "minutes").toDate() > new Date()
  }

  seatIsAvailable(seat: Seat) {
    return !this.reservationState.reservedSeat.find((s) => s.equals(seat))
  }

  seatCanBeBooked(seat: Seat) {
    return this.reservationIsOnTime() && this.seatIsAvailable(seat)
  }

  noReservations() {
    return isEmpty(this.reservationState.reservedSeat)
  }

  rejectWindow() {
    return new Date() > moment(this.reservationState.screen.startTime).subtract(12, "minutes").toDate()
  }

  reservationMustBeRejected() {
    return this.noReservations() && this.rejectWindow()
  }

  reserveSeat(customerId: CustomerId, screenId: ScreenId, seat: Seat) {
    if (this.seatCanBeBooked(seat)) {
      this.publish(new SeatReserved(customerId, screenId, seat))
    } else {
      this.publish(new SeatReservationRefused(customerId, screenId, seat))
    }
  }
}
