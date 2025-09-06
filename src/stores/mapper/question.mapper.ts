import { ApiQuestion } from "../api/question.api";
import { Question } from "../../types/model";

// ฟังก์ชันแมปคำถาม 1 ข้อ
export const mapApiToQuestion = (
  api: ApiQuestion,
  setNumberId: number
): Question => ({
  question_id: api.question_id,
  question_text: api.question_text,
  question_number: api.question_number,
  set_number_id: setNumberId, // ✅ ใส่ค่า set_number_id จากข้างนอก
  question_type: api.question_type as Question["question_type"],
});

// ฟังก์ชันแมปคำถามหลายข้อ
export const mapApiToQuestions = (
  apis: ApiQuestion[],
  setNumberId: number
): Question[] => apis.map((q) => mapApiToQuestion(q, setNumberId));
