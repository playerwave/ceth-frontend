// src/stores/activityStore.ts
import { create } from "zustand";
import { ActivityState } from "../state/activity.state";
import activityService from "../../service/Student/activity.service.student";

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledActivities: [],
  recommendedIds: [],
  endedActivities: [],
  


  // โหลดกิจกรรมทั้งหมดของนิสิต
  fetchStudentActivities: async (studentId: number) => {
    console.log("🔄 [STORE] fetchStudentActivities called with studentId:", studentId);
    
    // ตรวจสอบว่ากำลังโหลดอยู่หรือไม่ เพื่อป้องกันการเรียกซ้ำ
    const currentState = get();
    if (currentState.activityLoading) {
      console.log("⚠️ [STORE] Already loading, skipping duplicate call");
      return;
    }
    
    set({ activityLoading: true, activityError: null });
    try {
      const activities = await activityService.fetchActivities(studentId);
      console.log("✅ [STORE] Activities received:", activities);
      
      // ตรวจสอบว่า activities ไม่เป็น null หรือ undefined
      if (activities && Array.isArray(activities)) {
        set({ activities, activityLoading: false });
        console.log("✅ [STORE] Activities set successfully, count:", activities.length);
      } else {
        console.warn("⚠️ [STORE] Invalid activities data received:", activities);
        set({ activities: [], activityLoading: false });
      }
    } catch (error) {
      console.error("❌ Error fetching student activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนิสิตได้",
        activityLoading: false,
      });
    }
  },

  // ค้นหากิจกรรม
  searchActivities: async (searchName: string, studentId: number) => {
    if (!searchName.trim()) {
      await get().fetchStudentActivities(studentId);
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });
    try {
      const searchResults = await activityService.searchActivities(searchName);
      set({ searchResults, activityLoading: false });
    } catch (error) {
      console.error("❌ Error searching activities:", error);
      set({
        activityError: "ไม่สามารถค้นหากิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  // โหลดกิจกรรมแนะนำ
  fetchRecommended: async (studentId: number) => {
    try {
      const ids = await activityService.fetchRecommendedIds(studentId);
      set({ recommendedIds: ids });
    } catch (error) {
      console.error("❌ Error fetching recommended IDs:", error);
      set({ activityError: "ไม่สามารถโหลดกิจกรรมแนะนำได้" });
    }
  },

  // โหลดกิจกรรมเดี่ยว
  fetchActivity: async (id: number | string) => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await activityService.fetchActivity(id);
      set({ activity, activityLoading: false });
      return activity;
    } catch (error) {
      console.error("❌ Error fetching activity:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้",
        activityLoading: false,
      });
      return null;
    }
  },
  fetchEnrolledActivities: async (studentId: number) => {
    console.log("🔄 [STORE] fetchEnrolledActivities called with studentId:", studentId);
    set({ activityLoading: true, activityError: null });
    try {
      const activities = await activityService.fetchEnrolledActivities(studentId);
      console.log("✅ [STORE] Enrolled activities received:", activities);
      
      // ตรวจสอบว่า activities เป็น array ที่ถูกต้อง
      if (activities && Array.isArray(activities)) {
        set({ enrolledActivities: activities, activityLoading: false });
        console.log("✅ [STORE] Enrolled activities set successfully, count:", activities.length);
      } else {
        console.warn("⚠️ [STORE] Invalid enrolled activities data:", activities);
        set({ enrolledActivities: [], activityLoading: false });
      }
    } catch (error) {
      console.error("❌ [STORE] Error in fetchEnrolledActivities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมที่ลงทะเบียนได้",
        activityLoading: false,
      });
    }
  },

  enrollActivity: async (
    studentId: number,
    activityId: number,
    food?: string[]
  ) => {
    set({ activityLoading: true, activityError: null });
    try {
      console.log("in store");

      console.log("studentId: ", studentId);
      console.log("activityId: ", activityId);
      console.log("food: ", food);

      await activityService.enrollActivity(studentId, activityId, food);
      set({ activityLoading: false });
      // อาจจะ fetchEnrolledActivities(studentId) ซ้ำเพื่อ refresh
    } catch (error) {
      set({
        activityError: "ไม่สามารถสมัครกิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  unenrollActivity: async (studentId: number, activityId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      await activityService.unEnrollActivity(studentId, activityId);
      set({ activityLoading: false });
      // อาจจะ fetchEnrolledActivities(studentId) ซ้ำเพื่อ refresh
    } catch (error) {
      set({
        activityError: "ไม่สามารถยกเลิกกิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  // ✅ เมธอดใหม่: โหลดกิจกรรมที่สิ้นสุด และบังคับตั้ง activity_state ตาม event_format
  fetchEndedActivities: async (studentId: number) => {
  const { activityLoading } = get();
  if (activityLoading) return;

  set({ activityLoading: true, activityError: null });
  try {
    const raw = await activityService.fetchActivities(studentId);
    const ended = Array.isArray(raw)
      ? raw.map((a: any) => ({
          ...a,
          activity_state: a?.event_format === "Course" ? "End Activity" : "End Assessment",
        }))
      : [];
    set({ endedActivities: ended, activityLoading: false });
  } catch (e: any) {
    set({
      activityError: e?.response?.data?.message || e?.message || "ไม่สามารถโหลดกิจกรรมที่สิ้นสุดได้",
      activityLoading: false,
    });
  }
},

searchEndActivities: async (searchName: string, studentId: number) => {
  const q = searchName.trim().toLowerCase();

  // ถ้าคำค้นว่าง → กลับไปใช้ endedActivities
  if (!q) {
    // โหลดให้ชัวร์ (เผื่อยังไม่ได้โหลด)
    if (!get().endedActivities || get().endedActivities.length === 0) {
      await get().fetchEndedActivities(studentId);
    }
    set({ searchResults: null }); // ให้ตาราง fallback เป็น endedActivities
    return;
  }

  // ✅ กรองจาก endedActivities ที่มีอยู่
  const ended = (get().endedActivities ?? []) as any[];
  const searchResults = ended.filter((row) => {
    const text = [
      row.presenter_company_name,
      row.activity_name,
      row.company_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(q);
  });

  set({ searchResults }); // ถ้าอยาก fallback เมื่อไม่เจอ → set({ searchResults: null })
},

  
}));
