import {TableColumnWeeklyGoal} from "./index";

export default interface TableFooter {
  goalOne: number,
  goalTwo: number,
  weeklyGoals: Array<TableColumnWeeklyGoal>
}
