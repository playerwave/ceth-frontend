// import { Activity } from "../../types/activity.types";

// export interface ActivityState {
//   activities: Activity[];
//   searchResults: Activity[] | null;
//   recommendedIds: number[];
//   activityError: string | null;
//   activityLoading: boolean;
//   activity: Activity | null;
//   enrolledActivities: Activity[];

//   // เพิ่มฟังก์ชันที่จำเป็น
//   fetchStudentActivities: (userId: number) => Promise<void>; // เพิ่มฟังก์ชันนี้
//   searchActivities: (searchName: string) => Promise<void>;
//   fetchActivity: (
//     id: number | string,
//     userId: number,
//   ) => Promise<Activity | null>;
// }

import { Activity } from "../../types/activity.types";
import { AvailableCourseActivity } from "../api/activity.api";

export interface ActivityState {
  activities: Activity[];
  searchResults: Activity[] | null;
  recommendedIds: number[];
  activityError: string | null;
  activityLoading: boolean;
  activity: Activity | null;
  enrolledActivities: Activity[];
  ongoingActivities: Activity[];
  endedActivities: Activity[];
  availableCourseActivities: AvailableCourseActivity[];

  // เพิ่มฟังก์ชันที่จำเป็น
  fetchEndedActivities: (studentId: number) => Promise<void>; 
  fetchStudentActivities: (userId: number) => Promise<void>; // เพิ่มฟังก์ชันนี้
  searchActivities: (searchName: string, userId: number) => Promise<void>;
  searchEndActivities: (searchName: string, userId: number) => Promise<void>;
  fetchActivity: (
    id: number | string
  ) => Promise<Activity | null>;

  fetchEnrolledActivities: (userId: number) => Promise<void>;
  fetchOngoingActivities: (userId: number) => Promise<void>;
  enrollActivity: (
    userId: number,
    activityId: number,
    food?: string[]
  ) => Promise<void>;
  unenrollActivity: (userId: number, activityId: number) => Promise<void>;
  checkInOutActivity: (
    activityId: number,
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string; studentId?: number; studentInfo?: any }>;
  checkAssessmentStatus: (
    activityId: number,
    studentId: number
  ) => Promise<{ hasSubmitted: boolean; assessmentName?: string; submittedDate?: Date }>;
  
  // ✅ ฟังก์ชันสำหรับดึงกิจกรรม Course ที่พร้อมส่ง Certificate
  fetchAvailableCourseActivities: () => Promise<void>;
}
