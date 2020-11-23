import { Row, Col, Seat } from "../src/seat"
import { ScreenId } from "../src/screen"
import { CustomerId } from "../src/customer"
import { SeatReserved, SeatReservationRefused, ScreenScheduled } from "../src/events"
import { TestFramework } from "./framework"
import { ReserveSeat } from "../src/reserve_seat_handler"

describe("A Customer reserves specific seats at a specific screening (for simplicity, assume there exists only one screening)", () => {
  let testFramework: TestFramework

  beforeEach(() => {
    testFramework = new TestFramework()
  })

  it("If available, the seats should be reserved.", async () => {
    testFramework.given([new ScreenScheduled(new ScreenId("screen1"), new Date())])
    testFramework.when(new ReserveSeat(new CustomerId("customer1"), new ScreenId("screen1"), Row.A, Col.ONE))
    testFramework.then([
      new SeatReserved(new CustomerId("customer1"), new ScreenId("screen1"), new Seat(Row.A, Col.ONE)),
    ])
  })

  it("If not available, the seats should not be reserved.", async () => {
    testFramework.given([
      new ScreenScheduled(new ScreenId("screen1"), new Date()),
      new SeatReserved(new CustomerId("customer1"), new ScreenId("screen1"), new Seat(Row.A, Col.ONE)),
    ])
    testFramework.when(new ReserveSeat(new CustomerId("customer1"), new ScreenId("screen1"), Row.A, Col.ONE))
    testFramework.then([
      new SeatReservationRefused(new CustomerId("customer1"), new ScreenId("screen1"), new Seat(Row.A, Col.ONE)),
    ])
  })
})
