import { create } from "zustand";
import { toast } from "sonner";
import {
  ApiActivity,
  CreateActivityStoreState,
} from "../../types/Admin/type_create_activity_admin";
import { createActivityService } from "../../services/admin/service_create_activity"; // ✅ นำเข้า service ที่แยกไว้

export const useActivityStore = create<CreateActivityStoreState>((set) => ({
  activityLoading: false,
  activityError: null,

  createActivity: async (activity: ApiActivity): Promise<void> => {
    set(() => ({ activityLoading: true, activityError: null }));

    try {
      await createActivityService(activity); // ✅ เรียกผ่าน service ที่แยกไว้

      toast.success(
        activity.ac_status === "Public"
          ? "สร้างกิจกรรมสำเร็จ !"
          : "ร่างกิจกรรมสำเร็จ !",
        { duration: 3000 }
      );

      set(() => ({
        activityLoading: false,
        activityError: null,
      }));
    } catch (error: any) {
      console.error("❌ Unknown error:", error);
      set(() => ({
        activityError:
          error?.response?.data?.message || "An unknown error occurred",
        activityLoading: false,
      }));
    }
  },
}));
