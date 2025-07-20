export interface ApiAssessment {
  assessment_id: number;
  assessment_name: string;
  description: string;
  create_date: string; // ISO format
  last_update: string; // ISO format
  assessment_status: "Not finished" | "Finished" | "Unsuccessful";
  set_number_id: number;
  status: "Active" | "Inactive";
}
