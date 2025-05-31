// stores/Student/Main/main_activity_student.store.ts

import { create } from "zustand";
import { MainActivityState } from "../../types/Student/type_main_activity_student";
import { fetchEnrolledActivitiesAPI } from "../../services/Student/service_main_activity_student";

export const useMainActivityStore = create<MainActivityState>((set) => ({
    enrolledActivities: [],
    activityLoading: false,
    activityError: null,

    fetchEnrolledActivities: async (userId: string) => {
        set({ activityLoading: true, activityError: null });
        try {
            const activities = await fetchEnrolledActivitiesAPI(userId);
            set({ enrolledActivities: activities });
        } catch (error: any) {
            set({ activityError: error.message || "เกิดข้อผิดพลาด", enrolledActivities: [] });
        } finally {
            set({ activityLoading: false });
        }
    }
    ,




}));
