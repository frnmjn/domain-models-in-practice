import { Query, QueryHandler, ReadModelResponse } from "../infra/arch"
import { CustomerId } from "../value_object/customer"
import { CustomerReservation as CustomerReservations } from "../read_model/my_reservations"

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
