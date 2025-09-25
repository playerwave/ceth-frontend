// service/Student/certificate.service.student.ts
import axiosInstance from "../../libs/axios";
import { Certificate } from "../../types/certificate/certificate.type";
import { mapApiToCertificate } from "../../stores/mapper/certificate.mapper";

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

//--------------------- Upload Certificate (OCR) ----------------------------
export const uploadCertificate = async (file: File): Promise<any> => {
  console.log("📤 Uploading certificate file:", file.name);
  
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
  
  console.log("📥 Upload certificate response:", response.data);
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Export Service -----------------------------
const certificateService = {
  getCertificateById,
  uploadCertificate,
};
//------------------------------------------------------------------

export default certificateService;
