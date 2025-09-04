import axios from "axios";

const API_URL = "http://localhost:5090/api/teacher/setNumber";

// ✅ helper สำหรับแนบ token
const getAuthHeader = () => {
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getSetNumbers = async () => {
  const res = await axios.get(`${API_URL}/get-set-numbers`, {
    headers: getAuthHeader(),
  });

  console.log("📥 Response getSetNumbers:", res.data);

  // ✅ backend ส่ง { message, data: [...] }
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (res.data?.data) {
    return res.data.data;   // ดึง array ออกมา
  }
  return [];
};


export const createSetNumber = async (data: { name: string; status: string }) => {
  const res = await axios.post(`${API_URL}/create-set-number`, data, {
    headers: getAuthHeader(),
  });

  console.log("📥 Response จาก backend (create-set-number):", res.data);

  // ถ้า backend ส่ง { message, setNumber: {...} }
  if (res.data?.setNumber) {
    return res.data.setNumber;
  }

  return res.data;
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
