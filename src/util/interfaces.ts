export interface Month {
  name: string,
  value: number,
}

export interface TableHeaderWeeklyGoal {
  title: string,
}

export interface TableColumnWeeklyGoal {
  name: string,
  value: number,
  dateFrom: string,
  dateEnd: string,
}

export interface TableRow {
  storeId: string,
  storeName?: string,
  goalOne: number,
  goalTwo: number,
  status?: string,
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
