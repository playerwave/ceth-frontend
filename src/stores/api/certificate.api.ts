import axiosInstance from "@/libs/axios";
import { Certificate } from "@/types/certificate/certificate.type";
import { CertificateBase } from "@/types/certificate/certificate-base.type";

export class CertificateApi {
  // Certificate Template APIs
  async createActivityCertificateTemplate(activityId: number, file: File, description?: string) {
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
    return response.data;
  }

  async getActivityCertificateTemplate(activityId: number) {
    const response = await axiosInstance.get(`/teacher/certificate/activity/${activityId}/template`);
    return response.data;
  }

  // Certificate APIs
  async createCertificate(data: Partial<Certificate>) {
    const response = await axiosInstance.post("/teacher/certificate/create", data);
    return response.data;
  }

  async getCertificateById(certificateId: number) {
    const response = await axiosInstance.get(`/teacher/certificate/${certificateId}`);
    return response.data;
  }

  async getCertificatesByStudentId(studentId: number) {
    const response = await axiosInstance.get(`/teacher/certificate/student/${studentId}`);
    return response.data;
  }

  async updateCertificate(certificateId: number, data: Partial<Certificate>) {
    const response = await axiosInstance.put(`/teacher/certificate/${certificateId}`, data);
    return response.data;
  }

  async verifyCertificate(certificateId: number, file: File, templateId?: number) {
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
  }

  async getVerificationsByCertificateId(certificateId: number) {
    const response = await axiosInstance.get(`/teacher/certificate/${certificateId}/verifications`);
    return response.data;
  }

  async getAuditsByCertificateId(certificateId: number) {
    const response = await axiosInstance.get(`/teacher/certificate/${certificateId}/audits`);
    return response.data;
  }

  // Certificate Base APIs
  async createCertificateBase(data: Partial<CertificateBase>) {
    const response = await axiosInstance.post("/teacher/certificate/base/create", data);
    return response.data;
  }

  async getCertificateBaseByActivityId(activityId: number) {
    const response = await axiosInstance.get(`/teacher/certificate/get-certificate-base-by-activity-id/${activityId}`);
    return response.data;
  }

  // Analytics APIs
  async getCertificateVerificationStats() {
    const response = await axiosInstance.get("/teacher/certificate/analytics/verification-stats");
    return response.data;
  }

  async getPendingCertificates() {
    const response = await axiosInstance.get("/teacher/certificate/pending/list");
    return response.data;
  }
}

export const certificateApi = new CertificateApi();
