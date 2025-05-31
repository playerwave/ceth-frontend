import { Activity } from "./type_activity_info_admin";

export interface EnrolledStudent {
  id: string;
  name: string;
  department: string;
  status: string;
  checkIn: string;
  checkOut: string;
  evaluated: string;
  selectedfood: string;
}

export interface EnrolledStudentState {
  activityLoading: boolean;
  activity: Activity | null;
  enrolledStudents: EnrolledStudent[];
  fetchActivity: (id: number | string) => Promise<void>;
  fetchEnrolledStudents: (id: number | string) => Promise<void>;
}