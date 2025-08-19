// stores/Student/Main/main_activity_student.type.ts

export interface MainActivity {
  ac_end_time: string | number | Date;
  ac_id: number;
  ac_name: string;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: "Soft Skill" | "Hard Skill"; // 🔁 ใช้ Union Type เพื่อให้ตรงกับตาราง
  ac_start_time: string;
  ac_seat: number;
  ac_status: "Public" | "Private";
  ac_registered_count: number;
  ac_state: "Enrolled" | "Not Start" | "Ended"; // ✅ เพิ่มฟิลด์นี้
  ac_start_assessment: Date | null;
  ac_end_assessment: Date | null;
  activity_state?: "Not Start" | "Special Open Register" | "Open Register" | "Close Register" | "Start Activity" | "End Activity" | "Start Assessment" | "End Assessment"; // ✅ เพิ่มฟิลด์ activity_state
}

export interface MainActivityState {
  enrolledActivities: MainActivity[];
  activityLoading: boolean;
  activityError: string | null;
  fetchEnrolledActivities: (userId: string) => Promise<void>;
}
