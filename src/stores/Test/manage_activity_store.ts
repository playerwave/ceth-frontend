import { create } from "zustand";

interface Activity {
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
  ac_registrant_count: number;
  ac_state: string;
  activity_image_url: string;
}

interface ActivityState {
  activity: Activity | null;
  createActivity: (activity: Activity) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activity: null,

  createActivity: async (activity) => {
    console.log("📤 Data Sent to Backend (Mock API):", activity);

    // ✅ Mock การหน่วงเวลา (Simulating API Request Delay)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ✅ จำลองการอัปเดต Zustand state
    set(() => ({ activity }));
    console.log("✅ Activity saved in Zustand Store:", activity);
  },
}));
