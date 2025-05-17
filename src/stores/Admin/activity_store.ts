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
  ac_state: string;
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

// ✅ อินเทอร์เฟซสำหรับข้อมูลนิสิตที่ลงทะเบียน
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
  activities: Activity[];
  searchResults: Activity[] | null;
  activityError: string | null;
  activityLoading: boolean;
  activity: Activity | null;
  enrolledStudents: EnrolledStudent[];
  fetchActivities: () => Promise<void>;
  searchActivities: (query: string) => Promise<void>;
  updateActivityStatus: (
    id: string,
    currentStatus: "Public" | "Private"
  ) => Promise<void>;
  fetchActivity: (id: number) => Promise<void>;
  fetchEnrolledStudents: (id: number) => Promise<void>;
}

// ✅ ฟังก์ชันแปลงข้อมูลจาก API เป็นรูปแบบที่ React ใช้งานได้
const mapActivityData = (apiData: ApiActivity): Activity => ({
  id: apiData.ac_id.toString(),
  name: apiData.ac_name || "ไม่ระบุชื่อ",
  description: apiData.ac_description || "ไม่ระบุรายละเอียด",
  type: apiData.ac_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
  start_time: new Date(apiData.ac_start_time),
  registerant_count: apiData.ac_registered_count ?? 0,
  seat: `${apiData.ac_seat}/${apiData.ac_registered_count ?? 0}`,
  status: apiData.ac_status.toLowerCase() === "public" ? "Public" : "Private",
  ac_food: apiData.ac_food ?? [], // ✅ แก้ให้ `ac_food` มีค่าเริ่มต้นเป็น `[]`
});

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledStudents: [],

  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });

    try {
      const { data } = await axiosInstance.get<ApiActivity[]>(
        "/activity/get-activities"
      ); // ✅ เปลี่ยน URL ให้ตรงกับ Backend
      if (Array.isArray(data) && data.length > 0) {
        set({ activities: data.map(mapActivityData), activityLoading: false });
      } else {
        set({ activities: [], activityLoading: false });
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        activityError:
          err.response?.data?.message ?? "Error fetching activities",
        activityLoading: false,
      });
    }
  },

  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      get().fetchActivities();
      set({ searchResults: null });
      return;
    }
    set({ activityLoading: true, activityError: null });
    try {
      const { data } = await axiosInstance.get(`/activity/searchActivity`, {
        params: { ac_name: searchName },
      });
      set({
        searchResults: Array.isArray(data) ? data.map(mapActivityData) : [],
        activityLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        activityError:
          err.response?.data?.message ?? "Error searching activities",
        activityLoading: false,
      });
    }
  },

  updateActivityStatus: async (id, currentStatus) => {
    set({ activityLoading: true });
    try {
      const newStatus = currentStatus === "Public" ? "Private" : "Public";
      await axiosInstance.patch(`/activity/adjustActivity/${id}`, {
        ac_status: newStatus.toLowerCase(),
      });
      await get().fetchActivities();
    } catch (error) {
      set({ activityLoading: false });
    }
  },

  fetchActivity: async (id) => {
    if (!id || isNaN(id)) {
      set({
        activityError: "Invalid Activity ID",
        activityLoading: false,
        activity: null,
      });
      return;
    }

    set({ activityLoading: true, activityError: null, activity: null });

    try {
      const { data } = await axiosInstance.get<ApiActivity>(
        `/activity/get-activity/${id}`
      );

      // ✅ ตรวจสอบค่าที่อาจเป็น undefined หรือ null
      const safeData = {
        ...data,
        ac_food: data.ac_food || [], // ป้องกัน undefined
        ac_start_time: data.ac_start_time
          ? new Date(data.ac_start_time).toLocaleString("th-TH")
          : "ไม่ระบุ",
        ac_end_time: data.ac_end_time
          ? new Date(data.ac_end_time).toLocaleString("th-TH")
          : "ไม่ระบุ",
      };

      console.log("📌 ข้อมูลที่ถูกต้องจาก API:", safeData);
      set({ activity: safeData, activityLoading: false });
    } catch (error: any) {
      set({
        activityError:
          error.response?.data?.message || "Error fetching activity",
        activityLoading: false,
        activity: null,
      });
    }
  },

  fetchEnrolledStudents: async (id) => {
    if (!id || isNaN(id)) {
      set({
        activityError: "Invalid Activity ID",
        activityLoading: false,
        enrolledStudents: [],
      });
      return;
    }
    set({ activityLoading: true, activityError: null, enrolledStudents: [] });
    try {
      const { data } = await axiosInstance.get<{ users?: EnrolledStudent[] }>(
        `/activity/get-enrolled/${id}`
      );
      set({ enrolledStudents: data?.users || [], activityLoading: false });
    } catch (error: any) {
      set({
        activityError:
          error.response?.data?.message || "Error fetching enrolled students",
        activityLoading: false,
        enrolledStudents: [],
      });
    }
  },
}));
