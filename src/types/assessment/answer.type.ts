export interface Answer {
  answer_id: number;
  join_id?: number;
  question_id?: number;
  choice_id?: number | null;
  answer_text?: string | null;
  set_number_id?: number;
  assessment_id?: number;
  assessment_version_id?: number | null;
  set_number_version_id?: number | null;
  question_version_id?: number | null;
  choice_version_id?: number | null;
}
