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
  uac_selected_food: string | null;
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
  selected_food: string | null;
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
  enrolledActivities: Activity[];
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
  uac_selected_food: apiData.uac_selected_food,
});

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledActivities: [],

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

  enrollActivity: async (userId: string, activityId: number, food?: string) => {
    try {
      set({ activityLoading: true, activityError: null });
      const response = await axiosInstance.post(
        `/student/activity/student-enroll-activity/${userId}`,
        { activityId, food }
      );

      console.log("✅ ลงทะเบียนสำเร็จ:", response.data);

      // ✅ โหลดข้อมูลกิจกรรมใหม่หลังจากลงทะเบียน
      get().fetchStudentActivities(userId);
      set({ activityLoading: false });
      toast.success("ลงทะเบียนสำเร็จ!", { duration: 3000 });
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

  fetchActivity: async (
    id: number | string,
    userId: number
  ): Promise<Activity | null> => {
    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) {
      set({ activityError: "Invalid Activity ID", activityLoading: false });
      return null;
    }

    set({ activityLoading: true, activityError: null });

    try {
      console.log("userId in fetchActivity(store): ", userId);
      console.log(
        `📡 Fetching activity from API: /activity/get-activity/${numericId}?userId=${userId}`
      );

      const { data } = await axiosInstance.get<ApiActivity>(
        `/student/activity/get-activity/${numericId}?userId=${userId}`
      );

      console.log("📡 API Response:", data);

      if (!data || Object.keys(data).length === 0) {
        set({ activityError: "Activity not found", activityLoading: false });
        return null;
      }

      // data.ac_food = forceToArray(data.ac_food || []);

      // ✅ ตรวจสอบว่า mapActivityData() คืนค่า `Activity` ที่ถูกต้อง
      const mappedActivity = mapActivityData(data);
      console.log("✅ Mapped Activity:", mappedActivity);

      const enrolledActivities = get().enrolledActivities; // ✅ ดึงค่าจาก store
      console.log("📌 Enrolled Activities (All):", enrolledActivities);

      // ✅ ตรวจสอบว่ามีอย่างน้อย 2 ตัวหรือไม่ก่อน log
      if (enrolledActivities.length > 1) {
        console.log("📌 Enrolled Activity [1]:", enrolledActivities[1]);
      } else {
        console.log("⚠ ไม่มีข้อมูลกิจกรรมตัวที่ 2 ใน enrolledActivities");
      }

      // ✅ ตรวจสอบค่าที่ใช้เปรียบเทียบ
      console.log("📌 Checking Activity ID:", id);

      // ✅ ค้นหากิจกรรมใน `enrolledActivities`
      const is_enrolled = enrolledActivities.find((act) => act.id === id);

      console.log("✅ Final is_enrolled:", is_enrolled);

      // ✅ ตั้งค่า activity ใน store
      set((state) => ({
        activity: {
          ...data,
          is_enrolled: is_enrolled, // 🟢 ใช้ตัวแปรที่กำหนดไว้
        },
      }));

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

  fetchEnrolledActivities: async (studentId: string) => {
    set({ activityLoading: true, activityError: null });

    try {
      console.log(
        `🚀 Fetching enrolled activities for student ID: ${studentId}`
      );
      const { data } = await axiosInstance.get<Activity[]>(
        `/student/activity/get-enrolled-activities/${studentId}`
      );

      console.log("✅ Enrolled Activities API Response:", data);

      set({
        enrolledActivities: data, // ✅ เก็บกิจกรรมที่นิสิตลงทะเบียนไว้
        activityLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      set({
        activityError: err.response?.data?.error ?? "Error fetching activities",
        activityLoading: false,
      });

      console.error("❌ Error fetching enrolled activities:", err);
    }
  },

  async unenrollActivity(userId: number, activityId: number) {
    try {
      set({ activityLoading: true, activityError: null });
      console.log(
        `🛑 Unenrolling: studentId=${userId}, activityId=${activityId}`
      );

      const response = await axiosInstance.delete(
        `/student/activity/unenroll-activity/${userId}`,
        {
          data: { activityId },
        }
      );

      set({ activityLoading: false });
      toast.success("ยกเลิกการลงทะเบียนเรียบร้อย", { duration: 3000 });
    } catch (error: any) {
      console.error("❌ Error in unenrollActivity:", error);

      if (error.response) {
        toast.error(
          `❌ ล้มเหลว: ${error.response.data.message || "เกิดข้อผิดพลาด"}`
        );
      } else {
        toast.error("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
      }
    }
  },
}));

function forceToArray(input: unknown): string[] {
  if (typeof input !== "string") return [];

  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    const cleaned = input.replace(/[{}"]/g, "").trim();
    if (cleaned) return [cleaned];
  }

  return [];
}
