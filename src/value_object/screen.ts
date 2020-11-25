export class ScreenId {
  private readonly id: string

  constructor(id: string) {
    this.id = id
  }

  equals(obj: ScreenId): boolean {
    return this.id === obj.id
  }

  toString() {
    return this.id
  }
}

export class Screen {
  constructor(readonly screenId: ScreenId, readonly startTime: Date) {}

  equals(obj: Screen): boolean {
    return this.screenId === obj.screenId
  }

  toString() {
    return `${this.screenId} - ${this.startTime}`
  }
}
