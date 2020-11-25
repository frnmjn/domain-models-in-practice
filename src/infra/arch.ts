// Event
export interface DomainEvent {
  name: string
  relatedTo(event: DomainEvent): boolean
}

// Command
export abstract class Command {}

// Command Handler
export interface CommandHandler<C extends Command> {
  handleCommand(command: C): void
  canHandle(command: C): boolean
}
// State
export interface State {}

// Query
export interface Query {}

// Query Handler
export interface QueryHandler<Q extends Query> {
  handleQuery(query: Q): void
  canHandle(query: Q): boolean
}
// Read Model
export interface ReadModel {
  apply(event: DomainEvent): void
}

export interface ReadModelResponse {
  data: any
}
