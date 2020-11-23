import { ReserveSeatHandler } from "../src/reserve_seat_handler"
import { Command, CommandHandler, DomainEvent } from "../src/arch"
import { EventStore } from "../src/eventStore"
import { expect } from "chai"

export class TestFramework {
  eventStore: EventStore
  commandHandlers: CommandHandler<Command>[]
  publishedEvents: DomainEvent[] = []

  constructor() {
    this.eventStore = new EventStore()
    const eventBus = (e: DomainEvent) => this.publishedEvents.push(e)
    this.commandHandlers = [new ReserveSeatHandler(this.eventStore, eventBus)]
  }

  given(events: DomainEvent[]) {
    this.eventStore.add(events)
  }

  when(command: Command) {
    const handler = this.commandHandlers.filter((h) => h.canHandle(command))
    handler[0].handleCommand(command)
  }

  then(events: DomainEvent[]) {
    expect(this.publishedEvents).deep.equal(events)
  }
}
