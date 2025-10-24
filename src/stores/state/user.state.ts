import { ApiStudent as Student } from "../api/student.api";

export interface UserState {
  students: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  error: string | null;
  
  // Functions
  fetchStudentsByDepartment: (departmentCode: string) => Promise<void>;
  fetchAllStudents: () => Promise<void>;
  selectStudent: (id: number) => void;
  clearSelectedStudent: () => void;
  searchStudents: (searchTerm: string) => Promise<void>;
  filterStudentsByYear: (years: number[]) => void;
  filterStudentsByStatus: (statuses: string[]) => void;
}
