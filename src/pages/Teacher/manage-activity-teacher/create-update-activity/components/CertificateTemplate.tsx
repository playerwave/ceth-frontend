import React, { useState, useEffect } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCertificateStore } from "@/stores/Teacher/certificate.store";
import axiosInstance from "@/libs/axios";

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
  const [ , setHasNewImage] = useState<boolean>(false); // ✅ Track ว่ามีไฟล์ใหม่หรือไม่
  const { isAnalyzing } = useCertificateStore();
  
  // ✅ Helper function ตรวจสอบว่าเป็น PDF หรือไม่
  const isPdfFile = (file: File): boolean => {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  };

  // ✅ ตรวจสอบว่ามีรูปภาพจาก formData หรือไม่ (สำหรับหน้าแก้ไข)
  // ✅ ใช้ certificateBase object ใหม่
  const existingImageUrl = formData.certificateBase?.template_image_url || formData.certificate_template_url;
  const displayImage = previewImage || existingImageUrl;
  
  // ✅ ตรวจสอบว่า URL ที่มีอยู่เป็น PDF หรือไม่ (เช็คจาก URL extension หรือ Cloudinary format)
  const isExistingPdf = existingImageUrl && (
    existingImageUrl.toLowerCase().endsWith('.pdf') || 
    existingImageUrl.toLowerCase().includes('.pdf') ||
    existingImageUrl.toLowerCase().includes('/pdf/') ||
    (existingImageUrl.includes('cloudinary') && existingImageUrl.includes('fl_attachment')) ||
    (existingImageUrl.includes('cloudinary') && existingImageUrl.match(/\.pdf(\?|$)/i))
  );
  
  // ✅ ตรวจสอบว่าไฟล์ที่แสดงเป็น PDF หรือไม่
  const isPdfPreview = uploadedFile 
    ? isPdfFile(uploadedFile)
    : isExistingPdf;
  
  // ✅ แก้ไข Cloudinary URL ให้แสดง PDF ได้ (รองรับทั้ง public และ private URLs)
  const getCleanPdfUrl = (url: string): string => {
    if (!url) return '';
    
    // ✅ ถ้าเป็น local blob URL (ไฟล์ใหม่ที่อัปโหลด) ให้ใช้ตรงๆ
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    
    // ✅ ถ้าเป็น Cloudinary URL
    if (url.includes('cloudinary')) {
      let cloudinaryUrl = url;
      
      // ✅ ลบ fl_attachment parameter (ถ้ามี) เพื่อให้แสดงแทน download
      cloudinaryUrl = cloudinaryUrl.replace(/fl_attachment[^&]*/g, '').replace(/&+/g, '&').replace(/[&?]$/, '');
      
      // ✅ ถ้า URL เป็น image/upload/... ให้ลองใช้ object tag แทน embed
      // เพราะบางเบราว์เซอร์ embed อาจมีปัญหา CORS
      
      console.log("📄 [CertificateTemplate] Cloudinary PDF URL (cleaned):", cloudinaryUrl);
      console.log("📄 [CertificateTemplate] Is raw URL:", cloudinaryUrl.includes('/raw/upload/'));
      console.log("📄 [CertificateTemplate] Is image URL:", cloudinaryUrl.includes('/image/upload/'));
      
      return cloudinaryUrl;
    }
    
    // ✅ ถ้าเป็น URL อื่นๆ ให้ใช้ตรงๆ
    return url;
  };
  
  // ✅ สร้าง URL สำหรับแสดง PDF (ลบการใช้ Google Docs Viewer)
  const pdfCleanUrl = displayImage ? getCleanPdfUrl(displayImage) : '';
  // ✅ เก็บ URL เดิมสำหรับ download และเปิดในแท็บใหม่
  const pdfDirectUrl = displayImage || '';
  
  // ✅ Debug: Log URLs
  useEffect(() => {
    if (isPdfPreview && displayImage) {
      console.log("📄 [CertificateTemplate] PDF Preview URLs:", {
        displayImage,
        pdfCleanUrl,
        pdfDirectUrl,
        isBlob: pdfDirectUrl?.startsWith('blob:'),
        isCloudinary: pdfDirectUrl?.includes('cloudinary')
      });
    }
  }, [isPdfPreview, displayImage, pdfCleanUrl, pdfDirectUrl]);
  
  // ✅ State สำหรับ PDF viewer
  const [pdfError, setPdfError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // ✅ สร้าง proxy URL สำหรับ Cloudinary PDFs (แก้ปัญหา 401)
  const getPdfProxyUrl = (url: string): string => {
    if (!url) return '';
    
    // ✅ ถ้าเป็น local blob URL ให้ใช้ตรงๆ
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    
    // ✅ ถ้าเป็น Cloudinary URL ให้ใช้ backend proxy
    if (url.includes('cloudinary.com')) {
      const proxyUrl = `/api/teacher/certificate-template/proxy-pdf?url=${encodeURIComponent(url)}`;
      console.log("📄 [CertificateTemplate] Using proxy URL for Cloudinary PDF:", proxyUrl);
      return proxyUrl;
    }
    
    return url;
  };
  
  const pdfProxyUrl = displayImage ? getPdfProxyUrl(displayImage) : '';
  
  // ✅ Reset error state เมื่อ URL เปลี่ยน
  useEffect(() => {
    if (isPdfPreview && displayImage) {
      setPdfError(false);
      setPdfLoading(false); // ไม่ต้อง loading ตรวจสอบ HEAD request
    }
  }, [isPdfPreview, displayImage]);
  
  // ✅ Debug: ตรวจสอบค่า formData
  console.log("🔍 [CertificateTemplate] formData:", {
    certificateBase: formData.certificateBase,
    certificate_template_url: formData.certificate_template_url,
    event_format: formData.event_format,
    existingImageUrl,
    displayImage,
    isExistingPdf,
    isPdfPreview,
    uploadedFileType: uploadedFile?.type
  });

  // ✅ Debug: ตรวจสอบว่า component ถูก render หรือไม่
  console.log("🔍 [CertificateTemplate] Component rendered for event_format:", formData.event_format);


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // ✅ Validate file type - รองรับทั้งรูปภาพและ PDF
      const isImage = file.type.startsWith("image/");
      const isPdf = isPdfFile(file);

      if (!isImage && !isPdf) {
        toast.error("กรุณาอัปโหลดไฟล์รูปภาพหรือ PDF เท่านั้น!");
        return;
      }

      // Validate file size (max 20MB สำหรับทั้ง PDF และรูปภาพ)
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        toast.error("ไฟล์ขนาดใหญ่เกินไป (สูงสุด 20MB)");
        return;
      }

      setUploadedFile(file);
      setHasNewImage(true);

      // ✅ แสดง preview (รองรับทั้งรูปภาพและ PDF)
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewImage(localPreviewUrl);

      // ✅ ส่งไฟล์ไป Backend เพื่อทำ OCR (รองรับทั้งรูปภาพและ PDF)
      toast.info(isPdf ? "📄 กำลังส่งไฟล์ PDF ไป Backend เพื่อทำ OCR..." : "🔄 กำลังส่งไฟล์ไป Backend เพื่อทำ OCR...");

      try {
        // ✅ Step 2: ส่งไฟล์ไป Backend เพื่อทำ OCR และอัปโหลดไป Cloudinary
        const activityId = formData.activity_id || 'new'; // ใช้ 'new' สำหรับ create mode
        
        // สร้าง FormData สำหรับ axios
        const axiosFormData = new FormData();
        axiosFormData.append('certificate_file', file);
        axiosFormData.append('description', formData.upload_certificate_description || '');
        
        const response = await axiosInstance.post(
          `/teacher/certificate-template/activity/${activityId}/template`,
          axiosFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            // ✅ กำหนด timeout สำหรับ file upload
            timeout: 300000, // 5 นาที
          }
        );

        // ✅ axios จะ throw error อัตโนมัติถ้า status code ไม่ใช่ 2xx
        const result = response.data;
        console.log("📁 [CertificateTemplate] Backend processing result:", result);

        // ✅ Step 3: เก็บข้อมูลที่ได้จาก Backend
        if (result.success && result.data) {
          setFormData((prev: any) => ({
            ...prev,
            certificate_template_url: result.data.certificate_template_url,
            certificate_ocr_data: result.data.certificate_ocr_data,
            certificate_image_analysis: result.data.certificate_image_analysis,
            upload_certificate_description: result.data.upload_certificate_description || prev.upload_certificate_description || ""
          }));
          
          console.log("✅ [CertificateTemplate] Form data updated with certificate template data");
        } else {
          console.warn("⚠️ [CertificateTemplate] Unexpected response format:", result);
          toast.error("รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง");
        }

        // ✅ Log ข้อมูล OCR ที่ได้
        if (result.success && result.data?.certificate_ocr_data) {
          const ocrData = result.data.certificate_ocr_data;
          console.log("📋 [CertificateTemplate] OCR Result:", {
            hasRawText: !!ocrData.raw_text,
            rawTextLength: ocrData.raw_text?.length || 0,
            hasNaturalText: !!ocrData.natural_text,
            naturalTextLength: ocrData.natural_text?.length || 0,
            extractedFields: Object.keys(ocrData).filter(key => 
              !['raw_text', 'natural_text'].includes(key)
            ),
            fullOcrData: ocrData
          });
          
          // ✅ แสดง natural_text ใน console (สำหรับ debug)
          if (ocrData.natural_text) {
            console.log("📄 [CertificateTemplate] Natural Text from OCR:", ocrData.natural_text);
          } else if (ocrData.raw_text) {
            console.log("📄 [CertificateTemplate] Raw Text from OCR:", ocrData.raw_text);
          }
        }
        
        toast.success(isPdf ? "📄 อัปโหลดและวิเคราะห์ PDF สำเร็จ!" : "📸 อัปโหลดและวิเคราะห์ตัวอย่างใบรับรองสำเร็จ!");
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
                accept="image/*,.pdf,application/pdf"
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
                      รูปภาพ: PNG, JPG หรือ JPEG
                    </p>
                    <p className="text-sm text-gray-400">
                      หรือ PDF (สูงสุด 20MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="relative border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              {isPdfPreview ? (
                // ✅ แสดง PDF preview (ใช้หลายวิธี fallback)
                <div className="w-full h-[600px] rounded overflow-hidden bg-gray-100 border border-gray-200 relative">
                  {pdfLoading ? (
                    // ✅ Loading state
                    <div className="flex flex-col items-center justify-center h-full bg-white">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                      <p className="text-gray-600">กำลังโหลด PDF...</p>
                    </div>
                  ) : !pdfError ? (
                    <>
                      {/* ✅ วิธี 1: ใช้ embed tag สำหรับไฟล์ blob/local */}
                      {pdfDirectUrl?.startsWith('blob:') || pdfDirectUrl?.startsWith('data:') ? (
                        <embed
                          src={pdfDirectUrl}
                          type="application/pdf"
                          className="w-full h-full bg-white"
                          title="Certificate PDF Preview"
                          onError={() => {
                            console.error("❌ [CertificateTemplate] Embed failed");
                            setPdfError(true);
                          }}
                        />
                      ) : (
                        /* ✅ วิธี 2: ใช้ proxy URL สำหรับ Cloudinary URLs (แก้ปัญหา 401) */
                        <object
                          data={pdfProxyUrl || pdfCleanUrl || pdfDirectUrl || ''}
                          type="application/pdf"
                          className="w-full h-full bg-white"
                          title="Certificate PDF Preview"
                          aria-label="Certificate PDF Preview"
                          onError={() => {
                            console.error("❌ [CertificateTemplate] Object tag failed, trying embed...");
                            // ไม่ set error ทันที ให้ลอง embed ก่อน
                          }}
                        >
                          {/* ✅ Fallback: ถ้า object ไม่ทำงาน ให้แสดง embed */}
                          <embed
                            src={pdfProxyUrl || pdfCleanUrl || pdfDirectUrl || ''}
                            type="application/pdf"
                            className="w-full h-full bg-white"
                            title="Certificate PDF Preview"
                            onError={() => {
                              console.error("❌ [CertificateTemplate] PDF embed load error");
                              setPdfError(true);
                            }}
                          />
                          {/* ✅ Fallback 2: ถ้า embed ก็ไม่ทำงาน */}
                          <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50 p-4">
                            <FileText className="w-16 h-16 mb-4 text-gray-400" />
                            <p className="text-lg font-semibold mb-2">ไม่สามารถแสดง PDF preview ได้</p>
                            <p className="text-sm text-gray-400 mb-2 text-center">
                              อาจเป็นเพราะไฟล์เป็น private หรือมีปัญหา CORS
                            </p>
                            <p className="text-sm text-blue-600 text-center">
                              กรุณาใช้ปุ่ม "เปิดในแท็บใหม่" หรือ "ดาวน์โหลด" ด้านล่าง
                            </p>
                          </div>
                        </object>
                      )}
                    </>
                  ) : (
                    /* ✅ Fallback: แสดงข้อความและปุ่มเมื่อ PDF preview ไม่ทำงาน */
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white border-2 border-dashed border-gray-300 rounded">
                      <FileText className="w-20 h-20 mb-4 text-gray-400" />
                      <p className="text-xl font-semibold mb-2 text-gray-700">ไม่สามารถแสดง PDF preview ได้</p>
                      <p className="text-sm text-gray-500 mb-1 text-center px-4">
                        อาจเป็นเพราะไฟล์เป็น private หรือมีปัญหา CORS
                      </p>
                      <p className="text-sm text-gray-500 mb-6 text-center px-4">
                        กรุณาใช้ปุ่มด้านล่างเพื่อเปิดหรือดาวน์โหลดไฟล์
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (pdfDirectUrl) {
                              const newWindow = window.open(pdfDirectUrl, '_blank', 'noopener,noreferrer');
                              if (!newWindow) {
                                toast.error("ไม่สามารถเปิดหน้าต่างใหม่ได้ กรุณาตรวจสอบ popup blocker");
                              }
                            }
                          }}
                          className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                        >
                          เปิดในแท็บใหม่ 📄
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (pdfDirectUrl) {
                              try {
                                const link = document.createElement('a');
                                link.href = pdfDirectUrl;
                                link.download = uploadedFile?.name || 'certificate.pdf';
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                toast.success("กำลังดาวน์โหลดไฟล์ PDF...");
                              } catch (error) {
                                console.error("❌ [CertificateTemplate] Download error:", error);
                                toast.error("ไม่สามารถดาวน์โหลดไฟล์ได้");
                              }
                            }
                          }}
                          className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
                        >
                          ดาวน์โหลด 💾
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* ✅ ปุ่มเปิดในแท็บใหม่และดาวน์โหลด */}
                  <div className="absolute bottom-2 right-2 z-10 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (pdfDirectUrl) {
                          const newWindow = window.open(pdfDirectUrl, '_blank', 'noopener,noreferrer');
                          if (!newWindow) {
                            toast.error("ไม่สามารถเปิดหน้าต่างใหม่ได้ กรุณาตรวจสอบ popup blocker");
                          }
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded shadow-md hover:bg-blue-600 transition-colors"
                    >
                      เปิดในแท็บใหม่ 📄
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (pdfDirectUrl) {
                          try {
                            const link = document.createElement('a');
                            link.href = pdfDirectUrl;
                            link.download = uploadedFile?.name || 'certificate.pdf';
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success("กำลังดาวน์โหลดไฟล์ PDF...");
                          } catch (error) {
                            console.error("❌ [CertificateTemplate] Download error:", error);
                            toast.error("ไม่สามารถดาวน์โหลดไฟล์ได้");
                          }
                        }
                      }}
                      className="px-3 py-1.5 bg-green-500 text-white text-sm rounded shadow-md hover:bg-green-600 transition-colors"
                    >
                      ดาวน์โหลด 💾
                    </button>
                  </div>
                </div>
              ) : (
                // ✅ แสดงรูปภาพ preview
                <img
                  src={displayImage || ''}
                alt="Certificate Template Preview"
                  className="w-full h-[500px] object-contain rounded bg-white"
              />
              )}
              
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  title="ลบไฟล์"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {(uploadedFile || displayImage) && (
                <div className="mt-2 text-sm text-gray-600">
                  {uploadedFile ? (
                    <>
                      <p className="font-medium">
                        {isPdfFile(uploadedFile) ? '📄' : '📎'} {uploadedFile.name}
                      </p>
                  <p className="text-gray-400">
                    ขนาด: {(uploadedFile.size / 1024).toFixed(2)} KB
                        {isPdfFile(uploadedFile) && (
                          <span className="ml-2 text-blue-600">📄 PDF</span>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">
                        {isExistingPdf ? '📄' : '📎'} ไฟล์ที่มีอยู่
                      </p>
                      <p className="text-gray-400">
                        {isExistingPdf ? '📄 PDF File' : 'รูปภาพ'}
                        <a 
                          href={displayImage || ''} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          เปิดในแท็บใหม่
                        </a>
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            อัปโหลดตัวอย่างใบรับรองเพื่อให้นิสิตเห็นว่าต้องอัปโหลดแบบไหน
            {uploadedFile && isPdfFile(uploadedFile) && (
              <span className="block mt-1 text-blue-600">
                💡 ไฟล์ PDF จะถูกส่งไป Backend เพื่อทำ OCR และดึง natural_text
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;