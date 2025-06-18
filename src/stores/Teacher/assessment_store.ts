import { create } from "zustand";
import axios from "../../libs/axios";

interface Assessment {
  as_id: number;
  q_id: number;
  as_name: string;
  as_type: string;
  as_description: string;
  as_create_date: string;
  as_last_update?: string;
}

interface AssessmentStore {
  assessments: Assessment[];
  fetchAssessments: () => Promise<void>;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  assessments: [],

  fetchAssessments: async () => {
    try {
      console.log("Calling API to fetch assessments...");
      const response = await axios.get("/admin/assessment/get-assessments");

      // ✅ แก้ให้เซ็ต `assessments.assessments` แทนที่จะเป็น `assessments`
      set({ assessments: response.data.assessments });

      console.log("Fetched assessments:", response.data.assessments); // ✅ Debugging
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
    }
  },
}));
