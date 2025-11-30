import axiosInstance from "@/libs/axios";
import { readPdfFile, isPdfFile, PDFDocumentInfo } from "@/utils/pdfReader";

const CERTIFICATE_TEMPLATE_PATH = "/teacher/certificate";

/**
 * อ่านและวิเคราะห์ไฟล์ PDF (Frontend only)
 * ไม่ส่งไป Backend แต่ทำการวิเคราะห์ใน Frontend
 */
export const readPdfDocument = async (file: File): Promise<PDFDocumentInfo> => {
  try {
    console.log("📄 [CertificateTemplateService] Starting PDF reading...");
    console.log("📄 [CertificateTemplateService] File:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // ✅ ตรวจสอบว่าเป็นไฟล์ PDF หรือไม่
    if (!isPdfFile(file)) {
      throw new Error("ไฟล์ที่เลือกไม่ใช่ไฟล์ PDF");
    }

    // ✅ อ่าน PDF
    const pdfInfo = await readPdfFile(file);

    console.log("✅ [CertificateTemplateService] PDF reading completed");
    console.log("📊 [CertificateTemplateService] PDF Analysis Result:", {
      totalPages: pdfInfo.totalPages,
      hasText: pdfInfo.metadata.hasText,
      isScanned: pdfInfo.metadata.isScanned,
      textLength: pdfInfo.metadata.estimatedTextLength,
      fonts: pdfInfo.metadata.fonts,
      totalTextItems: pdfInfo.metadata.totalTextItems,
      metadata: {
        title: pdfInfo.title,
        author: pdfInfo.author,
        creator: pdfInfo.creator,
        producer: pdfInfo.producer
      }
    });

    // ✅ Debug: แสดงข้อมูลแต่ละหน้า
    console.log("📑 [CertificateTemplateService] Pages detail:");
    pdfInfo.pages.forEach((page, index) => {
      console.log(`  Page ${index + 1}:`, {
        textLength: page.text.length,
        textItems: page.textItems.length,
        dimensions: `${page.width.toFixed(2)} x ${page.height.toFixed(2)}`,
        preview: page.text.substring(0, 150) + (page.text.length > 150 ? '...' : ''),
        fonts: [...new Set(page.textItems.map(item => item.fontName).filter(Boolean))]
      });
    });

    // ✅ Debug: แสดง text items ตัวอย่างจากหน้าแรก
    if (pdfInfo.pages.length > 0 && pdfInfo.pages[0].textItems.length > 0) {
      console.log("🔍 [CertificateTemplateService] Sample text items from first page (first 10 items):");
      pdfInfo.pages[0].textItems.slice(0, 10).forEach((item, idx) => {
        console.log(`  Item ${idx + 1}:`, {
          text: item.str,
          position: `(${item.x.toFixed(2)}, ${item.y.toFixed(2)})`,
          size: `${item.width.toFixed(2)} x ${item.height.toFixed(2)}`,
          font: item.fontName,
          fontSize: item.fontSize?.toFixed(2)
        });
      });
    }

    return pdfInfo;
  } catch (error) {
    console.error("❌ [CertificateTemplateService] Error reading PDF:", error);
    throw error;
  }
};

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
  readPdfDocument,
  createActivityCertificateTemplate,
  getActivityCertificateTemplate,
};
