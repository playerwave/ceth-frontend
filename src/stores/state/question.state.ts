import { QuestionVersion } from "../../types/assessment/assessment-versions/question-version.type";

export interface QuestionState {
  questions: QuestionVersion[];
  questionLoading: boolean;
  questionError: string | null;

  fetchQuestionsBySetNumber: (setNumberId: number) => Promise<void>;
  createQuestion: (data: Omit<QuestionVersion, "question_id">) => Promise<QuestionVersion | null>;
  updateQuestion: (data: QuestionVersion) => Promise<QuestionVersion | null>;
  deleteQuestion: (id: number) => Promise<QuestionVersion | null>;
}
