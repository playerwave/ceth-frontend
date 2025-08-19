// src/stores/activityStore.ts
import { create } from "zustand";
import { ActivityState } from "../state/activity.state";
import * as activityService from "../../service/Student/activity.service.student";

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledActivities: [],
  recommendedIds: [],

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
}));
