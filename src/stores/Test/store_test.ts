import { create } from "zustand";
import axiosInstance from "../../libs/axios";
import { AxiosError } from "axios";

// ✅ อินเทอร์เฟซสำหรับข้อมูลที่มาจาก API
interface ApiActivity {
  id: number;
  activity_company_lecturer: string;
  activity_name: string;
  activity_type: string;
  activity_date: string;
  activity_seat: number;
  activity_status: string[];
}

// ✅ อินเทอร์เฟซที่ React ใช้งาน
interface Activity {
  id: string;
  name: string;
  dis: string;
  type: "Hard Skill" | "Soft Skill";
  date: string;
  time: string;
  slots: string;
  status: "Public" | "Private";
  registerant_count: number;
}

// test comment
interface UserState {
  users: User[];
  error: string | null;
  isLoading: boolean;
  message: string | null;
  fetchUsers: () => Promise<User[]>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  error: null,
  isLoading: false,
  message: null,

  fetchUsers: async () => {
    set(() => ({ isLoading: true, error: null }));

    try {
      const { data } = await axiosInstance.get<ApiActivity[]>("/api/activitys");
      console.log("✅ API Response:", data); // 🔍 ตรวจสอบค่าจริงที่ API ส่งมา

      if (Array.isArray(data) && data.length > 0) {
        const mappedActivities = data.map(mapActivityData);
        set({ activities: mappedActivities, activityLoading: false });
        console.log("✅ อัปเดต activities:", mappedActivities);
      } else {
        console.warn("⚠️ API ส่งข้อมูลว่างเปล่า:", data);
        set({ activities: [], activityLoading: false });
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ?? "Error fetching activities";
      set({ activityError: errorMessage, activityLoading: false });

      console.error("❌ Error fetching activities:", err);
    }
  },

  // ✅ ฟังก์ชันค้นหา Activities
  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      console.log("🔄 ค้นหาว่าง → โหลดข้อมูลทั้งหมด");
      get().fetchActivities(); // ✅ โหลดข้อมูลทั้งหมดแทน
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });

    try {
      const { data } = await axiosInstance.get(`/api/activities/searchName`, {
        params: { searchName }, // ✅ เปลี่ยน URL ให้ตรงกับ backend
      });
      set({ searchResults: data });

      console.log("🔍 ค้นหา API Response:", data);

      if (Array.isArray(data) && data.length > 0) {
        const mappedResults = data.map(mapActivityData);
        set({ searchResults: mappedResults, activityLoading: false });
        console.log("✅ ผลลัพธ์จากการค้นหา:", mappedResults);
      } else {
        set({ searchResults: [], activityLoading: false });
        console.warn("⚠️ ไม่พบกิจกรรมที่ตรงกับคำค้นหา:", searchName);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ?? "Error searching activities";
      set({ activityError: errorMessage, activityLoading: false });

      console.error("❌ Error searching activities:", err);
    }
  },
}));
