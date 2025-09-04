import axios from "axios";
import { SetNumber } from "../type/assessment.type";

const API_URL = "http://localhost:5090/api/teacher/setNumber";

export const getSetNumbers = async (): Promise<SetNumber[]> => {
  const res = await axios.get(`${API_URL}/get-set-numbers`);
  return res.data.data; // ✅ คืนเฉพาะ array
};

export const createSetNumber = async (data: Partial<SetNumber>) => {
  const res = await axios.post(`${API_URL}/create-set-number`, data);
  return res.data; // server อาจส่ง { message, data } กลับมา
};

export const updateSetNumber = async (id: number, data: Partial<SetNumber>) => {
  const res = await axios.put(`${API_URL}/update-set-number/${id}`, data);
  return res.data;
};

export const deleteSetNumber = async (id: number) => {
  const res = await axios.delete(`${API_URL}/delete-set-number/${id}`);
  return res.data;
};
