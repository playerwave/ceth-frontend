// import { Activity } from "../../types/model";

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

import { Activity } from "../../types/model";

export interface ActivityState {
  activities: Activity[];
  searchResults: Activity[] | null;
  recommendedIds: number[];
  activityError: string | null;
  activityLoading: boolean;
  activity: Activity | null;
  enrolledActivities: Activity[];

  // เพิ่มฟังก์ชันที่จำเป็น
  fetchStudentActivities: (userId: number) => Promise<void>; // เพิ่มฟังก์ชันนี้
  searchActivities: (searchName: string) => Promise<void>;
  fetchActivity: (
    id: number | string,
    userId: number
  ) => Promise<Activity | null>;

  fetchEnrolledActivities: (userId: number) => Promise<void>;
  enrollActivity: (
    userId: number,
    activityId: number,
    food: string[]
  ) => Promise<void>;
  unenrollActivity: (userId: number, activityId: number) => Promise<void>;
}



