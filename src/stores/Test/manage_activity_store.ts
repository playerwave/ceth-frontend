import { create } from "zustand";
import axiosInstance from "../../libs/axios";

interface Activity {
  ac_id: number;
  ac_name: string;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_room_floor: string;
  ac_room: string; // เลขห้อง
  ac_status: string[];
  ac_seat: number;
  ac_food: Record<string, string>;
  ac_start_time: string;
  ac_end_time: string;
  ac_evaluation: string; // เพิ่มแบบประเมิน
  ac_create_date: string;
  ac_end_enrolled_date: string;
  ac_registrant_count: number;
  ac_state: string; // คืออะไร?
  activity_image_url: string;
}

interface ActivityState {
  activity: Activity | null;
  activities: Activity[];
  error: string | null;
  isLoading: boolean;
  message: string | null;
  fetchActivities: () => Promise<Activity[]>;
  fetchActivity: (id: number) => Promise<Activity | null>;
  createActivity: (activity: Activity) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<void>;
  
}

export const useActivityStore = create<ActivityState>((set) => ({
  activity: null,
  activities: [],
  error: null,
  isLoading: false,
  message: null,

  fetchActivities: async () => {
    set(() => ({ isLoading: true, error: null }));

    try {
      const { data } = await axiosInstance.get<Activity[]>("/activity/list");
      console.log("Activities fetched:", data);

      set(() => ({ activities: data, isLoading: false }));
      return data;
    } catch (error: any) {
      set(() => ({
        error: error.response?.data?.message || "Error fetching Activities",
        isLoading: false,
      }));
      console.error("Error fetching activities:", error);
      return [];
    }
  },

  fetchActivity: async (id) => {
    set(() => ({ isLoading: true, error: null }));

    try {
      const { data } = await axiosInstance.get<Activity>(`/activity/${id}`);
      console.log("Activity fetched:", data);

      set(() => ({ activity: data, isLoading: false }));
      return data;
    } catch (error: any) {
      set(() => ({
        error: error.response?.data?.message || "Error fetching Activity",
        isLoading: false,
      }));
      console.error("Error fetching activity:", error);
      return null;
    }
  },

  createActivity: async (activity) => {
    set(() => ({ isLoading: true, error: null }));

    try {
      await axiosInstance.post("/activity/create", activity);
      set((state) => ({
        activities: [...state.activities, activity],
        isLoading: false,
        message: "Activity created successfully!",
      }));
    } catch (error: any) {
      set(() => ({
        error: error.response?.data?.message || "Error creating Activity",
        isLoading: false,
      }));
      console.error("Error creating activity:", error);
    }
  },

  updateActivity: async (activity) => {
    set(() => ({ isLoading: true, error: null }));

    try {
      await axiosInstance.put(`/activity/update/${activity.ac_id}`, activity);
      set((state) => ({
        activities: state.activities.map((a) => (a.ac_id === activity.ac_id ? activity : a)),
        activity,
        isLoading: false,
        message: "Activity updated successfully!",
      }));
    } catch (error: any) {
      set(() => ({
        error: error.response?.data?.message || "Error updating Activity",
        isLoading: false,
      }));
      console.error("Error updating activity:", error);
    }
  }

  
}));
