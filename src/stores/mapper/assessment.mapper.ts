import { ApiAssessment } from "../api/assessment.api";
import { Assessment } from "../../types/model";

export function mapApiToAssessment(api: ApiAssessment): Assessment {
  return {
    assessment_id: api.assessment_id,
    assessment_name: api.assessment_name,
    description: api.description,
    create_date: api.create_date,
    last_update: api.last_update,
    assessment_status: api.assessment_status,
    set_number: api.set_number_id,
    status: api.status,
  };
}

export function mapApiToAssessments(arr: ApiAssessment[]): Assessment[] {
  return arr.map(mapApiToAssessment);
}
