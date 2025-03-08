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
  ac_food?: string[];
  ac_status: string;
  ac_start_register?: Date;
  ac_end_register?: Date;
  ac_create_date?: Date;
  ac_last_update?: Date;
  ac_registered_count: number;
  ac_attended_count?: number;
  ac_not_attended_count?: number;
  ac_start_time?: Date;
  ac_end_time?: Date;
  ac_image_data?: string;
  ac_state: string;
}

// ✅ อินเทอร์เฟซที่ React ใช้งาน
interface Activity {
  id: string;
  name: string;
  company_lecturer: string;
  description: string;
  type: "Hard Skill" | "Soft Skill";
  room: string;
  seat: string;
  food: string[];
  status: string;
  start_register: Date | null;
  end_register: Date | null;
  create_date: Date | null;
  last_update: Date | null;
  registered_count: number;
  attended_count: number;
  not_attended_count: number;
  start_time: Date | null;
  end_time: Date | null;
  image_data: string;
  state: string;
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
  fetchActivity: (id: number | string) => Promise<void>;
  fetchEnrolledStudents: (id: number | string) => Promise<void>;
  createActivity: (activity: ApiActivity) => Promise<void>;
}

const mapActivityData = (apiData: ApiActivity): Activity => ({
  id: apiData.ac_id.toString(),
  name: apiData.ac_name || "ไม่ระบุชื่อ",
  company_lecturer: apiData.ac_company_lecturer || "ไม่ระบุวิทยากร",
  description: apiData.ac_description || "ไม่ระบุรายละเอียด",
  type: apiData.ac_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
  room: apiData.ac_room || "ไม่ระบุห้อง",
  seat: `${apiData.ac_seat}`,
  food: Array.isArray(apiData.ac_food) ? apiData.ac_food : [],
  status: apiData.ac_status.toLowerCase() === "public" ? "Public" : "Private",
  start_register: apiData.ac_start_register || null,
  end_register: apiData.ac_end_register || null,
  create_date: apiData.ac_create_date || null,
  last_update: apiData.ac_last_update || null,
  registered_count: apiData.ac_registered_count ?? 0,
  attended_count: apiData.ac_attended_count ?? 0,
  not_attended_count: apiData.ac_not_attended_count ?? 0,
  start_time: apiData.ac_start_time || null,
  end_time: apiData.ac_end_time || null,

  // ✅ ใช้ Base64 หรือ Default รูปภาพ
  image_data: apiData.ac_image_data || "/img/default.png",

  state: apiData.ac_state || "ไม่ระบุ",
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
      );
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
    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) {
      set({ activityError: "Invalid Activity ID", activityLoading: false });
      return;
    }

    set({ activityLoading: true, activityError: null });

    try {
      const { data } = await axiosInstance.get<ApiActivity>(
        `/activity/get-activity/${numericId}`
      );
      set({ activity: mapActivityData(data), activityLoading: false });
    } catch (error: any) {
      set({
        activityError:
          error.response?.data?.message || "Error fetching activity",
        activityLoading: false,
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

  // ✅ ฟังก์ชันสร้างกิจกรรมใหม่
  createActivity: async (activity: ApiActivity): Promise<void> => {
    set(() => ({ activityLoading: true, activityError: null }));
    try {
      await axiosInstance.post("/activity/create-activity", activity);
      set((state) => ({
        activities: [...state.activities, mapActivityData(activity)],
        activityLoading: false,
        activityError: null,
      }));
    } catch (error: unknown) {
      console.error("❌ Unknown error:", error);
      set(() => ({
        activityError: "An unknown error occurred",
        activityLoading: false,
      }));
    }
  },
}));
