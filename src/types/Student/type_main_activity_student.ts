// stores/Student/Main/main_activity_student.type.ts

export interface MainActivity {
<<<<<<< HEAD
  ac_end_time: string | number | Date;
=======
>>>>>>> 479485fc736f097c34d732b1d3337cc61cb44b04
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
<<<<<<< HEAD
  ac_start_assessment: Date | null;
  ac_end_assessment: Date | null;

=======
>>>>>>> 479485fc736f097c34d732b1d3337cc61cb44b04
}


export interface MainActivityState {
  enrolledActivities: MainActivity[];
  activityLoading: boolean;
  activityError: string | null;
  fetchEnrolledActivities: (userId: string) => Promise<void>;
}
