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
  createActivity: (activity: Partial<Activity>) => Promise<number | undefined>;

  searchActivities?: (searchName: string) => Promise<void>;
  fetchActivity: (id: number) => Promise<Activity | null>;
  fetchEnrolledStudents?: (id: number) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<number | undefined>;
  updateActivityStatus: (
    id: string,
    status: "Public" | "Private"
  ) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>; // ✅ เพิ่มฟังก์ชันลบกิจกรรม
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
    console.log("📤 createActivity payload:", activityData);
    set({ loading: true, error: null });
    try {
      const result = await activityService.createActivity(activityData);
      const updatedList = await activityService.fetchAllActivities(); // อัปเดตรายการ
      set({ activities: updatedList });
      return result; // ✅ ส่งคืน activity_id
    } catch (err) {
      set({ error: "Failed to create activity" });
      throw err; // ✅ re-throw error
    } finally {
      set({ loading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Fetch Activities -------------------------
  //ดึงรายการกิจกรรมทั้งหมดของสำหรับอาจารย์
  fetchActivities: async () => {
    console.log("📥 Fetching all activities for teacher...");

    set({ loading: true, error: null });
    try {
      const data = await activityService.fetchAllActivities();
      set({ activities: data });
      console.log("teacher fetchActivities: ", data);
    } catch (err) {
      set({ error: "Failed to fetch activities" });
    } finally {
      set({ loading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Select Activity -------------------------
  selectActivity: async (id: number) => {
    console.log("📥 Selecting activity with ID:", id);
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
  //----------------------------------------------------------------

  clearSelectedActivity: () => set({ selectedActivity: null }),
  //----------------------------------------------------------------

  //--------------------- Search Activities -------------------------
  searchActivities: async (searchName: string) => {
    console.log("🔍 Searching activities with name:", searchName);
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
  //----------------------------------------------------------------

  //--------------------- Fetch Activity ---------------------------
  fetchActivity: async (id: number) => {
    console.log("📥 Fetching activity with ID:", id);

    set({ activityLoading: true, activityError: null });
    try {
      const activity = await activityService.getActivityById(id);
      set({ activity });
      return activity; // ✅ ส่งคืนข้อมูล activity
    } catch (error) {
      console.error("❌ Error fetching activity:", error);
      set({ activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้" });
      return null;
    } finally {
      set({ activityLoading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Fetch ErolledStudent ---------------------
  fetchEnrolledStudents: async (id: number) => {
    console.log("📥 Fetching enrolled students for activity ID:", id);

    try {
      const students = await activityService.fetchEnrolledStudents(id);
      set({ enrolledStudents: students });
    } catch (error) {
      console.error("❌ Error fetching enrolled students:", error);
    }
  },
  //----------------------------------------------------------------

  //--------------------- updateActivity ---------------------------
  updateActivity: async (activity: Activity) => {
    try {
      const result = await activityService.updateActivity(activity);
      await useActivityStore.getState().fetchActivities();
      return result; // ✅ ส่งคืน activity_id
    } catch (error) {
      console.error("❌ Error updating activity:", error);
      throw error; // ✅ re-throw error
    }
  },
  //----------------------------------------------------------------

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

  //--------------------- updateActivityStatus -----------------------
  updateActivityStatus: async (id: string, status: "Public" | "Private") => {
    try {
      console.log("🔄 Updating activity status:", { id, status });

      // เรียก service ที่อัปเดตสถานะใน backend
      await activityService.updateActivityStatus(id, status);

      // โหลดรายการกิจกรรมใหม่
      const updatedList = await activityService.fetchAllActivities();
      set({ activities: updatedList });
    } catch (error) {
      console.error("❌ Error updating activity status:", error);
      set({ error: "ไม่สามารถอัปเดตสถานะกิจกรรมได้" });
    }
  },
  //----------------------------------------------------------------

  //--------------------- addFoodToActivity -----------------------
  addFoodToActivity: async (activity_id: number, food_id: number) => {
    console.log("🔄 Store: Adding food to activity:", { activity_id, food_id });
    try {
      await activityService.addFoodToActivity(activity_id, food_id);
      console.log(
        "✅ Store: Food added successfully, refreshing activity data"
      );
      await useActivityStore.getState().fetchActivity(activity_id);
    } catch (error) {
      console.error("❌ Store: Error adding food to activity:", error);
      throw error;
    }
    //----------------------------------------------------------------
  },

  //--------------------- addFoodToActivity -----------------------
  removeFoodFromActivity: async (
    activity_food_id: number,
    activity_id: number
  ) => {
    console.log("🔄 Store: Removing food from activity:", {
      activity_food_id,
      activity_id,
    });
    try {
      await activityService.removeFoodFromActivity(activity_food_id);
      console.log(
        "✅ Store: Food removed successfully, refreshing activity data"
      );
      await useActivityStore.getState().fetchActivity(activity_id);
    } catch (error) {
      console.error("❌ Store: Error removing food from activity:", error);
      throw error;
    }
  },
  //----------------------------------------------------------------

  //--------------------- deleteActivity -----------------------
  deleteActivity: async (id: number) => {
    console.log("🗑️ Store: Deleting activity with ID:", id);
    try {
      await activityService.deleteActivity(id);
      console.log("✅ Store: Activity deleted successfully");
      // โหลดรายการกิจกรรมใหม่หลังจากลบ
      await useActivityStore.getState().fetchActivities();
    } catch (error) {
      console.error("❌ Store: Error deleting activity:", error);
      throw error;
    }
  },
  //----------------------------------------------------------------
}));
