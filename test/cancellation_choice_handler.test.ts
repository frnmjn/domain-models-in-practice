import { Row, Col, Seat } from "../src/value_object/seat"
import { ScreenId } from "../src/value_object/screen"
import { CustomerId } from "../src/value_object/customer"
import {
  SeatChosen,
  ScreenScheduled,
  SeatChosenCancelled,
  SeatChosenCancellationRefused,
} from "../src/aggregate/events"
import { CancellationChoice } from "../src/command_handler/cancellation_choice_handler"
import { TestFramework } from "./framework"
import moment from "moment"

describe("A Customer choose specific seats at a specific screening (for simplicity, assume there exists only one screening)", () => {
  let testFramework: TestFramework
  const screen1 = new ScreenId("screen1")
  const customer1 = new CustomerId("customer1")
  const tomorrow = moment().add(1, "days").toDate()
  const thirteenMinutesAgo = moment().subtract(13, "minutes").toDate()
  const tenMinutesAgo = moment().subtract(10, "minutes").toDate()
  const seat1 = new Seat(Row.A, Col.ONE)

  beforeEach(() => {
    testFramework = new TestFramework()
  })

  it("should cancelled after 12 mins if the reservation process is not over", async () => {
    testFramework.given([
      new ScreenScheduled(screen1, tomorrow),
      new SeatChosen(customer1, screen1, seat1, thirteenMinutesAgo),
    ])
    testFramework.when(new CancellationChoice(customer1, screen1, Row.A, Col.ONE))
    testFramework.then([new SeatChosenCancelled(customer1, screen1, seat1)])
  })

  it("should not be cancelled after less then 12 mins if the reservation process is over", async () => {
    testFramework.given([
      new ScreenScheduled(screen1, tomorrow),
      new SeatChosen(customer1, screen1, seat1, tenMinutesAgo),
    ])
    testFramework.when(new CancellationChoice(customer1, screen1, Row.A, Col.ONE))
    testFramework.then([new SeatChosenCancellationRefused(customer1, screen1, seat1)])
  })
})
