import { Question } from "../../types/model";

export interface QuestionState {
  questions: Question[];
  questionLoading: boolean;
  questionError: string | null;

  fetchQuestionsBySetNumber: (setNumberId: number) => Promise<void>;
  createQuestion: (data: Omit<Question, "question_id">) => Promise<Question | null>;
  updateQuestion: (data: Question) => Promise<Question | null>;
  deleteQuestion: (id: number) => Promise<Question | null>;
}
