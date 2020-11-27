import { Day, ScreeningList } from "../read_model/screening_list"
import { Query, QueryHandler, ReadModelResponse } from "../infra/arch"
import moment from "moment"

// Query
export class ScreeningListQuery implements Query {
  constructor(readonly date: Date) {}
}

// Query Handler
export class ScreeningListQueryHandler implements QueryHandler<ScreeningListQuery> {
  constructor(
    private readonly screeningList: ScreeningList,
    private readonly response: (res: ReadModelResponse) => void
  ) {}

  canHandle(query: Query) {
    return query instanceof ScreeningListQuery
  }

  handleQuery(screeningListQuery: ScreeningListQuery) {
    const day = new Day(moment(screeningListQuery.date).startOf("day").toDate())
    const screeningListResponse = this.screeningList.of(day)
    this.response({ data: screeningListResponse })
    return "OK"
  }
}
