// // src/stores/activityStore.ts
// import { create } from "zustand";
// import { ActivityState } from "../state/activity.state";
// import * as activityService from "../../service/Student/activity.service.student";

// export const useActivityStore = create<ActivityState>((set, get) => ({
//   activities: [],
//   searchResults: null,
//   activityError: null,
//   activityLoading: false,
//   activity: null,
//   enrolledActivities: [],
//   recommendedIds: [],

//   fetchStudentActivities: async (userId: number) => {
//     set({ activityLoading: true, activityError: null });
//     try {
//       const activities = await activityService.fetchActivities(userId);
//       set({ activities, activityLoading: false });
//     } catch (error) {
//       console.error("❌ Error fetching student activities:", error);
//       set({
//         activityError: "ไม่สามารถโหลดกิจกรรมนิสิตได้",
//         activityLoading: false,
//       });
//     }
//   },

//   searchActivities: async (searchName: string) => {
//     if (!searchName.trim()) {
//       await get().fetchStudentActivities(1); // กำหนด userId ให้ถูกต้อง
//       set({ searchResults: null });
//       return;
//     }

//     set({ activityLoading: true, activityError: null });
//     try {
//       const searchResults = await activityService.searchActivities(searchName);
//       set({ searchResults, activityLoading: false });
//     } catch (error) {
//       console.error("❌ Error searching activities:", error);
//       set({
//         activityError: "ไม่สามารถค้นหากิจกรรมได้",
//         activityLoading: false,
//       });
//     }
//   },

//   fetchRecommended: async (userId: number) => {
//     const ids = await activityService.fetchRecommendedIds(userId);
//     set({ recommendedIds: ids });
//   },

//   fetchActivity: async (id: number | string ) => {
//     set({ activityLoading: true, activityError: null });
//     try {
//       const activity = await activityService.fetchActivity(id);
//       set({ activity, activityLoading: false });
//       return activity;
//     } catch (error) {
//       console.error("❌ Error fetching activity:", error);
//       set({
//         activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้",
//         activityLoading: false,
//       });
//       return null;
//     }
//   },
// }));

// src/stores/activityStore.ts
import { create } from "zustand";
import { ActivityState } from "../state/activity.state";
import * as activityService from "../../service/Student/activity.service.student";

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledActivities: [],
  recommendedIds: [],

  // โหลดกิจกรรมทั้งหมดของนิสิต
  fetchStudentActivities: async (userId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      const activities = await activityService.fetchActivities(userId);
      set({ activities, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching student activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนิสิตได้",
        activityLoading: false,
      });
    }
  },

  // ค้นหากิจกรรม
  searchActivities: async (searchName: string, userId: number) => {
    if (!searchName.trim()) {
      await get().fetchStudentActivities(userId);
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });
    try {
      const searchResults = await activityService.searchActivities(searchName);
      set({ searchResults, activityLoading: false });
    } catch (error) {
      console.error("❌ Error searching activities:", error);
      set({
        activityError: "ไม่สามารถค้นหากิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  // โหลดกิจกรรมแนะนำ
  fetchRecommended: async (userId: number) => {
    try {
      const ids = await activityService.fetchRecommendedIds(userId);
      set({ recommendedIds: ids });
    } catch (error) {
      console.error("❌ Error fetching recommended IDs:", error);
      set({ activityError: "ไม่สามารถโหลดกิจกรรมแนะนำได้" });
    }
  },

  // โหลดกิจกรรมเดี่ยว
  fetchActivity: async (id: number | string) => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await activityService.fetchActivity(id);
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

//   fetchActivity: async (id: number | string, userId: number | string) => {
//   set({ activityLoading: true, activityError: null });
//   try {
//     const activity = await activityService.fetchActivity(id, userId);
//     set({ activity, activityLoading: false });
//     return activity;
//   } catch (error) {
//     console.error("❌ Error fetching activity:", error);
//     set({
//       activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้",
//       activityLoading: false,
//     });
//     return null;
//   }
// },

// fetchActivity: async (id: number | string, userId: number) => {
//   set({ activityLoading: true, activityError: null });
//   try {
//     const activity = await activityService.fetchActivity(id, userId);
//     set({ activity, activityLoading: false });
//     return activity;
//   } catch (error) {
//     console.error("❌ Error fetching activity:", error);
//     set({
//       activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้",
//       activityLoading: false,
//     });
//     return null;
//   }
// },

  // ลงทะเบียนกิจกรรม
  enrollActivity: async (userId: number, activityId: number, food?: string[]) => {
  set({ activityLoading: true, activityError: null });
  try {
    await activityService.enrollActivity(userId, activityId, food); // ✅ ส่งตรง
    await get().fetchEnrolledActivities(userId);
    set({ activityLoading: false });
  } catch (error) {
    console.error("❌ Error enrolling activity:", error);
    set({
      activityError: "ไม่สามารถลงทะเบียนกิจกรรมได้",
      activityLoading: false,
    });
  }
},


  // ยกเลิกกิจกรรม
  unEnrollActivity: async (userId: number, activityId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      await activityService.unEnrollActivity(userId, activityId);
      await get().fetchEnrolledActivities(userId);
      set({ activityLoading: false });
    } catch (error) {
      console.error("❌ Error unenrolling activity:", error);
      set({
        activityError: "ไม่สามารถยกเลิกกิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  // โหลดกิจกรรมที่นิสิตลงทะเบียนแล้ว
  fetchEnrolledActivities: async (userId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      const enrolledActivities = await activityService.fetchEnrolledActivities(userId);
      set({ enrolledActivities, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching enrolled activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมที่ลงทะเบียนได้",
        activityLoading: false,
      });
    }
  },
}));
