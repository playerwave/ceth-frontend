import { create } from "zustand";
import { Activity } from "../../types/model";
import activityService from "../../service/Teacher/activity.service.teacher";

interface ActivityStore {
  activities: Activity[];
  selectedActivity: Activity | null;
  loading: boolean;
  error: string | null;
  fetchActivities: () => Promise<void>;
  selectActivity: (id: number) => Promise<void>;
  clearSelectedActivity: () => void;
  createActivity: (activity: Partial<Activity>) => Promise<void>;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  selectedActivity: null,
  loading: false,
  error: null,

  //------------------------------------------- Role: Teacher --------------------------------------------------

  //--------------------- Create Activity -------------------------
  //สร้างกิจกรรมใหม่
  createActivity: async (activityData) => {
    set({ loading: true, error: null });
    try {
      await activityService.createActivity(activityData);
      const updatedList = await activityService.fetchAllActivities(); // อัปเดตรายการ
      set({ activities: updatedList });
    } catch (err) {
      set({ error: "Failed to create activity" });
    } finally {
      set({ loading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Fetch Activities -------------------------
  //ดึงรายการกิจกรรมทั้งหมดของสำหรับอาจารย์
  fetchActivities: async () => {
    set({ loading: true, error: null });
    try {
      const data = await activityService.fetchAllActivities();
      set({ activities: data });
    } catch (err) {
      set({ error: "Failed to fetch activities" });
    } finally {
      set({ loading: false });
    }
  },
  //----------------------------------------------------------------

  selectActivity: async (id: number) => {
    set({ loading: true });
    try {
      const activity = await activityService.getActivityById(id);
      set({ selectedActivity: activity });
    } catch (err) {
      set({ error: "Failed to fetch activity details" });
    } finally {
      set({ loading: false });
    }
  },

  clearSelectedActivity: () => set({ selectedActivity: null }),
}));
