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
    userId: number,
  ) => Promise<Activity | null>;
}
