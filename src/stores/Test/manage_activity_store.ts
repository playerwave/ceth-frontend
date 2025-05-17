import { create } from "zustand";
import axiosInstance from "../../libs/axios";
import axios from "axios"; // ✅ นำเข้า axios เพื่อตรวจสอบ Error
export interface Activity {
  ac_id: number;
  ac_name: string;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_room_floor: string;
  ac_room: string;
  ac_status: string[];
  ac_seat: number;
  ac_food: Record<string, string>;
  ac_start_time: string;
  ac_end_time: string;
  ac_evaluation: string;
  ac_create_date: string;
  ac_end_enrolled_date: string;
  ac_start_register: string;
  ac_end_register: string; 
  ac_registrant_count: number;
  ac_state: string;
  ac_image_url: string;
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
    } catch (error: unknown) { // ✅ เปลี่ยนเป็น `unknown`
      if (axios.isAxiosError(error)) { // ✅ เช็คว่าเป็น Axios Error หรือไม่
        set(() => ({ 
          error: error.response?.data?.message || "Error fetching Activities", 
          isLoading: false 
        }));
      } else {
        set(() => ({ error: "An unknown error occurred", isLoading: false }));
      }
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set(() => ({ 
          error: error.response?.data?.message || "Error fetching Activity", 
          isLoading: false 
        }));
      } else {
        set(() => ({ error: "An unknown error occurred", isLoading: false }));
      }
      console.error("Error fetching activity:", error);
      return null;
    }
  },

  createActivity: async (activity) => {
    set(() => ({ isLoading: true, error: null }));

    try {
      await axiosInstance.post("/api/activity/create-activity", activity);


      set((state) => ({
        activities: [...state.activities, activity],
        isLoading: false,
        message: "Activity created successfully!",
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error creating activity:", error.response?.data); // ✅ เพิ่มบรรทัดนี้
        set(() => ({
          error: error.response?.data?.message || "Error creating Activity",
          isLoading: false,
        }));
      } else {
        console.error("❌ Unknown error:", error);
        set(() => ({ error: "An unknown error occurred", isLoading: false }));
      }
    }
    
  },

 
}));

