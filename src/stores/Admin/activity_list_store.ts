import { create } from "zustand";
import { ActivityState } from "../../types/Admin/activity_list_type";
import { Activity } from "../../types/Student/activity_list_studen_type";

// 🔁 import service ที่คุณสร้างไว้
import {
  fetchActivities as fetchActivitiesService,
  fetchActivity as fetchActivityService,
  searchActivities as searchActivitiesService,
} from "../../service/Admin/activity_list_service"; // ✅ << ปรับ path ให้ตรง

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledActivities: [],

  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });
    try {
      const activities = await fetchActivitiesService("yourUserId"); // ✅ ใส่ userId ถ้า service ต้องการ
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

  fetchActivity: async (id: number | string): Promise<Activity | null> => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await fetchActivityService(id, "yourUserId");
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
