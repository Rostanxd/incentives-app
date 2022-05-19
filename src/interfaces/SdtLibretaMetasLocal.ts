import {SdtLibretaMetasLocalesSemana} from "./index";

export default interface SdtLibretaMetasLocal {
  local_id: string,
  local_nombre?: string,
  estado?: string,
  meta_mensual_uno: number,
  meta_mensual_dos: number,
  semanas: Array<SdtLibretaMetasLocalesSemana>
}
