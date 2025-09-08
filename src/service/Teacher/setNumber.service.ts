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
export const getSetNumbersByAssessment = async (
  assessmentId: number
): Promise<ApiSetNumber[]> => {
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

// ✅ สร้าง Section (return object ที่สร้างมาใหม่)
export const createSetNumber = async (payload: {
  name: string;
  status: "Active" | "Inactive";
  assessment_id: number;
}): Promise<ApiSetNumber> => {
  const response = await axiosInstance.post<{ data: ApiSetNumber }>(
    "/teacher/setNumber/create-set-number",
    payload
  );
  return response.data.data;
};

// ✅ อัปเดต Section (return object ที่แก้ไขแล้ว)
export const updateSetNumber = async (payload: {
  set_number_id: number;
  name: string;
  status: "Active" | "Inactive";
  assessment_id: number;
}): Promise<ApiSetNumber> => {
  const response = await axiosInstance.put<{ data: ApiSetNumber }>(
    `/teacher/setNumber/update-set-number/${payload.set_number_id}`,
    payload
  );
  return response.data.data;
};

// ✅ ลบ Section (return object ที่ถูกลบ)
export const deleteSetNumber = async (id: number): Promise<ApiSetNumber> => {
  const response = await axiosInstance.delete<{ data: ApiSetNumber }>(
    `/teacher/setNumber/delete-set-number/${id}`
  );
  return response.data.data;
};


export const duplicateSetNumber = async (
  id: number
): Promise<ApiSetNumber> => {
  const response = await axiosInstance.post<{ data: ApiSetNumber }>(
    `/teacher/setNumber/duplicate-set-number/${id}`
  );
  return response.data.data;
};

const setNumberService = {
  getAllSetNumbers,
  getSetNumbersByAssessment,
  getSetNumberById,
  createSetNumber,
  updateSetNumber,
  deleteSetNumber,
  duplicateSetNumber, // ✅ เพิ่มตรงนี้
};

export default setNumberService;
