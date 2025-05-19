import { create } from "zustand";
import { toast } from "sonner";
import type { ActivityState, ApiActivity, Activity } from "../../types/Student/type_activity_info_admin";
import {
  fetchStudentActivities,
  fetchActivity,
  fetchEnrolledStudents,
  fetchEnrolledActivities,
  enrollActivity,
  unenrollActivity,
} from "../../services/Student/service_activity_info_admin";

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
  start_register: apiData.ac_start_register ? new Date(apiData.ac_start_register) : null,
  end_register: apiData.ac_end_register ? new Date(apiData.ac_end_register) : null,
  create_date: apiData.ac_create_date ? new Date(apiData.ac_create_date) : null,
  last_update: apiData.ac_last_update ? new Date(apiData.ac_last_update) : null,
  start_time: apiData.ac_start_time ? new Date(apiData.ac_start_time) : null,
  end_time: apiData.ac_end_time ? new Date(apiData.ac_end_time) : null,
  registered_count: apiData.ac_registered_count ?? 0,
  attended_count: apiData.ac_attended_count ?? 0,
  not_attended_count: apiData.ac_not_attended_count ?? 0,
  image_url: apiData.ac_image_url || "/img/default.png",
  state: apiData.ac_state || "ไม่ระบุ",
  normal_register: apiData.ac_normal_register ? new Date(apiData.ac_normal_register) : null,
  recieve_hours: apiData.ac_recieve_hours || 0,
  start_assessment: apiData.ac_start_assessment ? new Date(apiData.ac_start_assessment) : null,
  end_assessment: apiData.ac_end_assessment ? new Date(apiData.ac_end_assessment) : null,
  assessment_id: apiData.assessment?.as_id ?? null,
  selected_food: apiData.uac_selected_food,
});

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  enrolledActivities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledStudents: [],

  // เพิ่มฟังก์ชันนี้ไว้ด้วยเลย
  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });
    try {
      // เรียก API แบบ fetchStudentActivities("") เพื่อโหลดกิจกรรมทั้งหมด (หรือเปลี่ยนเป็น API ที่เหมาะสม)
      const raw = await fetchStudentActivities("");
      const formatted = raw.map(mapActivityData);
      set({ activities: formatted, activityLoading: false });
    } catch (error) {
      set({ activityError: "ไม่สามารถโหลดกิจกรรมได้", activityLoading: false });
    }
  },

  fetchStudentActivities: async (userId: string) => {
    set({ activityLoading: true, activityError: null });
    try {
      const raw = await fetchStudentActivities(userId);
      const formatted = raw.map(mapActivityData);
      set({ activities: formatted, activityLoading: false });
    } catch (error) {
      set({ activityError: "ไม่สามารถโหลดกิจกรรมนิสิตได้", activityLoading: false });
    }
  },

  enrollActivity: async (userId: string, activityId: number, food?: string) => {
    set({ activityLoading: true, activityError: null });
    try {
      await enrollActivity(userId, activityId, food);
      get().fetchStudentActivities(userId);
      set({ activityLoading: false });
      toast.success("ลงทะเบียนสำเร็จ!", { duration: 3000 });
    } catch (error) {
      set({ activityLoading: false });
      toast.error("❌ ลงทะเบียนไม่สำเร็จ!");
    }
  },

  fetchActivity: async (id: number | string, userId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      const raw = await fetchActivity(id, userId);
      const mapped = mapActivityData(raw);
      set({ activity: mapped, activityLoading: false });
      return mapped;
    } catch (error) {
      set({ activityError: "Error fetching activity", activityLoading: false });
      return null;
    }
  },

  fetchEnrolledStudents: async (activityId: number | string) => {
    set({ activityLoading: true, activityError: null });
    try {
      const students = await fetchEnrolledStudents(activityId);
      set({ enrolledStudents: students, activityLoading: false });
    } catch (error) {
      set({ activityError: "ไม่สามารถโหลดข้อมูลนิสิตได้", activityLoading: false });
    }
  },

  fetchEnrolledActivities: async (studentId: string) => {
    set({ activityLoading: true, activityError: null });
    try {
      const enrolledActs = await fetchEnrolledActivities(studentId);
      set({ enrolledActivities: enrolledActs, activityLoading: false });
    } catch (error) {
      set({ activityError: "Error fetching enrolled activities", activityLoading: false });
    }
  },

  unenrollActivity: async (userId: number, activityId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      await unenrollActivity(userId, activityId);
      set({ activityLoading: false });
      toast.success("ยกเลิกการลงทะเบียนเรียบร้อย", { duration: 3000 });
    } catch (error) {
      set({ activityLoading: false });
      toast.error("❌ ยกเลิกการลงทะเบียนไม่สำเร็จ!");
    }
  },
}));
