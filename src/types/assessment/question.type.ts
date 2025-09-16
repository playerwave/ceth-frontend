export interface Question {
  question_id: number;
  question_text: string;
  question_number?: number;
  set_number_id?: number;
  question_type?: 
    | "Fix Single answer"
    | "Single answer"
    | "Multiple answer"
    | "Text answer";
}
