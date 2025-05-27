import { create } from "zustand";
import axiosInstance from "../../libs/axios";
import { AxiosError } from "axios";

// ✅ อินเทอร์เฟซสำหรับข้อมูลที่มาจาก API
interface ApiActivity {
  ac_id: number;
  ac_name: string;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_room: string;
  ac_seat: number;
  ac_food: string[];
  ac_status: string;
  ac_start_register: Date;
  ac_end_register: Date;
  ac_create_date: Date;
  ac_last_update: Date;
  ac_registered_count: number;
  ac_attended_count: number;
  ac_not_attended_count: number;
  ac_start_time: Date;
  ac_end_time: Date;
  ac_image_url: string;
}

// ✅ อินเทอร์เฟซที่ React ใช้งาน
interface Activity {
  id: string;
  name: string;
  description: string;
  type: "Hard Skill" | "Soft Skill";
  start_time: Date;
  seat: string;
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
      console.log("🚀 Fetching data from API..."); // ✅ Log ก่อนเรียก API
      const { data } = await axiosInstance.get<ApiActivity[]>(
        "/activity/acitvities"
      );

      console.log("✅ API Response:", data); // ✅ Log ค่า data ที่ได้

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

  updateActivityStatus: async (
    id: string,
    currentStatus: "Public" | "Private"
  ) => {
    set({ activityLoading: true });

    try {
      const newStatus = currentStatus === "Public" ? "Private" : "Public";

      console.log(
        `🔄 กำลังส่ง API เพื่ออัปเดตสถานะ -> ID: ${id}, สถานะใหม่: ${newStatus}`
      );

      // ✅ ส่งค่า ac_status ให้ตรงกับ API
      await axiosInstance.patch(`/activity/adjustActivity/${id}`, {
        ac_status: newStatus.toLowerCase(), // Convert "Public" -> "public"
      });

      console.log(`✅ อัปเดตสถานะสำเร็จ -> ID: ${id}, สถานะใหม่: ${newStatus}`);

      // ✅ โหลดข้อมูลใหม่อีกครั้งเพื่อให้แน่ใจว่าข้อมูลอัปเดต
      await get().fetchActivities();
    } catch (error) {
      console.error("❌ Error updating activity status:", error);
      set({ activityLoading: false });
    }
  },

  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      console.log("🔄 ค้นหาว่าง → โหลดข้อมูลทั้งหมด");
      get().fetchActivities(); // ✅ โหลดข้อมูลทั้งหมดแทน
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });

    try {
      const { data } = await axiosInstance.get(`/activity/searchActivity`, {
        params: { ac_name: searchName }, // ✅ เปลี่ยนให้ตรงกับ backend
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
