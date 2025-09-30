export interface Department {
  department_id: number;
  department_name_eng?: string;
  department_name_tha?: string;
  department_short_name?: string;
  faculty_id?: number | null;
  faculty?: {
    faculty_id: number;
    faculty_name?: string;
    faculty_short_name?: string;
  };
}
