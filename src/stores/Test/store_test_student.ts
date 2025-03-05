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
  ac_registerant_count: number;
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
}

// ✅ State สำหรับจัดการ Activities
interface ActivityState {
  activities: Activity[];
  searchResults: Activity[] | null;
  activityError: string | null;
  activityLoading: boolean;
  fetchActivities: () => Promise<void>;
  searchActivities: (query: string) => Promise<void>;
}

// ✅ ฟังก์ชันแปลงข้อมูลจาก API เป็นรูปแบบที่ React ใช้งานได้
const mapActivityData = (apiData: ApiActivity): Activity => ({
  id: apiData.ac_id.toString(),
  name: apiData.ac_company_lecturer || "ไม่ระบุชื่อ",
  description: apiData.ac_name || "ไม่ระบุชื่อ",
  type: apiData.ac_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
  start_time: apiData.ac_start_time || "ไม่ระบุ",
  seat: `${apiData.ac_seat} ที่นั่ง`,
  status: apiData.ac_status.toLowerCase() === "public" ? "Public" : "Private",
});

// ✅ ใช้ Zustand เพื่อสร้าง Store สำหรับ Activities
export const useAppStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,

  // ✅ ฟังก์ชันดึงข้อมูล Activities (กรองเฉพาะ Public)
  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });

    try {
      console.log("🚀 Fetching data from API...");
      const { data } = await axiosInstance.get<ApiActivity[]>("/activities");

      console.log("✅ API Response:", data);

      if (Array.isArray(data) && data.length > 0) {
        // 🔹 กรองเฉพาะกิจกรรมที่เป็น "Public"
        const mappedActivities = data
          .map(mapActivityData)
          .filter((activity) => activity.status === "Public");

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

  // ✅ ฟังก์ชันค้นหา Activities (กรองเฉพาะ Public)
  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      console.log("🔄 ค้นหาว่าง → โหลดข้อมูลทั้งหมด");
      get().fetchActivities();
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });

    try {
      const { data } = await axiosInstance.get<ApiActivity[]>(
        "/searchActivity",
        {
          params: { ac_name: searchName },
        }
      );

      console.log(
        "🔍 กำลังค้นหากิจกรรมที่:",
        `http://localhost:5090/student/searchActivity?ac_name=${searchName}`
      );
      console.log("🔍 ค้นหา API Response:", data);

      if (Array.isArray(data) && data.length > 0) {
        // 🔹 กรองเฉพาะกิจกรรมที่เป็น "Public"
        const mappedResults = data
          .map(mapActivityData)
          .filter((activity) => activity.status === "Public");

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
