import { create } from "zustand";
import { ActivityState } from "../../types/Admin/activity_list_type";

import {
  fetchActivities as fetchActivitiesService,
  fetchActivity as fetchActivityService,
  searchActivities as searchActivitiesService,
} from "../../service/Admin/activity_list_service";

import { mockActivities } from "../mock/mockActivities"; // ✅ แยก mock ออก

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledStudents: [], // ✅ เพิ่มตรงนี้ (ให้ตรงกับ interface)
  enrolledActivities: [],
  mockActivities,

  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });
    try {
      const activities = await fetchActivitiesService();
      set({ activities, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      await get().fetchActivities();
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });
    try {
      const results = await searchActivitiesService(searchName);
      set({ searchResults: results, activityLoading: false });
    } catch (error) {
      console.error("❌ Error searching activities:", error);
      set({
        activityError: "ไม่สามารถค้นหากิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  fetchActivity: async (id: number | string, userId: string): Promise<void> => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await fetchActivityService(id, userId);
      set({ activity, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching activity:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้",
        activityLoading: false,
      });
    }
  },

  // ✅ เพิ่ม placeholder สำหรับฟังก์ชันอื่น ๆ ให้ผ่าน type ไปก่อน
  updateActivityStatus: async () => {
    console.warn("updateActivityStatus: ยังไม่ได้ implement");
  },
  updateActivity: async () => {
    console.warn("updateActivity: ยังไม่ได้ implement");
  },
  fetchEnrolledStudents: async () => {
    console.warn("fetchEnrolledStudents: ยังไม่ได้ implement");
  },
  createActivity: async () => {
    console.warn("createActivity: ยังไม่ได้ implement");
  },}))
