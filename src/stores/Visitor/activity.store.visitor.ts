import { create } from "zustand";
import { Activity } from "../../types/model";
import { activityService } from "../../service/Visitor/activity.service.visitor";

interface ActivityVisitorState {
  activities: Activity[];
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
      const activities = await activityService.fetchPublicActivities();
      set({ activities, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching public activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมสาธารณะได้",
        activityLoading: false,
      });
    }
  },
}));
