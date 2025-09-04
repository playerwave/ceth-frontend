// src/services/question.api.ts
import axios from "axios";
import { Question } from "../type/assessment.type";

const API_URL = "http://localhost:5090/api/teacher/question";

// ✅ ดึงคำถามทั้งหมด
export const getQuestions = async (): Promise<Question[]> => {
  const res = await axios.get(`${API_URL}/get-questions`);
  return res.data;
};

// ✅ ดึงคำถามตาม id
export const getQuestionById = async (id: number): Promise<Question> => {
  const res = await axios.get(`${API_URL}/get-question/${id}`);
  return res.data;
};

// ✅ สร้างคำถามใหม่
export const createQuestion = async (data: Partial<Question>) => {
  const res = await axios.post(`${API_URL}/create-question`, data);
  return res.data;
};

// ✅ อัปเดตคำถาม
export const updateQuestion = async (id: number, data: Partial<Question>) => {
  const res = await axios.put(`${API_URL}/update-question/${id}`, data);
  return res.data;
};

// ✅ ลบคำถาม
export const deleteQuestion = async (id: number) => {
  const res = await axios.delete(`${API_URL}/delete-question/${id}`);
  return res.data;
};
