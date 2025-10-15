import { create } from "zustand";
import activityReportService, { 
  EnrollmentByDepartmentResponse, 
  ParticipationStatusResponse,
  AssessmentTopic,
  SatisfactionSurveyResponse,
  StudentAssessmentStatusResponse
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

  // Assessment Data
  assessmentData: AssessmentTopic[] | null;
  assessmentLoading: boolean;
  assessmentError: string | null;

  // Satisfaction Survey Data
  satisfactionSurveyData: SatisfactionSurveyResponse | null;
  satisfactionSurveyLoading: boolean;
  satisfactionSurveyError: string | null;

  // Student Assessment Status Data
  studentAssessmentStatusData: StudentAssessmentStatusResponse | null;
  studentAssessmentStatusLoading: boolean;
  studentAssessmentStatusError: string | null;

  // Actions
  fetchEnrollmentByDepartment: (activityId: string | number) => Promise<void>;
  fetchParticipationStatus: (activityId: string | number) => Promise<void>;
  fetchAssessmentData: (activityId: string | number) => Promise<void>;
  fetchSatisfactionSurvey: (activityId: string | number) => Promise<void>;
  fetchStudentAssessmentStatus: (activityId: string | number) => Promise<void>;
  clearEnrollmentError: () => void;
  clearParticipationError: () => void;
  clearAssessmentError: () => void;
  clearSatisfactionSurveyError: () => void;
  clearStudentAssessmentStatusError: () => void;
  debugAnswers: (activityId: string | number) => Promise<any>;
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
  assessmentData: null,
  assessmentLoading: false,
  assessmentError: null,
  satisfactionSurveyData: null,
  satisfactionSurveyLoading: false,
  satisfactionSurveyError: null,
  studentAssessmentStatusData: null,
  studentAssessmentStatusLoading: false,
  studentAssessmentStatusError: null,

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

  fetchAssessmentData: async (activityId) => {
    set({ assessmentLoading: true, assessmentError: null });
    try {
      console.log("🔄 [ActivityReportStore] Fetching assessment data for activity:", activityId);
      const data = await activityReportService.getAssessmentData(activityId);
      set({ assessmentData: data, assessmentLoading: false });
      console.log("✅ [ActivityReportStore] Assessment data loaded:", data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch assessment data";
      set({ assessmentError: errorMessage, assessmentLoading: false });
      console.error("❌ [ActivityReportStore] Error fetching assessment data:", error);
    }
  },

  fetchSatisfactionSurvey: async (activityId) => {
    set({ satisfactionSurveyLoading: true, satisfactionSurveyError: null });
    try {
      console.log("🔄 [ActivityReportStore] Fetching satisfaction survey for activity:", activityId);
      const data = await activityReportService.getSatisfactionSurvey(activityId);
      set({ satisfactionSurveyData: data, satisfactionSurveyLoading: false });
      console.log("✅ [ActivityReportStore] Satisfaction survey loaded:", data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch satisfaction survey";
      set({ satisfactionSurveyError: errorMessage, satisfactionSurveyLoading: false });
      console.error("❌ [ActivityReportStore] Error fetching satisfaction survey:", error);
    }
  },

  fetchStudentAssessmentStatus: async (activityId) => {
    set({ studentAssessmentStatusLoading: true, studentAssessmentStatusError: null });
    try {
      console.log("🔄 [ActivityReportStore] Fetching student assessment status for activity:", activityId);
      const data = await activityReportService.getStudentAssessmentStatus(activityId);
      set({ studentAssessmentStatusData: data, studentAssessmentStatusLoading: false });
      console.log("✅ [ActivityReportStore] Student assessment status loaded:", data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch student assessment status";
      set({ studentAssessmentStatusError: errorMessage, studentAssessmentStatusLoading: false });
      console.error("❌ [ActivityReportStore] Error fetching student assessment status:", error);
    }
  },

  clearEnrollmentError: () => set({ enrollmentError: null }),
  clearParticipationError: () => set({ participationError: null }),
  clearAssessmentError: () => set({ assessmentError: null }),
  clearSatisfactionSurveyError: () => set({ satisfactionSurveyError: null }),
  clearStudentAssessmentStatusError: () => set({ studentAssessmentStatusError: null }),
  
  // Debug method
  debugAnswers: async (activityId: string | number) => {
    try {
      console.log("🔍 [ActivityReportStore] Debugging answers for activity:", activityId);
      const result = await activityReportService.debugAnswers(activityId);
      console.log("✅ [ActivityReportStore] Debug answers result:", result);
      
      // แสดงข้อมูลแบบเต็ม
      if (result.fixSingleAnswers) {
        console.log("🔍 [ActivityReportStore] Fix Single Answers Details:", JSON.stringify(result.fixSingleAnswers, null, 2));
      }
      if (result.fixSingleQuestions) {
        console.log("🔍 [ActivityReportStore] Fix Single Questions Details:", JSON.stringify(result.fixSingleQuestions, null, 2));
      }
      
      return result;
    } catch (error) {
      console.error("❌ [ActivityReportStore] Debug answers error:", error);
      throw error;
    }
  },
  
  reset: () => set({
    enrollmentData: null,
    enrollmentLoading: false,
    enrollmentError: null,
    participationData: null,
    participationLoading: false,
    participationError: null,
    assessmentData: null,
    assessmentLoading: false,
    assessmentError: null,
    satisfactionSurveyData: null,
    satisfactionSurveyLoading: false,
    satisfactionSurveyError: null,
    studentAssessmentStatusData: null,
    studentAssessmentStatusLoading: false,
    studentAssessmentStatusError: null,
  }),
}));
