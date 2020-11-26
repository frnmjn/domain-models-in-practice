import { Command, DomainEvent, Policy } from "../infra/arch"
import { OneMinutePassed } from "../aggregate/events"
import { ChosenSeats } from "../read_model/chosen_seats_to_cancel"
import { CancellationChoice } from "../command_handler/cancellation_choice_handler"
import moment from "moment"

// Command Handler
export class CancellationChoicePolicy implements Policy<OneMinutePassed> {
  constructor(private readonly chosenSeatsToCancel: ChosenSeats, private readonly publish: (event: Command) => void) {}

  canHandle(event: DomainEvent) {
    return event instanceof OneMinutePassed
  }

  handleEvent(event: OneMinutePassed) {
    this.chosenSeatsToCancel.chosenSeats
      .filter((cs) => moment(event.time).diff(moment(cs.timestamp), "minutes") > 12)
      .forEach((cs) => {
        const command = new CancellationChoice(cs.customerId, cs.screenId, cs.seat.row, cs.seat.col)
        this.publish(command)
      })
    return "OK"
  }
}
