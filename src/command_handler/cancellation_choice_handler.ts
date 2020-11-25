import { Command, CommandHandler, DomainEvent } from "../infra/arch"
import { CustomerId } from "../value_object/customer"
import { EventStore } from "../infra/eventStore"
import { Reservation, ReservationState } from "../aggregate/reservation"
import { ScreenId } from "../value_object/screen"
import { Col, Row, Seat } from "../value_object/seat"

// Command
export class CancellationChoice implements Command {
  constructor(readonly customerId: CustomerId, readonly screenId: ScreenId, readonly row: Row, readonly col: Col) {}
}

// Command Handler
export class CancellationChoiceHandler implements CommandHandler<CancellationChoice> {
  constructor(private readonly eventStore: EventStore, private readonly publish: (event: DomainEvent) => void) {}

  canHandle(command: Command) {
    return command instanceof CancellationChoice
  }

  handleCommand(reserveSeat: CancellationChoice) {
    const customerId = reserveSeat.customerId
    const screenId = reserveSeat.screenId
    const seat = new Seat(reserveSeat.row, reserveSeat.col)

    const reservationEvents = this.eventStore.reservationEvents(screenId)
    const reservationState = new ReservationState(reservationEvents)

    const reservation = new Reservation(reservationState, this.publish)

    reservation.cancelChosenSeat(customerId, screenId, seat)

    return "OK"
  }
}
