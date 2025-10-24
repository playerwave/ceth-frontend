import { ApiAssessment } from "../api/assessment.api";
import { Assessment } from "@/types/assessment/assessment.type";

export function mapApiToAssessment(api: ApiAssessment): Assessment {
  return {
    assessment_id: api.assessment_id,
    assessment_name: api.assessment_name,
    description: api.description || "",
    create_date: api.create_date ? new Date(api.create_date) : new Date(),
    last_update: api.last_update ? new Date(api.last_update) : new Date(),
    assessment_status: api.assessment_status || "Not finished",
    status: api.status || "Active",
  };
}


export function mapApiToAssessments(arr: ApiAssessment[]): Assessment[] {
  console.log("🔄 [AssessmentMapper] Mapping API data:", arr);
  const mapped = arr.map(mapApiToAssessment);
  console.log("✅ [AssessmentMapper] Mapped result:", mapped);
  return mapped;
}
