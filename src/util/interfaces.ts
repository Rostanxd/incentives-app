export interface Month {
  name: string,
  value: number,
}

interface TableColumn {
  alias: string,
  dateFrom: string,
  dateEnd: string,
}

export interface TableHeaderWeeklyGoal extends TableColumn {

}

export interface TableColumnWeeklyGoal extends TableColumn {
  value: number,
}

export interface TableRow {
  storeId: string,
  storeName?: string,
  goalOne: number,
  goalTwo: number,
  status?: string,
  weeklyGoals: Array<TableColumnWeeklyGoal>
}

export interface TableFooter {
  goalOne: number,
  goalTwo: number,
  weeklyGoals: Array<TableColumnWeeklyGoal>
}

//  Structure that coming from APIs
export interface WeeklyGoal {
  desde: string,
  hasta: string,
  meta: number,

  [key: string]: any
}

export interface StoreData {
  "localId": string,
  "local"?: string,
  "estado"?: string,
  "meta_uno": number,
  "meta_dos": number,
  "metas_semanales": Array<WeeklyGoal>
}
