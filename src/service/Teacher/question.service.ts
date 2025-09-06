import axiosInstance from "../../libs/axios";
import { ApiQuestion } from "../../stores/api/question.api";

// ✅ ดึงคำถามทั้งหมด
export const getAllQuestions = async (): Promise<ApiQuestion[]> => {
  const response = await axiosInstance.get<{ data: ApiQuestion[] }>(
    "/teacher/question/get-questions"
  );
  return response.data.data;
};

// ✅ ดึงคำถามตาม SetNumber
export const getQuestionsBySetNumber = async (
  setNumberId: number
): Promise<ApiQuestion[]> => {
  const response = await axiosInstance.get<{ data: ApiQuestion[] }>(
    `/teacher/question/get-questions-by-setNumber/${setNumberId}`
  );
  return response.data.data;
};

// ✅ ดึงคำถามตาม id
export const getQuestionById = async (id: number): Promise<ApiQuestion> => {
  const response = await axiosInstance.get<{ data: ApiQuestion }>(
    `/teacher/question/get-question/${id}`
  );
  return response.data.data;
};

// ✅ สร้างคำถามใหม่
export const createQuestion = async (payload: {
  question_text: string;
  question_number: number;
  set_number_id: number;
  question_type: string; // "Fix Single answer" | "Single answer" | "Multiple answer" | "Text answer"
}): Promise<ApiQuestion> => {
  const response = await axiosInstance.post<{ data: ApiQuestion }>(
    "/teacher/question/create-question",
    payload
  );
  return response.data.data;
};

// ✅ อัปเดตคำถาม
export const updateQuestion = async (payload: {
  question_id: number;
  question_text: string;
  question_number: number;
  set_number_id: number;
  question_type: string;
}): Promise<void> => {
  await axiosInstance.put(
    `/teacher/question/update-question/${payload.question_id}`,
    payload
  );
};

// ✅ ลบคำถาม
export const deleteQuestion = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/teacher/question/delete-question/${id}`);
};

const questionService = {
  getAllQuestions,
  getQuestionsBySetNumber,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

export default questionService;
