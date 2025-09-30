// src/stores/api/student.api.ts

import { Student } from "../../types/student.type";

// Re-export Student interface from student.type.ts

/**
 * API interface สำหรับ Student data จาก backend
 */
export interface ApiStudent {
  student_id: string;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  first_name_tha?: string;
  last_name_tha?: string;
  full_name: string;
  email: string;
  phone: string;
  department: {
    department_id: number;
    department_name_tha: string;
    department_name_eng: string;
    department_short_name: string;
  };
  year: number;
  status: "Normal" | "Risk";
  risk_level: number;
  risk_status: "Normal" | "Risk";
  education_status: "Studying" | "Graduate";
  created_at: string;
  updated_at: string;
}

/**
 * API interface สำหรับ Department data จาก backend
 */
export interface ApiDepartment {
  department_id: number;
  department_name_tha: string;
  department_name_eng: string;
  department_short_name: string;
  created_at: string;
  updated_at: string;
}
