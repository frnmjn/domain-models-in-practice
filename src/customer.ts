export class CustomerId {
  constructor(readonly id: string) {}

  equals(obj: CustomerId): boolean {
    return this.id === obj.id
  }

  toString() {
    return this.id
  }
}
