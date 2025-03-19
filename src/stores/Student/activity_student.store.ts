import { create } from "zustand";
import axiosInstance from "../../libs/axios";
import { AxiosError } from "axios";
import { toast, Toaster } from "sonner";
import { act } from "react";

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
  ac_location_type: string;
  ac_start_register?: Date;
  ac_end_register?: Date;
  ac_create_date?: Date;
  ac_last_update?: Date;
  ac_registered_count: number;
  ac_attended_count?: number;
  ac_not_attended_count?: number;
  ac_start_time?: Date;
  ac_end_time?: Date;
  ac_image_url?: string;
  ac_state: string;
  ac_normal_register: string;
  ac_recieve_hours?: number;
  ac_start_assessment?: Date;
  ac_end_assessment?: Date;
  assessment?: {
    as_id: number;
    as_name: string;
    as_type: string;
    as_description: string;
    as_create_date: string;
    as_last_update?: string;
  } | null;
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
  location_type: "Onsite" | "Online" | "Course";
  start_register: Date | null;
  end_register: Date | null;
  create_date: Date | null;
  last_update: Date | null;
  registered_count: number;
  attended_count: number;
  not_attended_count: number;
  start_time: Date | null;
  end_time: Date | null;
  image_url: string;
  state: string;
  normal_register: Date | null;
  recieve_hours: number;
  start_assessment: Date | null;
  end_assessment: Date | null;
  assessment_id: number | null;
  assessment?: {
    as_id: number;
    as_name: string;
    as_type: string;
    as_description: string;
    as_create_date: string;
    as_last_update?: string;
  } | null;
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
  fetchActivity: (id: number | string) => Promise<void>;
  fetchEnrolledStudents: (id: number | string) => Promise<void>;
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
  location_type: apiData.ac_location_type,

  // ✅ แปลง `string` เป็น `Date`
  start_register: apiData.ac_start_register
    ? new Date(apiData.ac_start_register)
    : null,
  end_register: apiData.ac_end_register
    ? new Date(apiData.ac_end_register)
    : null,
  create_date: apiData.ac_create_date ? new Date(apiData.ac_create_date) : null,
  last_update: apiData.ac_last_update ? new Date(apiData.ac_last_update) : null,
  start_time: apiData.ac_start_time ? new Date(apiData.ac_start_time) : null,
  end_time: apiData.ac_end_time ? new Date(apiData.ac_end_time) : null,

  registered_count: apiData.ac_registered_count ?? 0,
  attended_count: apiData.ac_attended_count ?? 0,
  not_attended_count: apiData.ac_not_attended_count ?? 0,

  // ✅ ใช้ Base64 หรือ Default รูปภาพ
  image_url: apiData.ac_image_url || "/img/default.png",
  state: apiData.ac_state || "ไม่ระบุ",
  normal_register: apiData.ac_normal_register
    ? new Date(apiData.ac_normal_register)
    : null,
  recieve_hours: apiData.ac_recieve_hours || 0,
  start_assessment: apiData.ac_start_assessment
    ? new Date(apiData.ac_start_assessment)
    : null,
  end_assessment: apiData.ac_end_assessment
    ? new Date(apiData.ac_end_assessment)
    : null,

  assessment: apiData.assessment
    ? {
        // ✅ เพิ่ม assessment object
        as_id: apiData.assessment.as_id,
        as_name: apiData.assessment.as_name,
        as_type: apiData.assessment.as_type,
        as_description: apiData.assessment.as_description,
        as_create_date: apiData.assessment.as_create_date,
        as_last_update: apiData.assessment.as_last_update,
      }
    : null,
});

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,

  fetchStudentActivities: async (userId: string) => {
    set({ activityLoading: true, activityError: null });

    try {
      const response = await axiosInstance.get(
        `/student/activity/get-student-activities/${userId}`
      );
      console.log("✅ FetchStudentActivity API Response:", response.data);

      const formattedActivities = response.data.map((a: ApiActivity) => ({
        id: a.ac_id,
        name: a.ac_name,
        company_lecturer: a.ac_company_lecturer,
        description: a.ac_description,
        type: a.ac_type,
        room: a.ac_room,
        seat: a.ac_seat,
        food: a.ac_food || [],
        status: a.ac_status,
        location_type: a.ac_location_type,
        start_register: a.ac_start_register,
        end_register: a.ac_end_register,
        create_date: a.ac_create_date,
        last_update: a.ac_last_update,
        registered_count: a.ac_registered_count,
        attended_count: a.ac_attended_count || 0,
        not_attended_count: a.ac_not_attended_count || 0,
        start_time: a.ac_start_time,
        end_time: a.ac_end_time,
        image_url: a.ac_image_url || "",
        state: a.ac_state,
        normal_register: a.ac_normal_register,
        recieve_hours: a.ac_recieve_hours || 0,
        start_assessment: a.ac_start_assessment,
        end_assessment: a.ac_end_assessment,
      }));

      set({ activities: formattedActivities, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching student activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนิสิตได้",
        activityLoading: false,
      });
    }
  },

  enrollActivity: async (userId: string, activityId: number) => {
    try {
      const response = await axiosInstance.post(
        `/student/activity/student-enroll-activity/${userId}`,
        { activityId }
      );

      console.log("✅ ลงทะเบียนสำเร็จ:", response.data);
      toast.success("✅ ลงทะเบียนสำเร็จ!");

      // ✅ โหลดข้อมูลกิจกรรมใหม่หลังจากลงทะเบียน
      get().fetchStudentActivities(userId);
    } catch (error) {
      console.error("❌ ลงทะเบียนล้มเหลว:", error);
      toast.error("❌ ลงทะเบียนไม่สำเร็จ!");
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
    console.log("📡 ค่าที่ส่งไป API:", { ac_name: searchName.trim() || "" });

    try {
      const { data } = await axiosInstance.get(
        `/student/activity/searchActivity`,
        {
          params: { ac_name: searchName.trim() || "" }, // ✅ เปลี่ยนให้ตรงกับ backend
        }
      );
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

  fetchActivity: async (id: number | string): Promise<Activity | null> => {
    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) {
      set({ activityError: "Invalid Activity ID", activityLoading: false });
      return null;
    }

    set({ activityLoading: true, activityError: null });

    try {
      console.log(
        `📡 Fetching activity from API: /activity/get-activity/${numericId}`
      );

      const { data } = await axiosInstance.get<ApiActivity>(
        `/student/activity/get-activity/${numericId}`
      );

      console.log("📡 API Response:", data);

      if (!data || Object.keys(data).length === 0) {
        set({ activityError: "Activity not found", activityLoading: false });
        return null;
      }

      // ✅ ตรวจสอบว่า mapActivityData() คืนค่า `Activity` ที่ถูกต้อง
      const mappedActivity = mapActivityData(data);
      console.log("✅ Mapped Activity:", mappedActivity);

      set({ activity: mappedActivity, activityLoading: false });

      return mappedActivity; // ✅ คืนค่า Activity
    } catch (error: any) {
      console.error("❌ Error fetching activity:", error);

      set({
        activityError:
          error.response?.data?.message || "Error fetching activity",
        activityLoading: false,
      });

      return null;
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
        `/student/activity/get-enrolled/${id}`
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

  createActivity: async (activity: ApiActivity): Promise<void> => {
    set(() => ({ activityLoading: true, activityError: null }));

    try {
      console.log("log in createActivity Store: ", activity);

      await axiosInstance.post("/student/activity/create-activity", activity);
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
