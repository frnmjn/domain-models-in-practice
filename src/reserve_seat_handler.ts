import { Command, CommandHandler, DomainEvent } from "./arch"
import { CustomerId } from "./customer"
import { EventStore } from "./eventStore"
import { Reservation, ReservationState } from "./reservation"
import { ScreenId } from "./screen"
import { Col, Row, Seat } from "./seat"

// Command
export class ReserveSeat implements Command {
  constructor(readonly customerId: CustomerId, readonly screenId: ScreenId, readonly row: Row, readonly col: Col) {}
}

// Command Handler
export class ReserveSeatHandler implements CommandHandler<ReserveSeat> {
  constructor(private readonly eventStore: EventStore, private readonly publish: (event: DomainEvent) => void) {}

  canHandle(command: Command) {
    return command instanceof ReserveSeat
  }

  handleCommand(reserveSeat: ReserveSeat) {
    const customerId = reserveSeat.customerId
    const screenId = reserveSeat.screenId
    const seat = new Seat(reserveSeat.row, reserveSeat.col)

    const events = this.eventStore.screenEvents(screenId)
    const reservationState = new ReservationState(events)

    const reservation = new Reservation(reservationState, this.publish)

    reservation.reserveSeat(customerId, screenId, seat)

    return "OK"
  }
}
