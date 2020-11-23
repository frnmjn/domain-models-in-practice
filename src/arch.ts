// Event
export interface DomainEvent {
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
