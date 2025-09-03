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


// ใน assessment.api.ts หรือไฟล์ใหม่
export interface ApiSetNumber {
  set_number_id: number;
  name: string;
  status: string;
}

