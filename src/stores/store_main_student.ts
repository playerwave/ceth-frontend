import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../libs/axios";
import { AxiosError } from "axios";


// ✅ รูปแบบข้อมูลที่มาจาก API
interface Activity {
  ac_id: number;
  ac_name: string;
  ac_description: string;
  ac_type: "Hard Skill" | "Soft Skill";
  ac_start_time: string;
  ac_end_time: string;
  ac_seat: string;
  ac_status: "Public" | "Private";
  u_soft_hours: number; // ✅ เวลาสะสม Soft Skill
  u_hard_hours: number; // ✅ เวลาสะสม Hard Skill
}

// ✅ State สำหรับจัดการกิจกรรม
interface ActivityState {
  activities: Activity[];
  softSkillCount: number;
  hardSkillCount: number;
  activityLoading: boolean;
  activityError: string | null;
  fetchActivitiesByStudentId: (studentId: string) => Promise<void>;
  fetchSkillStats: (studentId: string) => Promise<void>;
}

// ✅ ใช้ Zustand Store
export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  softSkillCount: 0,
  hardSkillCount: 0,
  activityLoading: false,
  activityError: null,
  

  // ✅ ดึงข้อมูลกิจกรรมของนักศึกษา
  fetchActivitiesByStudentId: async (studentId: string) => {
    set({ activityLoading: true, activityError: null });
  
    try {
      console.log(`🚀 Fetching activities for student ID: ${studentId}`);
      const { data } = await axiosInstance.get<Activity[]>(
        `/api/student/activity/fetchEnrolledActivities/${studentId}`
      );
  
      console.log("✅ API Response:", data);
  
      const formattedData = data.map((item) => ({
        ac_id: item.ac_id,
        ac_name: item.ac_name,
        ac_description: item.ac_description,
        ac_type: item.ac_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
        ac_start_time: item.ac_start_time
          ? new Date(item.ac_start_time).toLocaleString("th-TH", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "ไม่ระบุ",
        ac_end_time: item.ac_end_time
          ? new Date(item.ac_end_time).toLocaleString("th-TH", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "ไม่ระบุ",
        ac_seat: `${item.ac_seat}`,
        u_soft_hours: item.u_soft_hours ?? 0,
        u_hard_hours: item.u_hard_hours ?? 0,
      })) as Activity[];
  
      set({ activities: formattedData, activityLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      set({
        activityError: err.response?.data?.error ?? "Error fetching activities",
        activityLoading: false,
      });
  
      console.error("❌ Error fetching activities:", err);
    }
  },
  

  // ✅ ดึงข้อมูล Soft Skill & Hard Skill รวมจาก Backend
// ✅ ดึงข้อมูล Soft Skill & Hard Skill รวมจาก Backend
fetchSkillStats: async (studentId: string) => {
    try {
        console.log(`🚀 Fetching skill stats for student ID: ${studentId}`);
        
        const { data } = await axiosInstance.get<{ softSkill: number; hardSkill: number }>(
            `/api/student/activity/skillStats/${studentId}`
        );

      

        // ✅ อัปเดต Zustand Store
        set({ softSkillCount: data.softSkill, hardSkillCount: data.hardSkill });

        console.log("🔄 Zustand Store Updated:", {
            softSkillCount: data.softSkill,
            hardSkillCount: data.hardSkill
        });
    } catch (error) {
        console.error("❌ Error fetching skill stats:", error);
    }
}






}));
