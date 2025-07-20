import { Assessment } from "../../types/model";

export interface AssessmentState {
  assessments: Assessment[];
  selectedAssessment: Assessment | null;
  assessmentLoading: boolean;
  assessmentError: string | null;
  searchResults: Assessment[] | null;

  fetchAssessments: () => Promise<void>;
  fetchAssessmentById: (id: number) => Promise<Assessment | null>;
  createAssessment?: (data: Partial<Assessment>) => Promise<void>;
  updateAssessment?: (data: Assessment) => Promise<void>;
  deleteAssessment?: (id: number) => Promise<void>;
  clearSelectedAssessment?: () => void;
  searchAssessments?: (name: string) => Promise<void>;
}
