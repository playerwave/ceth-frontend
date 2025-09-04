// Assessment.ts
export interface Assessment {
  assessment_id: number;
  assessment_name: string;
  create_date: string;   // ใช้ string เพราะ backend ส่ง Date ออกมาเป็น ISO string
  last_update: string;
}

// Question.ts
export type QuestionType =
  | "Fix Single answer"
  | "Single answer"
  | "Multiple answer"
  | "Text answer";

export interface Question {
  question_id: number;
  question_text: string;
  question_number: number;
  set_number_id: number;
  question_type: QuestionType;
}

// Choice.ts
export interface Choice {
  choice_id: number;
  choice_text: string;
  choice_number: number;
  question_id: number;
}

// SetNumber.ts
export interface SetNumber {
  set_number_id: number;   // primary key
  name: string;            // required
  status: string;          // required
}


// Answer.ts
export interface Answer {
  answer_id: number;
  answer_text: string;
  question_id: number;
}
