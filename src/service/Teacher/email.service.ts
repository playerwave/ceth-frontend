import axiosInstance from "@/libs/axios";

const API_BASE_URL = ""; // ✅ ใช้ empty string เพราะ axiosInstance มี baseURL แล้ว

export interface EmailTemplateData {
  [key: string]: any;
}

export interface EmailPreviewResponse {
  success: boolean;
  html: string;
  templateName: string;
  data: EmailTemplateData;
  templatePath: string;
}

export interface TemplatesResponse {
  success: boolean;
  templates: string[];
  count: number;
}

export class EmailService {
  // ดึงรายการ templates ที่มีอยู่
  static async getTemplates(): Promise<TemplatesResponse> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/email/templates`);
      return response.data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  }

  // Preview template ด้วยข้อมูล
  static async previewTemplate(
    templateName: string, 
    data: EmailTemplateData
  ): Promise<EmailPreviewResponse> {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/email/preview`, {
        templateName,
        data
      });
      return response.data;
    } catch (error) {
      console.error("Error previewing template:", error);
      throw error;
    }
  }

  // ส่งอีเมล
  static async sendEmail(
    templateName: string, 
    data: EmailTemplateData
  ): Promise<any> {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/email/send`, {
        templateName,
        data
      });
      return response.data;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}
