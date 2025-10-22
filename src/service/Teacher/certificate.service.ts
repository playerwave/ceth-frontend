import axiosInstance from "../../libs/axios";
import { Certificate } from "../../types/certificate/certificate.type";
import { CertificateTemplate } from "../../types/certificate/certificate-template.type";
import { CertificateVerification } from "../../types/certificate/certificate-verofocation.type";
import { CertificateAudit } from "../../types/certificate/certificate-audit.type";
import { CertificateBase } from "../../types/certificate/certificate-base.type";

export interface CertificateTemplateAnalysis {
  success: boolean;
  ocrData?: {
    course_name?: string;
    instructor_name?: string;
    university_name?: string;
    completion_date?: string;
    certificate_id?: string;
    raw_text?: string;
  };
  imageAnalysis?: {
    dominantColors: {
      dominant: string;
      palette: string[];
    };
    logoPosition: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    watermark: {
      detected: boolean;
      confidence: number;
    };
    signature: {
      detected: boolean;
      confidence: number;
    };
    layout: {
      width: number;
      height: number;
      textRegions: number;
      imageRegions: number;
      emptySpaceRatio: number;
    };
  };
  metadata: {
    filename: string;
    size: number;
    mimetype: string;
    analyzedAt: string;
  };
}

export class CertificateService {
  /**
   * สร้าง Certificate Template สำหรับ Activity
   */
  async createActivityCertificateTemplate(
    activityId: number,
    file: File,
    description?: string
  ): Promise<any> {
    try {
      console.log("📤 [CertificateService] Creating certificate template for activity:", activityId);
      
      const formData = new FormData();
      formData.append("certificate_file", file);
      if (description) {
        formData.append("description", description);
      }

      const response = await axiosInstance.post(
        `/teacher/certificate/activity/${activityId}/template`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("📥 [CertificateService] Certificate template created:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error creating certificate template:", error);
      throw error;
    }
  }

  /**
   * ดึง Certificate Template สำหรับ Activity
   */
  async getActivityCertificateTemplate(activityId: number): Promise<any> {
    try {
      console.log("📥 [CertificateService] Getting certificate template for activity:", activityId);
      
      const response = await axiosInstance.get(
        `/teacher/certificate/activity/${activityId}/template`
      );

      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error getting certificate template:", error);
      throw error;
    }
  }

  /**
   * วิเคราะห์ใบรับรองตัวอย่าง
   */
  async analyzeCertificateTemplate(file: File): Promise<CertificateTemplateAnalysis> {
    console.log("🔍 [Certificate Service] Analyzing certificate template:", file.name);
    
    const formData = new FormData();
    formData.append("certificate", file);

    try {
      const response = await axiosInstance.post<CertificateTemplateAnalysis>(
        "/teacher/certificate-template/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ [Certificate Service] Analysis completed:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Certificate Service] Analysis failed:", error);
      throw error;
    }
  }

  /**
   * สร้าง Certificate
   */
  async createCertificate(data: Partial<Certificate>): Promise<Certificate> {
    try {
      console.log("📄 [CertificateService] Creating certificate");
      
      const response = await axiosInstance.post("/teacher/certificate/create", data);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error creating certificate:", error);
      throw error;
    }
  }

  /**
   * ดึง Certificate โดย ID
   */
  async getCertificateById(certificateId: number): Promise<Certificate> {
    try {
      console.log("🔍 [CertificateService] Getting certificate by ID:", certificateId);
      
      const response = await axiosInstance.get(`/teacher/certificate/${certificateId}`);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error getting certificate:", error);
      throw error;
    }
  }

  /**
   * ดึง Certificate ทั้งหมดของนิสิต
   */
  async getCertificatesByStudentId(studentId: number): Promise<Certificate[]> {
    try {
      console.log("📥 [CertificateService] Getting certificates for student:", studentId);
      
      const response = await axiosInstance.get(`/teacher/certificate/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error getting certificates by student:", error);
      throw error;
    }
  }

  /**
   * อัปเดต Certificate
   */
  async updateCertificate(certificateId: number, data: Partial<Certificate>): Promise<Certificate> {
    try {
      console.log("🔧 [CertificateService] Updating certificate:", certificateId);
      
      const response = await axiosInstance.put(`/teacher/certificate/${certificateId}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error updating certificate:", error);
      throw error;
    }
  }

  /**
   * ตรวจสอบ Certificate
   */
  async verifyCertificate(certificateId: number, file: File, templateId?: number): Promise<CertificateVerification> {
    try {
      console.log("🔍 [CertificateService] Verifying certificate:", certificateId);
      
      const formData = new FormData();
      formData.append("certificate_file", file);
      if (templateId) {
        formData.append("templateId", templateId.toString());
      }

      const response = await axiosInstance.post(
        `/teacher/certificate/${certificateId}/verify`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error verifying certificate:", error);
      throw error;
    }
  }

  /**
   * ดึง Certificate Verification
   */
  async getVerificationsByCertificateId(certificateId: number): Promise<CertificateVerification[]> {
    try {
      console.log("📥 [CertificateService] Getting verifications for certificate:", certificateId);
      
      const response = await axiosInstance.get(`/teacher/certificate/${certificateId}/verifications`);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error getting verifications:", error);
      throw error;
    }
  }

  /**
   * ดึง Certificate Audit
   */
  async getAuditsByCertificateId(certificateId: number): Promise<CertificateAudit[]> {
    try {
      console.log("📥 [CertificateService] Getting audits for certificate:", certificateId);
      
      const response = await axiosInstance.get(`/teacher/certificate/${certificateId}/audits`);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error getting audits:", error);
      throw error;
    }
  }

  /**
   * สร้าง Certificate Base
   */
  async createCertificateBase(data: Partial<CertificateBase>): Promise<CertificateBase> {
    try {
      console.log("🏗️ [CertificateService] Creating certificate base");
      
      const response = await axiosInstance.post("/teacher/certificate/base/create", data);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error creating certificate base:", error);
      throw error;
    }
  }

  /**
   * ดึง Certificate Base โดย Activity ID
   */
  async getCertificateBaseByActivityId(activityId: number): Promise<CertificateBase> {
    try {
      console.log("🔍 [CertificateService] Getting certificate base for activity:", activityId);
      
      const response = await axiosInstance.get(`/teacher/certificate/get-certificate-base-by-activity-id/${activityId}`);
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error getting certificate base:", error);
      throw error;
    }
  }

  /**
   * ดึงสถิติการตรวจสอบ Certificate
   */
  async getCertificateVerificationStats(): Promise<any> {
    try {
      console.log("📊 [CertificateService] Getting certificate verification statistics");
      
      const response = await axiosInstance.get("/teacher/certificate/analytics/verification-stats");
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error getting verification stats:", error);
      throw error;
    }
  }

  /**
   * ดึง Certificate ที่รอการตรวจสอบ
   */
  async getPendingCertificates(): Promise<Certificate[]> {
    try {
      console.log("⏳ [CertificateService] Getting pending certificates");
      
      const response = await axiosInstance.get("/teacher/certificate/pending/list");
      return response.data;
    } catch (error) {
      console.error("❌ [CertificateService] Error getting pending certificates:", error);
      throw error;
    }
  }
}

export const certificateService = new CertificateService();
