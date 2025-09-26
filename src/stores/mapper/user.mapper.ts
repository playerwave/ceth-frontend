// src/stores/mapper/user.mapper.ts

import { ApiStudent, ApiDepartment, Student } from "../api/user.api";
import { Department } from "../../types/department.type";

/**
 * แปลง ApiStudent → Student (ใช้ใน React & store)
 */
export function mapApiToStudent(apiStudent: ApiStudent): Student {
  return {
    student_id: apiStudent.student_id,
    user_id: apiStudent.user_id,
    first_name: apiStudent.first_name,
    last_name: apiStudent.last_name,
    first_name_tha: apiStudent.first_name_tha,
    last_name_tha: apiStudent.last_name_tha,
    full_name: apiStudent.full_name,
    email: apiStudent.email,
    phone: apiStudent.phone,
    department: {
      department_id: apiStudent.department.department_id,
      department_name: apiStudent.department.department_name,
      department_short_name: apiStudent.department.department_short_name,
      created_at: apiStudent.created_at,
      updated_at: apiStudent.updated_at,
    },
    year: apiStudent.year,
    status: apiStudent.status,
    risk_level: apiStudent.risk_level,
    risk_status: apiStudent.risk_status,
    education_status: apiStudent.education_status,
    created_at: apiStudent.created_at,
    updated_at: apiStudent.updated_at,
  };
}

/**
 * แปลง Array<ApiStudent> → Array<Student>
 */
export function mapApiToStudents(apiStudents: ApiStudent[]): Student[] {
  return apiStudents.map(mapApiToStudent);
}

/**
 * แปลง ApiDepartment → Department
 */
export function mapApiToDepartment(apiDepartment: ApiDepartment): Department {
  return {
    department_id: apiDepartment.department_id,
    department_name: apiDepartment.department_name,
    department_short_name: apiDepartment.department_short_name,
  };
}

/**
 * แปลง Array<ApiDepartment> → Array<Department>
 */
export function mapApiToDepartments(apiDepartments: ApiDepartment[]): Department[] {
  return apiDepartments.map(mapApiToDepartment);
}
