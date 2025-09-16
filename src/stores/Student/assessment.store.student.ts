import { create } from "zustand";
import { Assessment } from "../../types/assessment/assessment.type";
import assessmentService from "../../service/Student/assessment.service.student";

interface AssessmentState {
  assessment: Assessment | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitError: string | null;
  
  // Actions
  fetchAssessmentByActivityId: (activityId: string | number) => Promise<void>;
  submitAssessment: (assessmentResponse: {
    assessment_id: number;
    answers: {
      satisfaction: { [questionId: number]: string };
      multiple_choice: { [questionId: number]: string[] };
      single_choice: { [questionId: number]: string };
      open_ended: { [questionId: number]: string };
    };
  }) => Promise<void>;
  clearError: () => void;
  clearSubmitError: () => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  assessment: null,
  loading: false,
  error: null,
  submitting: false,
  submitError: null,

  fetchAssessmentByActivityId: async (activityId: string | number) => {
    set({ loading: true, error: null });
    
    try {
      console.log("🔄 [AssessmentStore] Fetching assessment for activity:", activityId);
      
      const assessment = await assessmentService.getAssessmentByActivityId(activityId);
      
      set({ 
        assessment, 
        loading: false,
        error: null 
      });
      
      console.log("✅ [AssessmentStore] Assessment loaded successfully:", assessment);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch assessment";
      console.error("❌ [AssessmentStore] Error fetching assessment:", error);
      
      set({ 
        error: errorMessage, 
        loading: false 
      });
    }
  },

  submitAssessment: async (assessmentResponse) => {
    set({ submitting: true, submitError: null });
    
    try {
      console.log("🔄 [AssessmentStore] Submitting assessment:", assessmentResponse);
      
      const result = await assessmentService.submitAssessment(assessmentResponse);
      
      set({ 
        submitting: false,
        submitError: null 
      });
      
      console.log("✅ [AssessmentStore] Assessment submitted successfully:", result);
      
      // Return result for component to handle success
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit assessment";
      console.error("❌ [AssessmentStore] Error submitting assessment:", error);
      
      set({ 
        submitError: errorMessage, 
        submitting: false 
      });
      
      throw error; // Re-throw for component to handle
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearSubmitError: () => {
    set({ submitError: null });
  },

  reset: () => {
    set({
      assessment: null,
      loading: false,
      error: null,
      submitting: false,
      submitError: null,
    });
  },
}));
