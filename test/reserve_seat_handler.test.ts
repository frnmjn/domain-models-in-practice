import { Row, Col, Seat } from "../src/value_object/seat"
import { ScreenId } from "../src/value_object/screen"
import { CustomerId } from "../src/value_object/customer"
import { SeatReserved, SeatReservationRefused, ScreenScheduled } from "../src/aggregate/events"
import { TestFramework } from "./framework"
import { ReserveSeat } from "../src/command_handler/reserve_seat_handler"
import moment from "moment"

describe("A Customer reserves specific seats at a specific screening (for simplicity, assume there exists only one screening)", () => {
  let testFramework: TestFramework
  const screen1 = new ScreenId("screen1")
  const customer1 = new CustomerId("customer1")
  const customer2 = new CustomerId("customer2")
  const tomorrow = moment().add(1, "days").toDate()
  const in110Mins = moment().add(13, "minutes").toDate()

  beforeEach(() => {
    testFramework = new TestFramework()
  })

  it("If available, the seats should be reserved.", async () => {
    testFramework.given([new ScreenScheduled(screen1, "matrix", tomorrow)])
    testFramework.when(new ReserveSeat(customer1, screen1, Row.A, Col.ONE))
    testFramework.then([new SeatReserved(customer1, screen1, new Seat(Row.A, Col.ONE))])
  })

  it("If not available, the seats should not be reserved.", async () => {
    testFramework.given([
      new ScreenScheduled(screen1, "matrix", tomorrow),
      new SeatReserved(customer1, screen1, new Seat(Row.A, Col.ONE)),
    ])
    testFramework.when(new ReserveSeat(customer2, screen1, Row.A, Col.ONE))
    testFramework.then([new SeatReservationRefused(customer2, screen1, new Seat(Row.A, Col.ONE))])
  })

  it("If available but 15 mins before start, the seats should not be reserved.", async () => {
    testFramework.given([new ScreenScheduled(screen1, "matrix", new Date())])
    testFramework.when(new ReserveSeat(customer1, screen1, Row.A, Col.ONE))
    testFramework.then([new SeatReservationRefused(customer1, screen1, new Seat(Row.A, Col.ONE))])
  })
})
