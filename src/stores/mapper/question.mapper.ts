import { ApiQuestion } from "../api/question.api";
import { Question } from "@/types/assessment/question.type";

// ฟังก์ชันแมปคำถาม 1 ข้อ - เพิ่มการตรวจสอบ
export const mapApiToQuestion = (
  api: ApiQuestion,
  setNumberId: number
): any => {
  // ✅ ตรวจสอบข้อมูลก่อน mapping
  if (!api) {
    throw new Error("API data is undefined");
  }
  
  if (!api.question_id) {
    console.error("❌ Missing question_id in API response:", api);
    throw new Error("Missing question_id in API response");
  }

  return {
    question_id: api.question_id,
    question_text: api.question_text || "",
    question_number: api.question_number || 1,
    set_number_id: setNumberId,
    question_type: api.question_type,
  };
};

// ฟังก์ชันแมปคำถามหลายข้อ
export const mapApiToQuestions = (
  apis: ApiQuestion[],
  setNumberId: number
): Question[] => {
  if (!Array.isArray(apis)) {
    console.error("❌ API data is not an array:", apis);
    return [];
  }
  
  return apis
    .filter(q => q && q.question_id) // ✅ กรองเฉพาะที่มี question_id
    .map((q) => mapApiToQuestion(q, setNumberId));
};