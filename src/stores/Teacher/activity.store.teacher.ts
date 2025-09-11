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
  getEnrolledStudentsForActivity: (activityId: number) => Promise<any[]>;
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
  fetchEndedActivities: () => Promise<void>;
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

    set({ loading: true, error: null, activityLoading: true, activityError: null });
    
    let retries = 3;
    while (retries > 0) {
      try {
        const data = await activityService.fetchAllActivities();
        
        // ✅ ตรวจสอบข้อมูลที่ได้
        if (!data || !Array.isArray(data)) {
          console.warn("⚠️ Invalid data received from service:", data);
          if (retries > 1) {
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          set({ activities: [], loading: false, activityLoading: false });
          return;
        }

        set({ activities: data, loading: false, activityLoading: false });
        console.log(`✅ teacher fetchActivities: Retrieved ${data.length} activities`);
        return;
      } catch (err) {
        retries--;
        console.error(`❌ fetchActivities error (retries left: ${retries}):`, err);
        
        if (retries === 0) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch activities";
          set({ 
            error: errorMessage, 
            activityError: errorMessage,
            loading: false, 
            activityLoading: false 
          });
          return;
        }
        
        // ✅ รอสักครู่ก่อนลองใหม่
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
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

      // ✅ อัปเดต state ทันทีเพื่อให้ UI แสดงผลทันที (Optimistic Update)
      set((state) => {
        const updatedActivities = state.activities.map((activity) =>
          activity.activity_id.toString() === id
            ? { ...activity, activity_status: status }
            : activity
        );
        const updatedSearchResults = state.searchResults?.map((activity) =>
          activity.activity_id.toString() === id
            ? { ...activity, activity_status: status }
            : activity
        );
        
        console.log("🔄 Optimistic update applied:", {
          id,
          status,
          activitiesCount: updatedActivities.length,
          searchResultsCount: updatedSearchResults?.length || 0,
          updatedActivity: updatedActivities.find(a => a.activity_id.toString() === id)
        });
        
        return {
          activities: updatedActivities,
          searchResults: updatedSearchResults,
        };
      });

      // ✅ เรียก service ที่อัปเดตสถานะใน backend
      await activityService.updateActivityStatus(id, status);
      console.log("✅ Backend update successful");

      // ✅ โหลดรายการกิจกรรมใหม่จาก backend เพื่อให้ข้อมูลตรงกัน (ไม่ใช้ setTimeout)
      try {
        const updatedList = await activityService.fetchAllActivities();
        if (updatedList && Array.isArray(updatedList)) {
          set({ activities: updatedList });
          console.log("✅ Activities refreshed from backend");
        }
      } catch (refreshError) {
        console.error("❌ Error refreshing activities:", refreshError);
        // ✅ ไม่ throw error เพราะ optimistic update สำเร็จแล้ว
      }
    } catch (error) {
      console.error("❌ Error updating activity status:", error);
      
      // ✅ Revert optimistic update ถ้า backend update ล้มเหลว
      try {
        const currentList = await activityService.fetchAllActivities();
        if (currentList && Array.isArray(currentList)) {
          set({ activities: currentList });
          console.log("🔄 Reverted to backend state after error");
        }
      } catch (revertError) {
        console.error("❌ Error reverting state:", revertError);
      }
      
      set({ error: "ไม่สามารถอัปเดตสถานะกิจกรรมได้" });
      throw error; // ✅ re-throw เพื่อให้ component รู้ว่าเกิด error
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

  //--------------------- Fetch Ended Activities -------------------------
  // // ดึงเฉพาะกิจกรรมที่สิ้นสุดแล้ว โดยมีเงื่อนไขขึ้นกับ event_format
  // fetchEndedActivities: async () => {
  //   console.log("📥 Fetching ended activities for teacher...");

  //   set({ loading: true, error: null });
  //   try {
  //     const data = await activityService.fetchAllActivities();

  //     // เงื่อนไขตาม event_format
  //     const ended = data.filter((a: any) => {
  //       if (a.event_format === "Course") {
  //         return a.activity_state === "End Activity";
  //       } else {
  //         return a.activity_state === "End Assessment";
  //       }
  //     });

  //     set({ activities: ended });
  //     console.log("teacher fetchEndedActivities: ", ended);
  //   } catch (err) {
  //     set({ error: "Failed to fetch ended activities" });
  //   } finally {
  //     set({ loading: false });
  //   }
  // },
  // //----------------------------------------------------------------

  // ดึงเฉพาะกิจกรรมที่สิ้นสุดแล้ว โดยมีเงื่อนไขขึ้นกับ event_format
  fetchEndedActivities: async () => {
    console.log("📥 Fetching all activities for teacher...");

    set({ loading: true, error: null });
    try {
      const data = await activityService.fetchEndActivities();
      set({ activities: data });
      console.log("teacher fetchActivities: ", data);
    } catch (err) {
      set({ error: "Failed to fetch activities" });
    } finally {
      set({ loading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Get Enrolled Students for Activity -------------------------
  getEnrolledStudentsForActivity: async (activityId: number) => {
    console.log("📥 Store: Getting enrolled students for activity:", activityId);
    try {
      const students = await activityService.getEnrolledStudentsForActivity(activityId);
      console.log("✅ Store: Enrolled students loaded:", students);
      return students;
    } catch (error) {
      console.error("❌ Store: Error getting enrolled students:", error);
      throw error;
    }
  },
  //----------------------------------------------------------------
}));
