export interface Student {
  student_id: string;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  first_name_eng?: string;
  last_name_eng?: string;
  first_name_tha?: string;
  last_name_tha?: string;
  full_name: string;
  email: string;
  phone?: string;
  department: {
    department_id: number;
    department_name: string;
    department_short_name: string;
    created_at?: string;
    updated_at?: string;
  };
  year: number;
  status: "Normal" | "Risk";
  risk_level?: number;
  risk_status: "Normal" | "Risk";
  education_status: "Studying" | "Graduate";
  created_at?: string;
  updated_at?: string;
  // Additional fields from original interface
  soft_hours?: number;
  hard_hours?: number;
  faculty_id?: number;
  department_id?: number;
  grade_id?: number;
  eventcoop_id?: number;
}
