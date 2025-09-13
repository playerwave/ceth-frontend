import { create } from "zustand";
import activityReportService, { 
  EnrollmentByDepartmentResponse, 
  ParticipationStatusResponse 
} from "../../service/Teacher/activity-report.service";

interface ActivityReportState {
  // Enrollment by Department Data
  enrollmentData: EnrollmentByDepartmentResponse | null;
  enrollmentLoading: boolean;
  enrollmentError: string | null;

  // Participation Status Data
  participationData: ParticipationStatusResponse | null;
  participationLoading: boolean;
  participationError: string | null;

  // Actions
  fetchEnrollmentByDepartment: (activityId: string | number) => Promise<void>;
  fetchParticipationStatus: (activityId: string | number) => Promise<void>;
  clearEnrollmentError: () => void;
  clearParticipationError: () => void;
  reset: () => void;
}

export const useActivityReportStore = create<ActivityReportState>((set) => ({
  // Initial State
  enrollmentData: null,
  enrollmentLoading: false,
  enrollmentError: null,
  participationData: null,
  participationLoading: false,
  participationError: null,

  // Actions
  fetchEnrollmentByDepartment: async (activityId) => {
    set({ enrollmentLoading: true, enrollmentError: null });
    try {
      console.log("🔄 [ActivityReportStore] Fetching enrollment by department for activity:", activityId);
      const data = await activityReportService.getEnrollmentByDepartment(activityId);
      set({ enrollmentData: data, enrollmentLoading: false });
      console.log("✅ [ActivityReportStore] Enrollment data loaded:", data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch enrollment data";
      set({ enrollmentError: errorMessage, enrollmentLoading: false });
      console.error("❌ [ActivityReportStore] Error fetching enrollment data:", error);
    }
  },

  fetchParticipationStatus: async (activityId) => {
    set({ participationLoading: true, participationError: null });
    try {
      console.log("🔄 [ActivityReportStore] Fetching participation status for activity:", activityId);
      const data = await activityReportService.getParticipationStatus(activityId);
      set({ participationData: data, participationLoading: false });
      console.log("✅ [ActivityReportStore] Participation data loaded:", data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch participation data";
      set({ participationError: errorMessage, participationLoading: false });
      console.error("❌ [ActivityReportStore] Error fetching participation data:", error);
    }
  },

  clearEnrollmentError: () => set({ enrollmentError: null }),
  clearParticipationError: () => set({ participationError: null }),
  
  reset: () => set({
    enrollmentData: null,
    enrollmentLoading: false,
    enrollmentError: null,
    participationData: null,
    participationLoading: false,
    participationError: null,
  }),
}));
