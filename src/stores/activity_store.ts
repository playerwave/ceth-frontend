import { create } from "zustand";
import axiosInstance from "../libs/axios";

interface Activity {
  ac_id: number;
  ac_name: string;
  ac_description: string;
  ac_start_time: string;
  ac_end_time: string;
  ac_room: string;
  ac_food: string[];
  ac_registerant_count: number;
  ac_seat: number;
  ac_state: string;
  ac_type: string;
  ac_company_lecturer: string;
}

// ✅ เพิ่ม interface สำหรับข้อมูลนิสิตที่ลงทะเบียน
interface EnrolledStudent {
  id: string;
  name: string;
  department: string;
  status: string;
  checkIn: string;
  checkOut: string;
  evaluated: string;
}

interface ActivityState {
  activity: Activity | null;
  enrolledStudents: EnrolledStudent[]; // ✅ เก็บข้อมูลนิสิตที่ลงทะเบียน
  isLoading: boolean;
  error: string | null;
  fetchActivity: (id: number) => Promise<void>;
  fetchEnrolledStudents: (id: number) => Promise<void>; // ✅ ดึงข้อมูลนิสิตที่ลงทะเบียน
}

export const useActivityStore = create<ActivityState>((set) => ({
  activity: null,
  enrolledStudents: [], // ✅ ให้เริ่มต้นเป็น array ว่าง
  isLoading: false,
  error: null,

  // ✅ ฟังก์ชันดึงข้อมูลกิจกรรม
  fetchActivity: async (id) => {
    if (!id || isNaN(id)) {
      console.error("❌ Invalid Activity ID:", id);
      set({ error: "Invalid Activity ID", isLoading: false, activity: null });
      return;
    }

    set({ isLoading: true, error: null, activity: null });

    try {
      console.log(`📡 Calling API: /activity/get-activity/${id}`);
      const { data } = await axiosInstance.get<{ activity: Activity }>(
        `/activity/get-activity/${id}`
      );
      console.log("📌 API Response Data:", data);
      set({ activity: data.activity, isLoading: false });
    } catch (error: any) {
      console.error("❌ API Error:", error);
      set({
        error: error.response?.data?.message || "Error fetching activity",
        isLoading: false,
        activity: null,
      });
    }
  },

  // ✅ ฟังก์ชันดึงข้อมูลนิสิตที่ลงทะเบียน
  fetchEnrolledStudents: async (id) => {
    if (!id || isNaN(id)) {
      console.error("❌ Invalid Activity ID:", id);
      set({ error: "Invalid Activity ID", isLoading: false, enrolledStudents: [] });
      return;
    }

    set({ isLoading: true, error: null, enrolledStudents: [] });

    try {
      console.log(`📡 Calling API: /activity/get-enrolled/${id}`);
      const { data } = await axiosInstance.get<{ users?: EnrolledStudent[] }>( // ✅ เปลี่ยนจาก enrolledStudents เป็น users
        `/activity/get-enrolled/${id}`
      );
      console.log("📌 API Response Data:", data);
      set({ enrolledStudents: data?.users || [], isLoading: false }); // ✅ ใช้ data?.users || [] เพื่อป้องกัน undefined
    } catch (error: any) {
      console.error("❌ API Error:", error);
      set({
        error: error.response?.data?.message || "Error fetching enrolled students",
        isLoading: false,
        enrolledStudents: [], // ✅ ป้องกัน undefined
      });
    }
  },
}));
