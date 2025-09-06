import axiosInstance from "../../libs/axios";
import { ApiSetNumber } from "../../stores/api/setNumber.api";

// ✅ ดึง SetNumber ทั้งหมด
export const getAllSetNumbers = async (): Promise<ApiSetNumber[]> => {
  const response = await axiosInstance.get<{ data: ApiSetNumber[] }>(
    "/teacher/setNumber/get-set-numbers"
  );
  return response.data.data;
};

// ✅ ดึง SetNumber ตาม Assessment
export const getSetNumbersByAssessment = async (assessmentId: number): Promise<ApiSetNumber[]> => {
  const response = await axiosInstance.get<{ data: ApiSetNumber[] }>(
    `/teacher/setNumber/get-set-numbers-by-assessment/${assessmentId}`
  );
  return response.data.data;
};

// ✅ ดึง SetNumber ตาม ID
export const getSetNumberById = async (id: number): Promise<ApiSetNumber> => {
  const response = await axiosInstance.get<{ data: ApiSetNumber }>(
    `/teacher/setNumber/get-set-number/${id}`
  );
  return response.data.data;
};

export const createSetNumber = async (payload: {
  name: string;
  status: "Active" | "Inactive";
  assessment_id: number;
}): Promise<void> => {
  await axiosInstance.post("/teacher/setNumber/create-set-number", payload);
};

export const updateSetNumber = async (payload: {
  set_number_id: number;
  name: string;
  status: "Active" | "Inactive";
  assessment_id: number; // ✅ ต้องเพิ่ม
}): Promise<void> => {
  await axiosInstance.put(
    `/teacher/setNumber/update-set-number/${payload.set_number_id}`,
    payload
  );
};

export const deleteSetNumber = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/teacher/setNumber/delete-set-number/${id}`);
};

const setNumberService = {
  getAllSetNumbers,
  getSetNumbersByAssessment,
  getSetNumberById,
  createSetNumber,
  updateSetNumber,
  deleteSetNumber,
};

export default setNumberService;
