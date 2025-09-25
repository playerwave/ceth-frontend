// src/stores/api/user.api.ts
import { Department } from "../../types/model";

/**
 * Extended Student interface for user management
 */
export interface Student {
  student_id: string;
  user_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  department: {
    department_id: number;
    department_name: string;
    department_short_name: string;
    created_at: string;
    updated_at: string;
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
 * API interface สำหรับ Student data จาก backend
 */
export interface ApiStudent {
  student_id: string;
  user_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  department: {
    department_id: number;
    department_name: string;
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
  department_name: string;
  department_short_name: string;
  created_at: string;
  updated_at: string;
}
