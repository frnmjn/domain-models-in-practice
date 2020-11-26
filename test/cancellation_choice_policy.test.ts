import { Row, Col, Seat } from "../src/value_object/seat"
import { ScreenId } from "../src/value_object/screen"
import { CustomerId } from "../src/value_object/customer"
import { SeatChosen, ScreenScheduled, OneMinutePassed } from "../src/aggregate/events"
import { CancellationChoice } from "../src/command_handler/cancellation_choice_handler"
import { TestFramework } from "./framework"
import moment from "moment"

describe("When a minute is passed", () => {
  let testFramework: TestFramework
  const screen1 = new ScreenId("screen1")
  const customer1 = new CustomerId("customer1")
  const tomorrow = moment().add(1, "days").toDate()
  const thirteenMinutesAgo = moment().subtract(13, "minutes").toDate()
  const seat1 = new Seat(Row.A, Col.ONE)

  beforeEach(() => {
    testFramework = new TestFramework()
  })

  it("should be cancelled  all the seat chosen from 12 mins if the reservation process is not over", async () => {
    testFramework.given([
      new ScreenScheduled(screen1, tomorrow),
      new SeatChosen(customer1, screen1, seat1, thirteenMinutesAgo),
    ])
    testFramework.whenEvent(new OneMinutePassed())
    testFramework.thenTrigger([new CancellationChoice(customer1, screen1, seat1.row, seat1.col)])
  })
})
