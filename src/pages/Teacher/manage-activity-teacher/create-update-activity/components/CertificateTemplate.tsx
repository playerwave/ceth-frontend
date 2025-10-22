import React, { useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCertificateStore } from "../../../../../stores/Teacher/certificate.store";

interface CertificateTemplateProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  disabled?: boolean;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  formData,
  setFormData,
  disabled = false
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [hasNewImage, setHasNewImage] = useState<boolean>(false); // ✅ Track ว่ามีไฟล์ใหม่หรือไม่
  const { isAnalyzing } = useCertificateStore();

  // ✅ ตรวจสอบว่ามีรูปภาพจาก formData หรือไม่ (สำหรับหน้าแก้ไข)
  // ✅ ใช้ certificateBase object ใหม่
  const existingImageUrl = formData.certificateBase?.template_image_url || formData.certificate_template_url;
  const displayImage = previewImage || existingImageUrl;
  
  // ✅ Debug: ตรวจสอบค่า formData
  console.log("🔍 [CertificateTemplate] formData:", {
    certificateBase: formData.certificateBase,
    certificate_template_url: formData.certificate_template_url,
    event_format: formData.event_format,
    existingImageUrl,
    displayImage,
    fullFormData: formData
  });

  // ✅ Debug: ตรวจสอบว่า component ถูก render หรือไม่
  console.log("🔍 [CertificateTemplate] Component rendered for event_format:", formData.event_format);


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ไฟล์ขนาดใหญ่เกินไป (ต้องไม่เกิน 5MB)");
        return;
      }

      // ✅ Step 1: แสดงตัวอย่างรูปภาพทันที
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewImage(localPreviewUrl);
      setUploadedFile(file);
      setHasNewImage(true);

      toast.info("🔄 กำลังส่งไฟล์ไป Backend เพื่อทำ OCR...");

      try {
        // ✅ Step 2: ส่งไฟล์ไป Backend เพื่อทำ OCR และอัปโหลดไป Cloudinary
        const uploadFormData = new FormData();
        uploadFormData.append('certificate_file', file); // ✅ เปลี่ยนเป็น certificate_file ให้ตรงกับ backend
        uploadFormData.append('description', formData.upload_certificate_description || '');

        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5090';
        const activityId = formData.activity_id || 'new'; // ใช้ 'new' สำหรับ create mode
        const response = await fetch(`${baseURL}/api/teacher/certificate/activity/${activityId}/template`, {
          method: 'POST',
          body: uploadFormData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("📁 [CertificateTemplate] Backend processing result:", result);

        // ✅ Step 3: เก็บข้อมูลที่ได้จาก Backend
        setFormData((prev: any) => ({
          ...prev,
          certificate_template_url: result.data?.certificate_template_url || result.data?.template_url,
          certificate_ocr_data: result.data?.certificate_ocr_data || result.data?.ocr_data,
          certificate_image_analysis: result.data?.certificate_image_analysis || result.data?.image_analysis,
          upload_certificate_description: result.data?.upload_certificate_description || prev.upload_certificate_description || ""
        }));

        toast.success("📸 อัปโหลดและวิเคราะห์ตัวอย่างใบรับรองสำเร็จ!");
      } catch (error) {
        console.error("❌ [CertificateTemplate] Backend processing failed:", error);
        toast.error("อัปโหลดและวิเคราะห์รูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setHasNewImage(false);
        setPreviewImage(null);
        setUploadedFile(null);
      }
    } else {
      // ✅ ถ้าไม่มีไฟล์ → รีเซ็ต
      setPreviewImage(null);
      setUploadedFile(null);
      setHasNewImage(false);
      setFormData((prev: any) => ({
        ...prev,
        certificateFile: null,
        certificate_template_url: null,
        certificate_ocr_data: null,
        certificate_image_analysis: null
      }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;

    setFormData((prev: any) => ({
      ...prev,
      upload_certificate_description: e.target.value
    }));
  };

  const handleRemoveImage = () => {
    if (disabled) return;

    // ✅ ลบจาก frontend state
    setPreviewImage(null);
    setUploadedFile(null);
    setHasNewImage(false);
    
    // ✅ ลบจาก formData - ทำให้ field ที่เก็บลิงก์เป็นค่าว่าง
    setFormData((prev: any) => ({
      ...prev,
      certificate_base_id: null,
      certificateBase: null,
      certificateFile: null,
      certificate_template_url: null, // ✅ ลิงก์รูปภาพเป็นค่าว่าง
      certificate_ocr_data: null,
      certificate_image_analysis: null,
      // ✅ ไม่ลบ upload_certificate_description เพื่อให้คำอธิบายยังคงอยู่
    }));

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    toast.success("ลบรูปตัวอย่างใบรับรองแล้ว");
  };

  // Show section only for Course format
  if (formData.event_format !== "Course") {
    return null;
  }

  return (
    <div className="space-y-4 mt-20">
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          ตัวอย่างใบรับรอง (สำหรับ Course)
        </h3>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบายใบรับรอง
          </label>
          <textarea
            value={formData.upload_certificate_description || formData.certificateBase?.description || ""}
            onChange={handleDescriptionChange}
            disabled={disabled}
            placeholder="ระบุรายละเอียดของใบรับรอง เช่น ผู้ออกใบรับรอง, ลักษณะของใบรับรอง, ข้อมูลที่ควรมี..."
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-1">
            อธิบายลักษณะของใบรับรองที่นิสิตต้องอัปโหลด
          </p>
        </div>

        {/* Certificate Template Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            อัปโหลดตัวอย่างใบรับรอง
          </label>

          {!displayImage ? (
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${
                disabled || isAnalyzing ? "bg-gray-100 cursor-not-allowed" : "hover:border-blue-400 cursor-pointer"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled || isAnalyzing}
                className="hidden"
                id="certificate-template-upload"
              />
              <label
                htmlFor="certificate-template-upload"
                className={disabled || isAnalyzing ? "cursor-not-allowed" : "cursor-pointer"}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-12 h-12 mx-auto text-blue-400 mb-2 animate-spin" />
                    <p className="text-blue-600">กำลังวิเคราะห์ใบรับรอง...</p>
                    <p className="text-sm text-gray-400 mt-1">
                      กรุณารอสักครู่
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">คลิกเพื่ออัปโหลดตัวอย่างใบรับรอง</p>
                    <p className="text-sm text-gray-400 mt-1">
                      PNG, JPG หรือ JPEG (สูงสุด 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="relative border-2 border-gray-200 rounded-lg p-4">
              <img
                src={displayImage}
                alt="Certificate Template Preview"
                className="w-full h-[500px] object-contain rounded"
              />
              
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  title="ลบรูปภาพ"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {uploadedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  <p className="font-medium">📎 {uploadedFile.name}</p>
                  <p className="text-gray-400">
                    ขนาด: {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            อัปโหลดตัวอย่างใบรับรองเพื่อให้นิสิตเห็นว่าต้องอัปโหลดแบบไหน
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;

