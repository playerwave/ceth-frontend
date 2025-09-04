import axios from "axios";

const API_URL = "http://localhost:5090/api/teacher/choice";

const getAuthHeader = () => {
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getChoices = async () => {
  const res = await axios.get(`${API_URL}/get-choices`, {
    headers: getAuthHeader(),
  });
  return res.data?.data ?? [];
};

export const getChoicesByQuestion = async (questionId: number) => {
  const res = await axios.get(`${API_URL}/get-choices-by-question/${questionId}`, {
    headers: getAuthHeader(),
  });
  return res.data?.data ?? [];
};

export const createChoice = async (data: any) => {
  const res = await axios.post(`${API_URL}/add`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const updateChoice = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/edit/${id}`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const deleteChoice = async (id: number) => {
  const res = await axios.delete(`${API_URL}/delete/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
