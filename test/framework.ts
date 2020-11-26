import { ReserveSeatHandler } from "../src/command_handler/reserve_seat_handler"
import { MyReservationHandler } from "../src/query_handler/my_reservations_handler"
import { CustomerReservation } from "../src/read_model/my_reservations"
import { ChosenSeats } from "../src/read_model/chosen_seats_to_cancel"
import {
  Command,
  CommandHandler,
  DomainEvent,
  Policy,
  Query,
  QueryHandler,
  ReadModel,
  ReadModelResponse,
} from "../src/infra/arch"
import { EventStore } from "../src/infra/eventStore"
import { expect } from "chai"
import { ChooseSeatHandler } from "../src/command_handler/choose_seat_handler"
import { CancellationChoicePolicy } from "../src/policy/cancellation_choice_policy"
import { CancellationChoiceHandler } from "../src/command_handler/cancellation_choice_handler"

export class TestFramework {
  eventStore: EventStore
  commandHandlers: CommandHandler<Command>[]
  queyHandlers: QueryHandler<Query>[]
  readModels: ReadModel[] = []
  policies: Policy<DomainEvent>[] = []
  publishedEvents: DomainEvent[] = []
  publishedCommands: Command[] = []
  response!: ReadModelResponse

  constructor() {
    this.eventStore = new EventStore()

    const eventBus = (e: DomainEvent) => {
      this.publishedEvents.push(e)
      this.policies.filter((p) => p.canHandle(e)).forEach((p) => p.handleEvent(e))
    }
    this.commandHandlers = [
      new ReserveSeatHandler(this.eventStore, eventBus),
      new ChooseSeatHandler(this.eventStore, eventBus),
      new CancellationChoiceHandler(this.eventStore, eventBus),
    ]
    // Read Model List
    const customerReservation = new CustomerReservation([])
    const chosenSeats = new ChosenSeats([])
    this.readModels = [customerReservation, chosenSeats]

    const commandBus = (c: Command) => {
      this.publishedCommands.push(c)
      this.commandHandlers.filter((ch) => ch.canHandle(c)).forEach((ch) => ch.handleCommand(c))
    }
    this.policies = [new CancellationChoicePolicy(chosenSeats, commandBus)]

    this.queyHandlers = [
      new MyReservationHandler(customerReservation, (res: ReadModelResponse) => {
        this.response = res
      }),
    ]
  }

  given(events: DomainEvent[]) {
    this.eventStore.add(events)
    events.forEach((e) => this.readModels.forEach((r) => r.apply(e)))
    events.forEach((e) => this.policies.filter((p) => p.canHandle(e)).forEach((p) => p.handleEvent(e)))
  }

  when(command: Command) {
    this.commandHandlers.filter((h) => h.canHandle(command)).forEach((ch) => ch.handleCommand(command))
  }

  whenEvent(event: DomainEvent) {
    this.policies.filter((p) => p.canHandle(event)).forEach((ch) => ch.handleEvent(event))
  }

  then(events: DomainEvent[]) {
    expect(this.publishedEvents).deep.equal(events)
  }

  query(query: Query) {
    const handler = this.queyHandlers.filter((h) => h.canHandle(query))
    handler[0].handleQuery(query)
  }

  thenExpect(response: ReadModelResponse) {
    expect(this.response).deep.equal(response)
  }

  thenTrigger(commands: Command[]) {
    expect(this.publishedCommands).deep.equal(commands)
  }
}
