import axiosInstance from "../../libs/axios";
import { ApiAssessment } from "../../stores/api/assessment.api";

// 🔄 ดึงรายการแบบประเมินทั้งหมด
export const getAllAssessments = async (): Promise<ApiAssessment[]> => {
  const response = await axiosInstance.get<ApiAssessment[]>(
    "/teacher/assessment/get-assessments"
  );
  // ✅ สมมติ backend คืน array ตรง ๆ (ไม่ห่อ { data: [...] })
  return response.data;
};

// 📥 ดึงแบบประเมินตาม ID
export const getAssessmentById = async (id: number): Promise<ApiAssessment> => {
  const response = await axiosInstance.get<ApiAssessment>(
    `/teacher/assessment/get-assessment/${id}`
  );
  return response.data;
};


// ➕ เพิ่มแบบประเมินแบบเต็ม (สำหรับการสร้างพร้อมชุดคำถาม)
export const createAssessmentFull = async (payload: any): Promise<any> => {
  const response = await axiosInstance.post("/teacher/assessment/create-assessment-full", payload);
  return response.data;
};
// ➕ เพิ่มแบบประเมิน
export const createAssessment = async (payload: {
  assessment_name: string;
  description: string;
  assessment_status: "Not finished" | "Finished" | "Unsuccessful";
  status: "Active" | "Inactive";
  create_date: string;
  last_update: string;
}): Promise<{ assessment_id: number }> => {
  const response = await axiosInstance.post<{ assessment_id: number }>(
    "/teacher/assessment/create-assessment",
    payload
  );
  return response.data; // ✅ จะได้ assessment_id กลับมา
};
// ✏️ แก้ไขแบบประเมิน
export const updateAssessment = async (payload: {
  assessment_id: number;
  assessment_name: string;
  description: string;
  assessment_status: "Not finished" | "Finished" | "Unsuccessful";
  
  status: "Active" | "Inactive";
  last_update: string;
}): Promise<void> => {
  await axiosInstance.put(
    `/teacher/assessment/update-assessment/${payload.assessment_id}`,
    payload
  );
};

// 🗑️ ลบแบบประเมิน
export const deleteAssessment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/teacher/assessment/delete-assessment/${id}`);
};

// 🔍 ค้นหาแบบประเมินตามชื่อ
export const searchAssessments = async (
  keyword: string
): Promise<ApiAssessment[]> => {
  const response = await axiosInstance.get<ApiAssessment[]>(
    `/teacher/assessment/search?name=${encodeURIComponent(keyword)}`
  );
  return response.data;
};

// ✅ Export แบบ object สำหรับใช้ใน store
const assessmentService = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  searchAssessments,
   createAssessmentFull, // ✅
};

export default assessmentService;
