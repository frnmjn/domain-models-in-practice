import { Row, Col, Seat } from "../src/value_object/seat"
import { ScreenId } from "../src/value_object/screen"
import { CustomerId } from "../src/value_object/customer"
import { SeatChosen, SeatChosenRefused, ScreenScheduled } from "../src/aggregate/events"
import { TestFramework } from "./framework"
import { ChooseSeat } from "../src/command_handler/choose_seat_handler"
import moment from "moment"

describe("A Customer choose specific seats at a specific screening (for simplicity, assume there exists only one screening)", () => {
  let testFramework: TestFramework
  const screen1 = new ScreenId("screen1")
  const customer1 = new CustomerId("customer1")
  const customer2 = new CustomerId("customer2")
  const tomorrow = moment().add(1, "days").toDate()

  beforeEach(() => {
    testFramework = new TestFramework()
  })

  it("If available, the seats should be chosen.", async () => {
    testFramework.given([new ScreenScheduled(screen1, tomorrow)])
    testFramework.when(new ChooseSeat(customer1, screen1, Row.A, Col.ONE))
    testFramework.then([new SeatChosen(customer1, screen1, new Seat(Row.A, Col.ONE))])
  })

  it("If not available, the seats should not be chosen.", async () => {
    testFramework.given([
      new ScreenScheduled(screen1, tomorrow),
      new SeatChosen(customer1, screen1, new Seat(Row.A, Col.ONE)),
    ])
    testFramework.when(new ChooseSeat(customer2, screen1, Row.A, Col.ONE))
    testFramework.then([new SeatChosenRefused(customer2, screen1, new Seat(Row.A, Col.ONE))])
  })

  it("If available but 15 mins before start, the seats should not be chosen.", async () => {
    testFramework.given([new ScreenScheduled(screen1, new Date())])
    testFramework.when(new ChooseSeat(customer1, screen1, Row.A, Col.ONE))
    testFramework.then([new SeatChosenRefused(customer1, screen1, new Seat(Row.A, Col.ONE))])
  })
})
