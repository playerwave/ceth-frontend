import { ApiSetNumber } from "../api/setNumber.api";
import { SetNumber } from "../../types/assessment/setnumber.type";

export function mapApiToSetNumber(api: ApiSetNumber): SetNumber {
  return {
    set_number_id: api.set_number_id,
    name: api.name,
    status: api.status as "Active" | "Inactive",
    assessment_id: api.assessment_id, // ✅ เพิ่มตรงนี้
  };
}

export function mapApiToSetNumbers(arr: ApiSetNumber[]): SetNumber[] {
  return arr.map(mapApiToSetNumber);
}
