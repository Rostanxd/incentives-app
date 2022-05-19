import {TableColumnWeeklyGoal} from "./index";

export default interface TableRow {
  storeId: string,
  storeName?: string,
  goalOne: number,
  goalTwo: number,
  status?: string,
  weeklyGoals: Array<TableColumnWeeklyGoal>
}
