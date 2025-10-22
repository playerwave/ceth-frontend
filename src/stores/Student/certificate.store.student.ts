import { create } from "zustand";
import { Certificate } from "../../types/certificate/certificate.type";
import certificateService from "../../service/Student/certificate.service";

interface CertificateStore {
  selectedCertificate: Certificate | null;
  certificates: Certificate[];
  certificateLoading: boolean;
  certificateError: string | null;
  
  fetchCertificateById: (id: number) => Promise<Certificate | null>;
  fetchCertificatesByStudentId: () => Promise<Certificate[]>;
  uploadCertificate: (file: File) => Promise<any>;
  clearSelectedCertificate: () => void;
}

export const useCertificateStore = create<CertificateStore>((set, get) => ({
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
  uploadCertificate: async (file: File) => {
    console.log("📤 Uploading certificate file:", file.name);
    set({ certificateLoading: true, certificateError: null });
    try {
      const result = await certificateService.uploadCertificate(file);
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
