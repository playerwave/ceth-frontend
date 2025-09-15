import axiosInstance from "../../libs/axios";
import { ApiAssessment } from "../../stores/api/assessment.api";

// 🔄 ดึงรายการแบบประเมินทั้งหมด
export const getAllAssessments = async (): Promise<ApiAssessment[]> => {
  console.log("🌐 [AssessmentService] Calling getAllAssessments API...");
  try {
    // เพิ่ม query parameters เพื่อให้ backend รู้ว่าต้องการข้อมูลแบบไหน
    // เปลี่ยนจาก 'latest' เป็น 'all' เพื่อดูข้อมูลทั้งหมด
    const response = await axiosInstance.get<{data: ApiAssessment[]}>(
      "/teacher/assessment/get-assessments?type=all&page=1&limit=100"
    );
    console.log("✅ [AssessmentService] API response:", response.data);
    // ✅ Backend คืน { data: [...] } ดังนั้นต้องดึง response.data.data
    return response.data.data || [];
  } catch (error) {
    console.error("❌ [AssessmentService] getAllAssessments error:", error);
    throw error;
  }
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
}): Promise<ApiAssessment> => {
  const response = await axiosInstance.put<ApiAssessment>(
    `/teacher/assessment/update-assessment/${payload.assessment_id}`,
    payload
  );
  return response.data; // ✅ ได้ข้อมูล assessment กลับมา
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


// 📥 ดึงแบบประเมินเต็ม (รวม sections, questions, choices)
export const getAssessmentFullById = async (id: number): Promise<any> => {
  const response = await axiosInstance.get(`/teacher/assessment/get-assessment-full/${id}`);
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
  createAssessmentFull,
  getAssessmentFullById,
  // ✅
};

export default assessmentService;
