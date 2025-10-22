import axiosInstance from "../../libs/axios";

const CERTIFICATE_TEMPLATE_PATH = "/teacher/certificate";

export const createActivityCertificateTemplate = async (
  activityId: number,
  file: File,
  description?: string
): Promise<any> => {
  try {
    console.log("📤 [CertificateTemplateService] Creating certificate template for activity:", activityId);
    
    const formData = new FormData();
    formData.append("certificate_file", file);
    if (description) {
      formData.append("description", description);
    }

    const response = await axiosInstance.post(
      `${CERTIFICATE_TEMPLATE_PATH}/activity/${activityId}/template`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log("📥 [CertificateTemplateService] Certificate template created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [CertificateTemplateService] Error creating certificate template:", error);
    throw error;
  }
};

export const getActivityCertificateTemplate = async (activityId: number): Promise<any> => {
  try {
    console.log("📥 [CertificateTemplateService] Getting certificate template for activity:", activityId);
    
    const response = await axiosInstance.get(
      `${CERTIFICATE_TEMPLATE_PATH}/activity/${activityId}/template`
    );

    return response.data;
  } catch (error) {
    console.error("❌ [CertificateTemplateService] Error getting certificate template:", error);
    throw error;
  }
};

export default {
  createActivityCertificateTemplate,
  getActivityCertificateTemplate,
};
