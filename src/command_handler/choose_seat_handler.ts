import { Command, CommandHandler, DomainEvent } from "../infra/arch"
import { CustomerId } from "../value_object/customer"
import { EventStore } from "../infra/eventStore"
import { Reservation, ReservationState } from "../aggregate/reservation"
import { ScreenId } from "../value_object/screen"
import { Col, Row, Seat } from "../value_object/seat"

// Command
export class ChooseSeat implements Command {
  constructor(readonly customerId: CustomerId, readonly screenId: ScreenId, readonly row: Row, readonly col: Col) {}
}

// Command Handler
export class ChooseSeatHandler implements CommandHandler<ChooseSeat> {
  constructor(private readonly eventStore: EventStore, private readonly publish: (event: DomainEvent) => void) {}

  canHandle(command: Command) {
    return command instanceof ChooseSeat
  }

  handleCommand(reserveSeat: ChooseSeat) {
    const customerId = reserveSeat.customerId
    const screenId = reserveSeat.screenId
    const seat = new Seat(reserveSeat.row, reserveSeat.col)

    const reservationEvents = this.eventStore.reservationEvents(screenId)
    const reservationState = new ReservationState(reservationEvents)

    const reservation = new Reservation(reservationState, this.publish)

    reservation.choseSeat(customerId, screenId, seat)

    return "OK"
  }
}
