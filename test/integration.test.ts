import { ScreenId } from "../src/value_object/screen"
import { CustomerId } from "../src/value_object/customer"
import { SeatReserved, ScreenScheduled } from "../src/aggregate/events"
import { TestFramework } from "./framework"
import { ReserveSeat } from "../src/command_handler/reserve_seat_handler"
import moment from "moment"
import { MyReservation } from "../src/query_handler/my_reservations_handler"
import { MyReservationResponse } from "../src/read_model/my_reservations"
import { Seat, Row, Col } from "../src/value_object/seat"

describe("As Customer, I want reserve a seat for a screen", () => {
  let testFramework: TestFramework
  const screen1 = new ScreenId("screen1")
  const customer1 = new CustomerId("customer1")
  const seat1 = new Seat(Row.A, Col.ONE)
  const tomorrow = moment().add(1, "days").toDate()

  beforeEach(() => {
    testFramework = new TestFramework()
  })

  it("should be visible in my reservation", async () => {
    testFramework.given([new ScreenScheduled(screen1, tomorrow), new SeatReserved(customer1, screen1, seat1)])
    testFramework.when(new ReserveSeat(customer1, screen1, Row.A, Col.ONE))
    testFramework.query(new MyReservation(customer1))
    testFramework.thenExpect(new MyReservationResponse([seat1]))
  })
})
