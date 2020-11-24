import { Row, Col, Seat } from "../src/seat"
import { ScreenId } from "../src/screen"
import { CustomerId } from "../src/customer"
import { SeatReserved } from "../src/events"
import { TestFramework } from "./framework"
import { MyReservation } from "../src/my_reservations_handler"
import { MyReservationResponse } from "../src/my_reservations"

describe("As a Customer, when query for my reservation", () => {
  let testFramework: TestFramework
  const screen1 = new ScreenId("screen1")
  const customer1 = new CustomerId("customer1")
  const seat1 = new Seat(Row.A, Col.ONE)

  beforeEach(() => {
    testFramework = new TestFramework()
  })

  it("returns its list of reservation", async () => {
    testFramework.given([new SeatReserved(customer1, screen1, seat1)])
    testFramework.query(new MyReservation(customer1))
    testFramework.thenExpect(new MyReservationResponse([new Seat(Row.A, Col.ONE)]))
  })
})
