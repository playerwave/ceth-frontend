export interface Student {
  students_id: number;
  users_id: number;
  first_name_eng?: string;
  last_name_eng?: string;
  first_name_tha?: string;
  last_name_tha?: string;
  email?: string;
  soft_hours?: number;
  hard_hours?: number;
  risk_status?: "Normal" | "Risk";
  education_status?: "Studying" | "Graduate";
  faculty_id?: number;
  department_id?: number;
  grade_id?: number;
  status?: "Active" | "InActive";
  eventcoop_id?: number;
}
