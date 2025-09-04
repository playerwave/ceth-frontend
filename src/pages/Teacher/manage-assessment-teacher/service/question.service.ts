import axios from "axios";

const API_URL = "http://localhost:5090/api/teacher/question";

const getAuthHeader = () => {
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getQuestions = async () => {
  const res = await axios.get(`${API_URL}/get-questions`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// ✅ แก้ให้ตรงกับ backend route
export const createQuestion = async (data: any) => {
  const res = await axios.post(`${API_URL}/add`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const updateQuestion = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/edit/${id}`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const deleteQuestion = async (id: number) => {
  const res = await axios.delete(`${API_URL}/delete/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
