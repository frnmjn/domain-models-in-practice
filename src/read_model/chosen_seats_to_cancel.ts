import { DomainEvent, ReadModel, ReadModelResponse } from "../infra/arch"
import { CustomerId } from "../value_object/customer"
import { SeatChosen, SeatChosenCancelled, SeatReserved } from "../aggregate/events"
import { Seat } from "../value_object/seat"
import { ScreenId } from "../value_object/screen"

// State
export class ChosenSeats implements ReadModel {
  chosenSeats: ChosenSeat[] = []

  constructor(events: DomainEvent[]) {
    events.forEach((e) => this.apply(e))
  }

  apply(event: DomainEvent) {
    if (event instanceof SeatChosen) this.applySeatChosen(event)
    if (event instanceof SeatChosenCancelled) this.applySeatChosenCancelled(event)
    if (event instanceof SeatReserved) this.applySeatReserved(event)
  }

  private applySeatChosen(event: SeatChosen) {
    this.chosenSeats.push(new ChosenSeat(event.customerId, event.screenId, event.seat, event.timestamp))
  }

  private applySeatChosenCancelled(event: SeatChosenCancelled) {
    this.chosenSeats = this.chosenSeats.filter(
      (cs) =>
        !(cs.seat.equals(event.seat) && cs.customerId.equals(event.customerId) && cs.screenId.equals(event.screenId))
    )
  }

  private applySeatReserved(event: SeatReserved) {
    this.chosenSeats = this.chosenSeats.filter(
      (cs) =>
        !(cs.seat.equals(event.seat) && cs.customerId.equals(event.customerId) && cs.screenId.equals(event.screenId))
    )
  }
}

export class MyReservationResponse implements ReadModelResponse {
  constructor(readonly data: Seat[]) {}
}

class ChosenSeat {
  constructor(
    readonly customerId: CustomerId,
    readonly screenId: ScreenId,
    readonly seat: Seat,
    readonly timestamp: Date
  ) {}
}
