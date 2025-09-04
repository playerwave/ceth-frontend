// src/services/choice.api.ts
import axios from "axios";
import { Choice }from "../type/assessment.type";


const API_URL = "http://localhost:5090/api/teacher/choice";

// ✅ ดึง choices ทั้งหมด
export const getChoices = async (): Promise<Choice[]> => {
  const res = await axios.get(`${API_URL}/get-choices`);
  return res.data;
};

// ✅ ดึง choice ตาม id
export const getChoiceById = async (id: number): Promise<Choice> => {
  const res = await axios.get(`${API_URL}/get-choice/${id}`);
  return res.data;
};

// ✅ สร้าง choice ใหม่
export const createChoice = async (data: Partial<Choice>) => {
  const res = await axios.post(`${API_URL}/create-choice`, data);
  return res.data;
};

// ✅ อัปเดต choice
export const updateChoice = async (id: number, data: Partial<Choice>) => {
  const res = await axios.put(`${API_URL}/update-choice/${id}`, data);
  return res.data;
};

// ✅ ลบ choice
export const deleteChoice = async (id: number) => {
  const res = await axios.delete(`${API_URL}/delete-choice/${id}`);
  return res.data;
};
