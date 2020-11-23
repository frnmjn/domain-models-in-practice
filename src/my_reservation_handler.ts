import { Query, QueryHandler, ReadModelResponse } from "./arch"
import { CustomerId } from "./customer"
import { CustomerReservation as CustomerReservations } from "./my_reservations"

// Query
export class MyReservation implements Query {
  constructor(readonly customerId: CustomerId) {}
}

// Query Handler
export class MyReservationHandler implements QueryHandler<MyReservation> {
  constructor(
    private readonly customerReservations: CustomerReservations,
    private readonly response: (res: ReadModelResponse) => void
  ) {}

  canHandle(query: Query) {
    return query instanceof MyReservation
  }

  handleQuery(myReservation: MyReservation) {
    const customerId = myReservation.customerId

    const reservations = this.customerReservations.of(customerId)
    this.response({ data: reservations })
    return "OK"
  }
}
