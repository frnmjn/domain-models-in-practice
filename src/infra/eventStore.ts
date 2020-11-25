import { DomainEvent } from "./arch"
import { ScreenId } from "../value_object/screen"
import { ScreenEvent } from "../aggregate/events"

export class EventStore {
  events: DomainEvent[]

  constructor(events: DomainEvent[] = []) {
    this.events = events
  }

  add(events: DomainEvent[] = []) {
    events.forEach((e) => this.events.push(e))
  }

  screenEvents(screenId: ScreenId) {
    return this.events.filter((e) => e instanceof ScreenEvent && e.screenId.equals(screenId))
  }
}
