export type RiskStatus = "Normal" | "Risk";
export type EducationStatus = "Studying" | "Graduate";
export type StudentStatus = "Active" | "InActive";

export interface Student {
  students_id: number;
  users_id: number;
  first_name: string;
  last_name: string;
  email: string;
  risk_status: RiskStatus;
  education_status: EducationStatus;
  soft_hours: number;
  hard_hours: number;
  faculty_id: number;
  department_id: number;
  grade_id: number;
  eventcoop_id: number;
  status: StudentStatus;
}

export type SkillType = "Hard Skill" | "Soft Skill";

export interface StudentActivity {
  id: number;
  name: string;
  hours: number;
  type: SkillType;
  status: "Public" | "Private";
  recommend?: "yes" | "no";
}

export interface StudentWithActivities extends Student {
  selectedActivities: StudentActivity[];
}