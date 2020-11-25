import { isEmpty } from "lodash"
import moment from "moment"
import { DomainEvent, State } from "../infra/arch"
import { CustomerId } from "../value_object/customer"
import {
  ScreenScheduled,
  SeatChosen,
  SeatChosenCancelled,
  SeatChosenCancellationRefused,
  SeatChosenRefused,
  SeatReservationRefused,
  SeatReserved,
} from "./events"
import { ScreenId, Screen } from "../value_object/screen"
import { Seat } from "../value_object/seat"

// State
export class ReservationState implements State {
  reservedSeat: Seat[] = []
  chosenSeat: ChosenSeat[] = []
  screen!: Screen

  constructor(events: DomainEvent[]) {
    for (const event of events) {
      if (event instanceof ScreenScheduled) this.applyScreenScheduled(event)
      if (event instanceof SeatChosen) this.applySeatChosen(event)
      if (event instanceof SeatReserved) this.applySeatReserved(event)
    }
  }

  private applyScreenScheduled(event: ScreenScheduled) {
    this.screen = new Screen(event.screenId, event.startTime)
  }

  private applySeatReserved(event: SeatReserved) {
    this.reservedSeat.push(event.seat)
  }

  private applySeatChosen(event: SeatChosen) {
    this.chosenSeat.push(new ChosenSeat(event.seat, event.timestamp))
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
    return (
      !this.reservationState.reservedSeat.find((s) => s.equals(seat)) &&
      !this.reservationState.chosenSeat.map((cs) => cs.seat).find((s) => s.equals(seat))
    )
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

  seatChosenShouldBeCancelled(seat: Seat) {
    const chosenSeat = this.reservationState.chosenSeat.find((cs) => cs.seat.equals(seat))
    if (!chosenSeat) throw new Error(``)

    return moment().diff(moment(chosenSeat.timestamp), "minutes") > 12
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

  choseSeat(customerId: CustomerId, screenId: ScreenId, seat: Seat) {
    if (this.seatCanBeBooked(seat)) {
      this.publish(new SeatChosen(customerId, screenId, seat))
    } else {
      this.publish(new SeatChosenRefused(customerId, screenId, seat))
    }
  }

  cancelChosenSeat(customerId: CustomerId, screenId: ScreenId, seat: Seat) {
    if (this.seatChosenShouldBeCancelled(seat)) {
      this.publish(new SeatChosenCancelled(customerId, screenId, seat))
    } else {
      this.publish(new SeatChosenCancellationRefused(customerId, screenId, seat))
    }
  }
}

class ChosenSeat {
  constructor(readonly seat: Seat, readonly timestamp: Date) {}
}
