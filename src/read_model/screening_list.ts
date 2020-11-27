import { DomainEvent, ReadModel, ReadModelResponse } from "../infra/arch"
import { ScreenScheduled } from "../aggregate/events"
import moment from "moment"

// State
export class ScreeningList implements ReadModel {
  screeningList: Map<string, Screenings[]> = new Map()

  constructor(events: DomainEvent[]) {
    events.forEach((e) => this.apply(e))
  }

  apply(event: DomainEvent) {
    if (event instanceof ScreenScheduled) this.applyScreenScheduled(event)
  }

  private applyScreenScheduled(event: ScreenScheduled) {
    const day = new Day(moment(event.startTime).startOf("day").toDate())
    const s = this.screeningList.get(day.toKey()) || []
    this.screeningList.set(day.toKey(), [...s, new Screenings(event.title, event.startTime)])
  }

  of(day: Day) {
    return this.screeningList.get(day.toKey()) || []
  }
}

export class Day {
  constructor(readonly day: Date = new Date()) {}

  toKey() {
    return this.day.toUTCString()
  }
}
export class Screenings {
  constructor(readonly title: string, readonly time: Date) {}
}

export class ScreeningResponse implements ReadModelResponse {
  constructor(readonly data: Screenings[]) {}
}
