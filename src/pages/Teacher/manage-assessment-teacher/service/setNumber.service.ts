import axios from "axios";

const API_URL = "http://localhost:5090/api/teacher/setNumber";

// ✅ helper สำหรับแนบ token
const getAuthHeader = () => {
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ ดึงทั้งหมด
export const getSetNumbers = async () => {
  const res = await axios.get(`${API_URL}/get-set-numbers`, {
    headers: getAuthHeader(),
  });
  return res.data?.data ?? [];
};

// ✅ ดึงเฉพาะตัวเดียว
export const getSetNumberById = async (id: number) => {
  const res = await axios.get(`${API_URL}/get-set-number/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data?.data;
};

export const createSetNumber = async (data: { name: string; status: string }) => {
  const res = await axios.post(`${API_URL}/create-set-number`, data, {
    headers: getAuthHeader(),
  });
  return res.data?.setNumber ?? res.data;
};

export const updateSetNumber = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/update-set-number/${id}`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const deleteSetNumber = async (id: number) => {
  const res = await axios.delete(`${API_URL}/delete-set-number/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
