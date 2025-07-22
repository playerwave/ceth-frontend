// src/stores/Visitor/activity.store.visitor.ts

import { create } from "zustand";
import { Activity } from "../../types/model"; // ต้องเป็น Activity
import { activityService } from "../../service/Visitor/activity.service.visitor";

interface ActivityVisitorState {
  activities: Activity[]; // ต้องเป็น Activity[]
  activityLoading: boolean;
  activityError: string | null;
  fetchPublicActivities: () => Promise<void>;
}

export const useActivityVisitorStore = create<ActivityVisitorState>((set) => ({
  activities: [],
  activityLoading: false,
  activityError: null,

  fetchPublicActivities: async () => {
    set({ activityLoading: true, activityError: null });
    try {
      const activities = await activityService.fetchPublicActivities(); // activityService ต้องคืนค่าเป็น Activity[]
      set({ activities, activityLoading: false });
    } catch (error: any) {
      console.error("❌ Error fetching public activities:", error);
      set({
        activityError: error.message || "ไม่สามารถโหลดกิจกรรมสาธารณะได้",
        activityLoading: false,
      });
    }
  },
}));
