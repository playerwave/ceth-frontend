import { create } from "zustand";
import axiosInstance from "../libs/axios";

interface Activity {
  ac_id: number;
  ac_name: string;
  ac_description: string;
  ac_start_time: string;
  ac_end_time: string;
  ac_room: string;
  ac_food: string[];
  ac_registerant_count: number;
  ac_seat: number;
  ac_state: string;
  ac_type: string;
  ac_company_lecturer: string;
}

interface ActivityState {
  activity: Activity | null;
  isLoading: boolean;
  error: string | null;
  fetchActivity: (id: number) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activity: null,
  isLoading: false,
  error: null,

  fetchActivity: async (id) => {
    if (!id || isNaN(id)) {
      console.error("❌ Invalid Activity ID:", id);
      set({ error: "Invalid Activity ID", isLoading: false, activity: null });
      return;
    }

    set({ isLoading: true, error: null, activity: null });

    try {
      console.log(`📡 Calling API: /activity/get-activity/${id}`);
      const { data } = await axiosInstance.get<{ activity: Activity }>(
        `/activity/get-activity/${id}`
      );
      console.log("📌 API Response Data:", data);
      set({ activity: data.activity, isLoading: false });
    } catch (error: any) {
      console.error("❌ API Error:", error);
      set({
        error: error.response?.data?.message || "Error fetching activity",
        isLoading: false,
        activity: null,
      });
    }
  },
}));