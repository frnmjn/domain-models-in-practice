import { DomainEvent } from "./arch"
import { ScreenId } from "../value_object/screen"
import { ChooseSeatEvent, ReservationEvent, ScreenEvent } from "../aggregate/events"

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

  chooseSeatEvents(screenId: ScreenId) {
    return this.events.filter((e) => e instanceof ChooseSeatEvent && e.screenId.equals(screenId))
  }

  reservationEvents(screenId: ScreenId) {
    return this.events.filter(
      (e) =>
        (e instanceof ReservationEvent || e instanceof ChooseSeatEvent || e instanceof ScreenEvent) &&
        e.screenId.equals(screenId)
    )
  }
}
