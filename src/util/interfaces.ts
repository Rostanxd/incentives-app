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
export interface SdtLibretaMetasLocalesSemana {
  linea?: number,
  fecha_desde: string,
  fecha_hasta: string,
  meta: number,
  [key: string]: any
}

export interface SdtLibretaMetasLocal {
  local_id: string,
  local_nombre?: string,
  estado?: string,
  meta_mensual_uno: number,
  meta_mensual_dos: number,
  semanas: Array<SdtLibretaMetasLocalesSemana>
}

export interface SdtLibretaMetas {
  anio: number,
  mes: number,
  locales: Array<SdtLibretaMetasLocal>
}

export interface LibretasMetasData {
  SdtLibretaMetas: SdtLibretaMetas,
}
