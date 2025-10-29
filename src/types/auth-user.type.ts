export interface AuthUser {
  userId: number;
  username: string;
  role: string;
  role_id: number;
  token: string;
  student?: {
    students_id: number;
    users_id: number;
    first_name: string;
    last_name: string;
    first_name_tha: string;
    last_name_tha: string;
    first_name_eng: string;
    last_name_eng: string;
    email: string;
    soft_hours: number;
    hard_hours: number;
    risk_status: "Normal" | "Risk";
    education_status: "Studying" | "Graduate";
    faculty_id: number;
    department_id: number;
    grade_id: number;
    eventcoop_id: number;
    faculty_name: string;
    department_name: string;
    grade_level: string;
    event_coop_date: string;
  };
  teacher?: {
    teacher_id: number;
    users_id: number;
    first_name: string;
    last_name: string;
    faculty_id: number;
    faculty_name: string;
  };
}
