import { ScreenId } from "../src/value_object/screen"
import { ScreenScheduled } from "../src/aggregate/events"
import { TestFramework } from "./framework"
import { ScreeningListQuery } from "../src/query_handler/screening_list_handler"
import { ScreeningResponse, Screenings } from "../src/read_model/screening_list"

describe("As a Customer i want to see the screen list", () => {
  let testFramework: TestFramework
  const screen1 = new ScreenId("screen1")
  const now = new Date()

  beforeEach(() => {
    testFramework = new TestFramework()
  })

  it("should returns the list of screen", async () => {
    testFramework.given([new ScreenScheduled(screen1, "matrix", now)])
    testFramework.query(new ScreeningListQuery(now))
    testFramework.thenExpect(new ScreeningResponse([new Screenings("matrix", now)]))
  })
})
