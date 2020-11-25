import { ReserveSeatHandler } from "../src/command_handler/reserve_seat_handler"
import { MyReservationHandler } from "../src/query_handler/my_reservations_handler"
import { CustomerReservation } from "../src/read_model/my_reservations"
import {
  Command,
  CommandHandler,
  DomainEvent,
  Query,
  QueryHandler,
  ReadModel,
  ReadModelResponse,
} from "../src/infra/arch"
import { EventStore } from "../src/infra/eventStore"
import { expect } from "chai"

export class TestFramework {
  eventStore: EventStore
  commandHandlers: CommandHandler<Command>[]
  queyHandlers: QueryHandler<Query>[]
  readModels: ReadModel[] = []
  publishedEvents: DomainEvent[] = []
  response!: ReadModelResponse

  constructor() {
    this.eventStore = new EventStore()
    const eventBus = (e: DomainEvent) => this.publishedEvents.push(e)
    this.commandHandlers = [new ReserveSeatHandler(this.eventStore, eventBus)]
    // Read Model List
    const customerReservation = new CustomerReservation([])
    this.readModels = [customerReservation]
    this.queyHandlers = [
      new MyReservationHandler(customerReservation, (res: ReadModelResponse) => {
        this.response = res
      }),
    ]
  }

  given(events: DomainEvent[]) {
    events.forEach((e) => {
      this.eventStore.add(events)
      this.readModels.forEach((r) => r.apply(e))
    })
  }

  when(command: Command) {
    const handler = this.commandHandlers.filter((h) => h.canHandle(command))
    handler[0].handleCommand(command)
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
}
