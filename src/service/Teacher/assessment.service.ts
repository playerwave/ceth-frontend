import axiosInstance from "../../libs/axios";
import { ApiAssessment } from "../../stores/api/assessment.api";

// 🔄 ดึงรายการแบบประเมิน (รองรับ type = latest | all | published)
export const getAllAssessments = async (
  type: "latest" | "all" | "published" = "latest",
  page = 1,
  limit = 100
): Promise<ApiAssessment[]> => {
  console.log("🌐 [AssessmentService] Calling getAllAssessments API...", { type, page, limit });
  try {
    const response = await axiosInstance.get<{ data: ApiAssessment[] }>(
      `/teacher/assessment/get-assessments?type=${type}&page=${page}&limit=${limit}`
    );
    console.log("✅ [AssessmentService] API response:", response.data);
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

// =============== Versioning endpoints ===============
export const getVersionHistory = async (assessmentId: number): Promise<any[]> => {
  const res = await axiosInstance.get<{ versions: any[] }>(
    `/teacher/assessment/${assessmentId}/versions`
  );
  return (res.data as any).versions ?? (res.data as any) ?? [];
};

export const getAllVersionAssessment = async (assessmentId: number): Promise<any[]> => {
  const res = await axiosInstance.get<{ versions: any[] }>(
    `/teacher/assessment/${assessmentId}/versions/all`
  );
  return (res.data as any).versions ?? (res.data as any) ?? [];
};

export const getLatestPublishedVersion = async (assessmentId: number): Promise<any | null> => {
  const res = await axiosInstance.get<{ version: any }>(
    `/teacher/assessment/${assessmentId}/versions/latest`
  );
  return (res.data as any).version ?? (res.data as any) ?? null;
};

export const getVersionWithFullData = async (versionId: number): Promise<any | null> => {
  const res = await axiosInstance.get<{ data: any }>(
    `/teacher/assessment/versions/${versionId}`
  );
  return (res.data as any).data ?? (res.data as any) ?? null;
};

export const createVersion = async (assessmentId: number): Promise<any> => {
  const res = await axiosInstance.post(
    `/teacher/assessment/${assessmentId}/versions`
  );
  return res.data;
};

export const publishVersion = async (assessmentId: number, versionId: number): Promise<any> => {
  const res = await axiosInstance.post(
    `/teacher/assessment/${assessmentId}/versions/${versionId}/publish`
  );
  return res.data;
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
  // versioning
  getVersionHistory,
  getAllVersionAssessment,
  getLatestPublishedVersion,
  getVersionWithFullData,
  createVersion,
  publishVersion,
  // ✅
};

export default assessmentService;
