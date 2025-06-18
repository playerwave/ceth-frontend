// stores/Admin/store_update_activity.ts
import { create } from "zustand";
import { toast } from "sonner";
import { UpdateActivityStoreState } from "../../types/Admin/type_update_activity_admin";
import {
  updateActivityService,
  fetchActivityByIdService,
  deleteActivityService,
} from "../../services/admin/service_update_activity";

export const useActivityStore = create<UpdateActivityStoreState>(
  (set) => ({
    activity: null,
    activityError: null,
    activityLoading: false,

    fetchActivity: async (id) => {
      set({ activityLoading: true, activityError: null });
      try {
        const result = await fetchActivityByIdService(id);
        set({ activity: result, activityLoading: false });
        return result;
      } catch (error: any) {
        console.error("❌ fetchActivity error:", error);
        set({
          activityError:
            error?.response?.data?.message || "Error fetching activity",
          activityLoading: false,
        });
        return null;
      }
    },

    updateActivity: async (activity) => {
      set({ activityLoading: true, activityError: null });
      try {
        await updateActivityService(activity);
        toast.success("อัปเดตกิจกรรมสำเร็จ!");
        set({ activityLoading: false });
      } catch (error: any) {
        console.error("❌ updateActivity error:", error);
        set({
          activityError:
            error?.response?.data?.message || "Error updating activity",
          activityLoading: false,
        });
      }
    },

    deleteActivity: async (id) => {
      set({ activityLoading: true });
      try {
        await deleteActivityService(id);
        toast.success("ลบกิจกรรมสำเร็จ!");
        set({ activityLoading: false });
      } catch (error: any) {
        console.error("❌ deleteActivity error:", error);
        set({ activityLoading: false });
        toast.error("ลบกิจกรรมไม่สำเร็จ");
      }
    },
  })
);
