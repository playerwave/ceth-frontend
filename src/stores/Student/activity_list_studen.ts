// src/stores/activityStore.ts
import { create } from "zustand";
import { ActivityState } from "../../types/Student/activity_list_studen_type";
import * as activityService from "../../service/Studen/activity_list_service";

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
      const activities = await activityService.fetchStudentActivities(userId);
      set({ activities, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching student activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนิสิตได้",
        activityLoading: false,
      });
    }
  },

  searchActivities: async (searchName: string) => {
<<<<<<< HEAD
  const trimmed = searchName.trim();

  if (!trimmed) {
    await get().fetchStudentActivities("1"); // แก้ userId ให้สอดคล้องระบบจริง
    set({ searchResults: null });
    return;
  }

  set({ activityLoading: true, activityError: null });

  try {
    const searchResults = await activityService.searchActivities(trimmed);

    set({
      searchResults,
      activityLoading: false,
    });
  } catch (error) {
    console.error("❌ Error searching activities:", error);

    set({
      searchResults: [], // ✅ แก้ตรงนี้ เพื่อให้ระบบแสดง "ไม่พบกิจกรรม"
      activityError: "ไม่สามารถค้นหากิจกรรมได้",
      activityLoading: false,
    });
  }
};

=======
    if (!searchName.trim()) {
      await get().fetchStudentActivities("1"); // กำหนด userId ให้ถูกต้อง
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
>>>>>>> 2d3a72fd0b30ee0fcde9a173e70a2ab8635a1f34

  fetchActivity: async (id: number | string, userId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await activityService.fetchActivity(id, userId);
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
}));
