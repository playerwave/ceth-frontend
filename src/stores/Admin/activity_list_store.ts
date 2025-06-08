import { create } from "zustand";
import { ActivityState } from "../../types/Admin/activity_list_type";
import { Activity } from "../../types/Student/activity_list_studen_type";

// 🔁 import service ที่คุณสร้างไว้
import {
  fetchActivities as fetchActivitiesService,
  fetchActivity as fetchActivityService,
  searchActivities as searchActivitiesService,
} from "../../service/Admin/activity_list_service"; // ✅ << ปรับ path ให้ตรง

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledActivities: [],

  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });
    try {
      const activities = await fetchActivitiesService("yourUserId"); // ✅ ใส่ userId ถ้า service ต้องการ
      set({ activities, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      await get().fetchActivities();
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });
    try {
      const results = await searchActivitiesService(searchName);
      set({ searchResults: results, activityLoading: false });
    } catch (error) {
      console.error("❌ Error searching activities:", error);
      set({
        activityError: "ไม่สามารถค้นหากิจกรรมได้",
        activityLoading: false,
      });
    }
  },

<<<<<<< HEAD
  mockActivities: [
    // <-- ประกาศเป็น property ธรรมดา (array)
    {
      id: 1,
      name: "กิจกรรมที่ 111111111111111111111111111111111111111111111111111111111111111111111111111",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-06-01T12:00:00"),
      type: "Hard Skill",
    },
    {
      id: 2,
      name: "กิจกรรมที่ 2",
      end_time: null,
      end_assessment: new Date("2025-04-01T12:00:00"),
      status: "Public",
      type: "Soft Skill",
    },
    {
      id: 3,
      name: "กิจกรรมที่ 3",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-07-01T12:00:00"),
      status: "Public",
    },
    {
      id: 4,
      name: "กิจกรรมที่ 4",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-07-01T12:00:00"),
      status: "Public",
    },
    {
      id: 5,
      name: "กิจกรรมที่ 5",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
      type: "Hard Skill",
      location_type: "Course",
    },
    {
      id: 6,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
      location_type: "Online",
    },
    {
      id: 7,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
      location_type: "Onsite",
    },
    {
      id: 8,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 9,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 10,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 11,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 12,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 13,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 14,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 15,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 16,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 17,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 18,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 19,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 20,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 21,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
    {
      id: 22,
      company_lecturer:
        "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      name: "กิจกรรมที่ 6",
      end_time: new Date("2025-05-20T12:00:00"),
      end_assessment: new Date("2025-08-01T12:00:00"),
      status: "Public",
    },
  ],

=======
>>>>>>> 479485fc736f097c34d732b1d3337cc61cb44b04
  fetchActivity: async (id: number | string): Promise<Activity | null> => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await fetchActivityService(id, "yourUserId");
      set({ activity, activityLoading: false });
      return activity;
    } catch (error) {
      console.error("❌ Error fetching activity:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้",
        activityLoading: false,
      });
      return null;
    }
  },
}));
