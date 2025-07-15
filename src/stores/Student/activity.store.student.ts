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

  fetchStudentActivities: async (userId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      const activities = await activityService.fetchActivities(userId);
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
    if (!searchName.trim()) {
      await get().fetchStudentActivities(1); // กำหนด userId ให้ถูกต้อง
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

  fetchRecommended: async (userId: number) => {
    const ids = await activityService.fetchRecommendedIds(userId);
    set({ recommendedIds: ids });
  },

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
