export interface AssessmentQuestion {
  question_id: number;
  question_text: string;
  question_type: "satisfaction" | "multiple_choice" | "single_choice" | "open_ended";
  options?: string[];
  required: boolean;
  section_id?: number;
  section_name?: string;
  question_number?: number;
}

export interface AssessmentSection {
  section_id: number;
  section_name: string;
  section_order: number;
  questions: AssessmentQuestion[];
}

export interface Assessment {
  assessment_id: number;
  assessment_name: string;
  assessment_description?: string;
  questions: AssessmentQuestion[];
  sections?: AssessmentSection[];
}

export interface AssessmentResponse {
  assessment_id: number;
  answers: {
    satisfaction: { [questionId: number]: string };
    multiple_choice: { [questionId: number]: string[] };
    single_choice: { [questionId: number]: string };
    open_ended: { [questionId: number]: string };
  };
}