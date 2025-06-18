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

  searchActivities?: (searchName: string) => Promise<void>;
  fetchActivity?: (id: number) => Promise<void>;
  fetchEnrolledStudents?: (id: number) => Promise<void>;
  updateActivity?: (activity: Activity) => Promise<void>;
  updateActivityStatus?: (
    id: string,
    status: "Public" | "Private"
  ) => Promise<void>;
  setMockActivities?: (activities: Activity[]) => void;

  activityLoading?: boolean;
  activityError?: string | null;
  activity?: Activity | null;
  searchResults?: Activity[] | null;
  enrolledStudents?: any[];
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  selectedActivity: null,
  loading: false,
  error: null,
  activityLoading: false,
  activityError: null,
  activity: null,
  searchResults: null,
  enrolledStudents: [],

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

  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      await useActivityStore.getState().fetchActivities();
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });
    try {
      const results = await activityService.searchActivities(searchName);
      set({ searchResults: results });
    } catch (error) {
      console.error("❌ Error searching activities:", error);
      set({ activityError: "ไม่สามารถค้นหากิจกรรมได้" });
    } finally {
      set({ activityLoading: false });
    }
  },

  fetchActivity: async (id: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await activityService.getActivityById(id);
      set({ activity });
    } catch (error) {
      console.error("❌ Error fetching activity:", error);
      set({ activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้" });
    } finally {
      set({ activityLoading: false });
    }
  },

  fetchEnrolledStudents: async (id: number) => {
    try {
      const students = await activityService.fetchEnrolledStudents(id);
      set({ enrolledStudents: students });
    } catch (error) {
      console.error("❌ Error fetching enrolled students:", error);
    }
  },

  // updateActivity: async (activity: Activity) => {
  //   try {
  //     await activityService.updateActivity(activity);
  //     await useActivityStore.getState().fetchActivities();
  //   } catch (error) {
  //     console.error("❌ Error updating activity:", error);
  //   }
  // },

  // updateActivityStatus: async (id: string, status: "Public" | "Private") => {
  //   try {
  //     const updated = useActivityStore
  //       .getState()
  //       .mockActivities?.map((a) =>
  //         a.activity_id.toString() === id
  //           ? { ...a, activity_status: status }
  //           : a
  //       );
  //     set({ mockActivities: updated });
  //   } catch (error) {
  //     console.error("❌ Error updating status:", error);
  //   }
  // },
}));
