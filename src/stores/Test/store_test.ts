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
}

// ✅ State สำหรับจัดการ Activities เท่านั้น
interface AppState {
  activities: Activity[];
  activityError: string | null;
  activityLoading: boolean;
  fetchActivities: () => Promise<void>;
}

// ✅ ฟังก์ชันแปลงข้อมูลจาก API เป็นรูปแบบที่ React ใช้งานได้
const mapActivityData = (apiData: ApiActivity): Activity => ({
  id: apiData.id.toString(),
  name: apiData.activity_company_lecturer || "ไม่ระบุชื่อ",
  dis: apiData.activity_name || "ไม่ระบุชื่อ",
  type: apiData.activity_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
  date: apiData.activity_date ? apiData.activity_date.split(" ")[0] : "ไม่ระบุ",
  time: apiData.activity_date ? apiData.activity_date.split(" ")[1] : "ไม่ระบุ",
  slots: `${apiData.activity_seat} ที่นั่ง`,
  status: apiData.activity_status.includes("public") ? "Public" : "Private",
});

// ✅ ใช้ Zustand เพื่อสร้าง Store สำหรับ Activities เท่านั้น
export const useAppStore = create<AppState>((set) => ({
  // ✅ ค่าเริ่มต้นของ Activities
  activities: [],
  activityError: null,
  activityLoading: false,

  // ✅ ฟังก์ชันดึงข้อมูล Activities
  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });

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
}));
