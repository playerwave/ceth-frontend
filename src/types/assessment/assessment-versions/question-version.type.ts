export interface QuestionVersion {
  question_version_id: number;
  set_number_version_id: number;
  order_index: number;
  question_text: string;
  question_type: "single_choice" | "multi_choice" | "text" | "rating";
}
