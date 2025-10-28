import { create } from "zustand";
import { Certificate } from "@/types/certificate/certificate.type";
import certificateService from "@/service/Student/certificate.service";

// ✅ Interface สำหรับผลการตรวจสอบ Certificate
export interface CertificateVerificationResult {
  success: boolean;
  confidenceScore: number;
  isAuthentic: boolean;
  matchedFeatures: string[];
  failedFeatures: string[];
  recommendations: string[];
  ocrData: {
    fullName: string;
    courseName: string;
    teacher: string;
    certificateId: string;
    date: string;
    rawText: string;
  };
  verificationDetails: {
    courseNameMatch: number;
    instructorMatch: number;
    visualMatch: number;
    formatMatch: number;
  };
}

interface CertificateStore {
  selectedCertificate: Certificate | null;
  certificates: Certificate[];
  certificateLoading: boolean;
  certificateError: string | null;
  
  fetchCertificateById: (id: number) => Promise<Certificate | null>;
  fetchCertificatesByStudentId: () => Promise<Certificate[]>;
  uploadCertificate: (file: File | null, activityId: number, linkData?: any, studentId?: number) => Promise<CertificateVerificationResult>;
  clearSelectedCertificate: () => void;
}

export const useCertificateStore = create<CertificateStore>((set) => ({
  selectedCertificate: null,
  certificates: [],
  certificateLoading: false,
  certificateError: null,

  //--------------------- Fetch Certificate By Id -------------------------
  fetchCertificateById: async (id: number) => {
    console.log("📥 Fetching certificate with ID:", id);

    set({ certificateLoading: true, certificateError: null });
    try {
      const certificate = await certificateService.getCertificateById(id);
      set({ selectedCertificate: certificate });
      return certificate;
    } catch (error) {
      console.error("❌ Error fetching certificate:", error);
      set({ certificateError: "ไม่สามารถโหลดข้อมูลเกียรติบัตรนี้ได้" });
      return null;
    } finally {
      set({ certificateLoading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Fetch Certificates By Student ID -------------------------
  fetchCertificatesByStudentId: async () => {
    console.log("📥 Fetching certificates for student");

    set({ certificateLoading: true, certificateError: null });
    try {
      const certificates = await certificateService.getCertificatesByStudentId();
      set({ certificates });
      return certificates;
    } catch (error) {
      console.error("❌ Error fetching certificates:", error);
      set({ certificateError: "ไม่สามารถโหลดข้อมูลเกียรติบัตรได้" });
      return [];
    } finally {
      set({ certificateLoading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Clear Selected Certificate -------------------------
  clearSelectedCertificate: () => set({ selectedCertificate: null }),
  //----------------------------------------------------------------

  //--------------------- Upload Certificate (OCR) -------------------------
  uploadCertificate: async (file: File | null, activityId: number, linkData?: any, studentId?: number) => {
    if (file) {
      console.log("📤 Uploading certificate file:", file.name, "for activity:", activityId);
    } else if (linkData) {
      console.log("🔗 Uploading certificate link data for activity:", activityId, linkData, "studentId:", studentId);
    }
    set({ certificateLoading: true, certificateError: null });
    try {
      const result = await certificateService.uploadCertificate(file, activityId, linkData, studentId);
      console.log("✅ Upload successful:", result);
      return result;
    } catch (err) {
      console.error("❌ Error uploading certificate:", err);
      set({ certificateError: "ไม่สามารถอัปโหลดเกียรติบัตรได้" });
      throw err;
    } finally {
      set({ certificateLoading: false });
    }
  },
  //----------------------------------------------------------------
}));
