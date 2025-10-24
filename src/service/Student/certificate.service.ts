// service/Student/certificate.service.student.ts
import axiosInstance from "../../libs/axios";
import { Certificate } from "../../types/certificate/certificate.type";
import { mapApiToCertificate } from "../../stores/mapper/certificate.mapper";
import { CertificateVerificationResult } from "../../stores/Student/certificate.store.student";

// Base path
const STUDENT_CERTIFICATE_PATH = "/student/certificate";

//--------------------- Get Certificate By Id -------------------------
export const getCertificateById = async (id: number): Promise<Certificate> => {
  const response = await axiosInstance.get<any>(
    `${STUDENT_CERTIFICATE_PATH}/get-certificate/${id}`
  );
  console.log("🔍 Certificate data service:", response.data);
  return mapApiToCertificate(response.data);
};
//------------------------------------------------------------------

//--------------------- Get Certificates By Student ID -------------------------
export const getCertificatesByStudentId = async (): Promise<Certificate[]> => {
  const response = await axiosInstance.get<any[]>(
    `${STUDENT_CERTIFICATE_PATH}/get-certificates`
  );
  console.log("🔍 Certificates data service:", response.data);
  return response.data.map(mapApiToCertificate);
};
//------------------------------------------------------------------

//--------------------- Upload Certificate (Full Upload with OCR) ----------------------------
export const uploadCertificateWithOCR = async (data: {
  file: File;
  activity_id: number;
  hours?: number;
  date?: string;
}): Promise<Certificate> => {
  console.log("📤 Uploading certificate with OCR:", data);
  
  const formData = new FormData();
  formData.append("certificate", data.file);
  formData.append("activity_id", String(data.activity_id));
  if (data.hours) formData.append("hours", String(data.hours));
  if (data.date) formData.append("date", data.date);

  const response = await axiosInstance.post(
    `${STUDENT_CERTIFICATE_PATH}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  console.log("📥 Upload certificate response:", response.data);
  return mapApiToCertificate(response.data.data);
};
//------------------------------------------------------------------

//--------------------- OCR Only (สำหรับดึงข้อมูลอย่างเดียว) ----------------------------
export const uploadCertificateForOCR = async (file: File): Promise<any> => {
  console.log("📤 Uploading certificate for OCR only:", file.name);
  
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    "/ocr",
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  console.log("📥 OCR response:", response.data);
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Upload Certificate with Activity ID -------------------------
export const uploadCertificate = async (file: File, activityId: number): Promise<CertificateVerificationResult> => {
  console.log("📤 [Certificate Service] Uploading certificate with activity ID:", activityId);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('activityId', activityId.toString());
  
  try {
    const response = await axiosInstance.post<CertificateVerificationResult>(
      `${STUDENT_CERTIFICATE_PATH}/upload-with-verification`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log("✅ [Certificate Service] Upload with verification successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [Certificate Service] Error uploading certificate:", error);
    throw error;
  }
};
//------------------------------------------------------------------

//--------------------- Export Service -----------------------------
const certificateService = {
  getCertificateById,
  getCertificatesByStudentId,
  uploadCertificateWithOCR,
  uploadCertificateForOCR,
  uploadCertificate,
};
//------------------------------------------------------------------

export default certificateService;
