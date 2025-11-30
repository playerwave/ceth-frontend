import { useState, useMemo, useEffect, useRef } from "react";
import CustomCard from "@/components/Card";
import { Check, ChevronLeft, Award, Clock, Link, Upload, FileText } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UploadCertificate from "./components/uploadCertificate";
import OcrResult from "./components/ocrResult";
import Button from "@/components/Button";
import { useCertificateStore } from "@/stores/Student/certificate.store.student";
import { useActivityStore } from "@/stores/Student/activity.store.student";
import { useAuthStore } from "@/stores/Visitor/auth.store";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Alert
} from "@mui/material";
import { AvailableCourseActivity } from "@/stores/api/activity.api";
import { 
  quickValidateCertificateLink, 
  CertificateLinkData 
} from "./utils/certificateLinkValidator";

function makeFileSig(f: File | null) {
  return f ? `${f.name}:${f.size}:${f.lastModified}` : null;
}

export default function SendCertificateStudent() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const location = useLocation();
  
  // ✅ รับ activity_id จาก URL parameter หรือ location.state
  const activityIdFromUrl = paramId ? parseInt(paramId, 10) : null;
  const activityFromState = (location.state as any)?.activity;
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<{ score: string; score_float: number; [key: string]: unknown } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<AvailableCourseActivity | null>(null);
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false);
  const [hoursData, setHoursData] = useState<{
    type: 'Soft' | 'Hard';
    hours: number;
  } | null>(null);
  
  // ✅ ใช้ useRef เพื่อเก็บ state ของ dialog เพื่อป้องกันการ reset เมื่อ component re-render
  const hoursDialogOpenRef = useRef(false);
  const hoursDataRef = useRef<{ type: 'Soft' | 'Hard'; hours: number } | null>(null);

  // ✅ เพิ่ม state สำหรับการส่งลิ้งก์
  const [submissionType, setSubmissionType] = useState<'file' | 'link'>('file');
  const [certificateLink, setCertificateLink] = useState<string>('');
  const [linkError, setLinkError] = useState<string>('');
  const [linkValidationResult, setLinkValidationResult] = useState<CertificateLinkData | null>(null);
  const [isValidatingLink, setIsValidatingLink] = useState<boolean>(false);

  const [disabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ ใช้ Certificate Store
  const { 
    uploadCertificate, 
    certificateLoading, 
    certificateError 
  } = useCertificateStore();

  // ✅ ใช้ Activity Store
  const { 
    availableCourseActivities, 
    fetchAvailableCourseActivities, 
    activityLoading,
    fetchEndedActivities
  } = useActivityStore();

  // ✅ ใช้ Auth Store
  const { user, fetchMe } = useAuthStore();

  // เก็บ “ไฟล์ที่ส่งล่าสุด” เป็น signature
  const [lastSubmittedSig, setLastSubmittedSig] = useState<string | null>(null);

  // ลายเซ็นของไฟล์ปัจจุบัน
  const currentSig = useMemo(() => makeFileSig(file), [file]);

  // ถือว่า "ส่งแล้ว" เฉพาะกรณีเป็นไฟล์เดียวกับที่เพิ่งส่งสำเร็จ
  const submittedForCurrentFile = !!currentSig && currentSig === lastSubmittedSig;

  // ✅ โหลดกิจกรรม Course ที่พร้อมใช้งาน
  useEffect(() => {
    fetchAvailableCourseActivities();
  }, [fetchAvailableCourseActivities]);

  // ✅ Auto-select activity จาก URL parameter หรือ location.state
  useEffect(() => {
    if (availableCourseActivities.length > 0) {
      // ถ้ามี activity จาก state ให้ใช้ก่อน
      if (activityFromState) {
        const matchedActivity = availableCourseActivities.find(
          a => a.activity_id === activityFromState.activity_id
        );
        if (matchedActivity) {
          setSelectedActivity(matchedActivity);
          return;
        }
      }
      
      // ถ้ามี activityId จาก URL ให้ค้นหาและเลือก
      if (activityIdFromUrl) {
        const matchedActivity = availableCourseActivities.find(
          a => a.activity_id === activityIdFromUrl
        );
        if (matchedActivity) {
          setSelectedActivity(matchedActivity);
        }
      }
    }
  }, [availableCourseActivities, activityIdFromUrl, activityFromState]);
  
  // ✅ Restore dialog state จาก sessionStorage เมื่อ component mount
  useEffect(() => {
    try {
      const savedDialogState = sessionStorage.getItem('certificate_hours_dialog');
      if (savedDialogState) {
        const parsed = JSON.parse(savedDialogState);
        if (parsed.open && parsed.data) {
          console.log("🔄 [Certificate] Restoring dialog state from sessionStorage:", parsed);
          hoursDialogOpenRef.current = true;
          hoursDataRef.current = parsed.data;
          setHoursDialogOpen(true);
          setHoursData(parsed.data);
        }
      }
    } catch (storageError) {
      console.warn("⚠️ [Certificate] Failed to restore dialog state from sessionStorage:", storageError);
    }
  }, []); // ✅ Run only once on mount
  
  // ✅ ใช้ useEffect เพื่อ restore dialog state เมื่อ component re-render
  useEffect(() => {
    if (hoursDialogOpenRef.current && hoursDataRef.current && !hoursDialogOpen) {
      console.log("🔄 [Certificate] Restoring dialog state after re-render");
      setHoursDialogOpen(true);
      setHoursData(hoursDataRef.current);
    }
  }, [hoursDialogOpen, user, availableCourseActivities]);

  // ✅ ฟังก์ชันจัดการการเลือกกิจกรรม
  const handleActivityChange = (event: any) => {
    const activityId = event.target.value as number;
    const activity = availableCourseActivities.find(a => a.activity_id === activityId);
    setSelectedActivity(activity || null);
  };

  // ✅ ฟังก์ชันจัดการการเปลี่ยนประเภทการส่ง
  const handleSubmissionTypeChange = (_event: React.MouseEvent<HTMLElement>, newType: 'file' | 'link' | null) => {
    if (newType !== null) {
      setSubmissionType(newType);
      // ✅ รีเซ็ตข้อมูลเมื่อเปลี่ยนประเภท
      setFile(null);
      setPreviewImage(null);
      setCertificateLink('');
      setLinkError('');
      setLinkValidationResult(null);
      setIsValidatingLink(false);
      setOcrResult(null); // ✅ รีเซ็ต OCR result
      setLastSubmittedSig(null);
    }
  };

  // ✅ ฟังก์ชันตรวจสอบลิ้งก์
  const validateLink = (link: string): boolean => {
    try {
      const url = new URL(link);
      // ✅ ตรวจสอบว่าเป็นลิ้งก์ที่ถูกต้อง
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        setLinkError('');
        return true;
      }
    } catch {
      setLinkError('กรุณาใส่ลิ้งก์ที่ถูกต้อง');
      return false;
    }
    setLinkError('กรุณาใส่ลิ้งก์ที่ถูกต้อง');
    return false;
  };

  // ✅ ฟังก์ชันจัดการการเปลี่ยนลิ้งก์
  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const link = event.target.value;
    setCertificateLink(link);
    setLinkValidationResult(null);
    setOcrResult(null); // ✅ รีเซ็ต OCR result เมื่อเปลี่ยนลิ้งก์
    
    if (link) {
      validateLink(link);
      // ✅ ตรวจสอบลิ้งก์แบบอัตโนมัติ
      validateCertificateLinkAsync(link);
    } else {
      setLinkError('');
    }
  };

  // ✅ ฟังก์ชันตรวจสอบลิ้งก์ใบรับรองแบบ async
  const validateCertificateLinkAsync = async (link: string) => {
    if (!link || !validateLink(link)) return;
    
    setIsValidatingLink(true);
    setLinkError('');
    
    try {
      console.log("🔍 [CertificateLinkValidator] Starting link validation...");
      
      // ✅ ใช้ quick validation ก่อน (ไม่ต้องเปรียบเทียบชื่อ)
      const result = await quickValidateCertificateLink(link);
      
      if (result.success && result.data) {
        setLinkValidationResult(result.data);
        console.log("✅ [CertificateLinkValidator] Link validation successful:", result.data);
      } else {
        setLinkError(result.error || 'ไม่สามารถตรวจสอบลิ้งก์ได้');
        console.error("❌ [CertificateLinkValidator] Link validation failed:", result.error);
      }
    } catch (error) {
      console.error("❌ [CertificateLinkValidator] Validation error:", error);
      setLinkError('เกิดข้อผิดพลาดในการตรวจสอบลิ้งก์');
    } finally {
      setIsValidatingLink(false);
    }
  };

  async function handleSendToOcr() {
    if (submissionType === 'file' && !file) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }
    if (submissionType === 'link' && !certificateLink) {
      alert("กรุณาใส่ลิ้งก์ใบรับรองก่อน");
      return;
    }
    if (submissionType === 'link' && !validateLink(certificateLink)) {
      alert("กรุณาใส่ลิ้งก์ที่ถูกต้อง");
      return;
    }
    if (!selectedActivity) {
      alert("กรุณาเลือกกิจกรรมก่อน");
      return;
    }
    if (loading || certificateLoading) return;

    setLoading(true);
    try {
      // ✅ ใช้ store แทน direct API call พร้อม activityId
      let result;
      if (submissionType === 'file' && file) {
        result = await uploadCertificate(file, selectedActivity.activity_id);
      } else if (submissionType === 'link' && certificateLink && linkValidationResult?.isValid) {
        // ✅ สำหรับลิ้งก์ ส่งไป Backend เพื่อตรวจสอบกับ certificate_base และเพิ่มชั่วโมง
        console.log("🔗 [CertificateLinkValidator] Sending link data to backend for verification:", linkValidationResult);
        
        // ✅ สร้างข้อมูลสำหรับส่งไป Backend (ไม่ใช้ certificate_id)
        const linkData = {
          fullName: linkValidationResult.studentName,
          courseName: linkValidationResult.courseName,
          teacher: "-", // ไม่มีข้อมูลจากลิ้งก์
          certificateId: null, // ✅ ไม่ใช้ certificate_id
          date: linkValidationResult.completionDate,
          rawText: `Certificate Link: ${certificateLink}`,
          certificateType: 'BUU_MOOC',
          organize_name: "สำนักคอมพิวเตอร์ มหาวิทยาลัยบูรพา",
          confidenceScore: 100,
          // ✅ เพิ่มข้อมูลสำหรับแสดงผลการตรวจสอบลิ้งก์
          isLinkValidation: true,
          linkValidationData: {
            studentName: linkValidationResult.studentName,
            courseName: linkValidationResult.courseName,
            completionDate: linkValidationResult.completionDate,
            certificateId: linkValidationResult.certificateId, // ✅ เก็บไว้สำหรับแสดงผลเท่านั้น
            isValid: linkValidationResult.isValid
          }
        };
        
        // ✅ ส่งไป Backend ผ่าน uploadCertificate (ใช้ file = null สำหรับลิ้งก์)
        // ✅ ส่ง studentId แทน userId
        const studentId = user?.student?.students_id;
        if (!studentId) {
          alert("ไม่พบข้อมูลนิสิต");
          setLoading(false);
          return;
        }
        
        result = await uploadCertificate(null, selectedActivity.activity_id, linkData, studentId);
      } else {
        alert("กรุณาตรวจสอบลิ้งก์ให้ถูกต้องก่อนส่ง");
        setLoading(false);
        return;
      }
      console.log("🔍 OCR Result from API:", result);
      console.log("🔍 OCR Result keys:", Object.keys(result));
      console.log("🔍 OCR Result structure:", JSON.stringify(result, null, 2));
      
      // ✅ ตรวจสอบว่า certificate ถูก reject หรือไม่ (confidence score < 60)
      if ((result as any).success === false && (result as any).data?.rejected === true) {
        console.log("❌ [Certificate] Certificate rejected (confidence score < 60%)");
        const responseData = (result as any).data;
        const nameVerification = responseData?.nameVerification;
        const verificationResult = responseData?.verificationResult;
        const ocrResult = responseData?.ocrResult;
        
        // ✅ แสดงผลการ reject
        const ocrData = {
          fullName: ocrResult?.fullName || "-",
          courseName: ocrResult?.courseName || "-",
          teacher: ocrResult?.teacher || "-",
          certificateId: ocrResult?.certificateId || "-",
          date: ocrResult?.date || "-",
          score: verificationResult?.confidenceScore?.toString() || "0",
          score_float: verificationResult?.confidenceScore || 0,
          rawText: ocrResult?.rawText || "",
          certificateType: responseData?.certificateType || "",
          organize_name: verificationResult?.organize_name || "",
          confidenceScore: verificationResult?.confidenceScore || 0,
          verified: false,
          rejected: true, // ✅ ระบุว่า certificate ถูก reject
          warning: false,
          nameVerification: {
            isValid: nameVerification?.isValid ?? false,
            certificateName: nameVerification?.certificateName || ocrResult?.fullName || "-",
            studentName: nameVerification?.studentName || ""
          },
          isLinkValidation: false,
          rejectionMessage: (result as any).message || "ใบรับรองไม่ผ่านเกณฑ์การตรวจสอบ"
        } as any;
        
        setOcrResult(ocrData);
        setLoading(false);
        return; // ✅ หยุดการประมวลผลต่อ
      }
      
      // ✅ ใช้ข้อมูลที่ backend process แล้ว (ตอนนี้เป็น CertificateVerificationResult)
      const certificateType = (result as any).certificateType || (result as any).ocrData?.certificateType || 'UNKNOWN';
      console.log("🔍 Certificate Type:", certificateType);
      
      // ✅ ใช้ข้อมูลจาก response ใหม่
      const responseData = (result as any).data;
      const nameVerification = responseData?.nameVerification;
      const verificationResult = responseData?.verificationResult;
      const ocrResult = responseData?.ocrResult;
      
      // ✅ ตรวจสอบ hours ที่ได้รับ (จาก top level ของ response)
      const hoursAdded = (result as any).hoursAdded;
      console.log("🔍 [Certificate] Full result structure:", {
        success: (result as any).success,
        hoursAdded: hoursAdded,
        hoursAddedType: typeof hoursAdded,
        hoursAddedKeys: hoursAdded ? Object.keys(hoursAdded) : null,
        responseData: responseData ? Object.keys(responseData) : null
      });
      console.log("🔍 [Certificate] Hours Added:", hoursAdded);
      console.log("🔍 [Certificate] Response Data:", responseData);
      console.log("🔍 [Certificate] OCR Result:", ocrResult);
      console.log("🔍 [Certificate] Name Verification:", nameVerification);
      console.log("🔍 [Certificate] Verification Result:", verificationResult);
      console.log("🔍 [Certificate] Passed Verification:", responseData?.passedVerification);
      
      const ocrData = {
        fullName: ocrResult?.fullName || "-",
        courseName: ocrResult?.courseName || "-", 
        teacher: ocrResult?.teacher || "-",
        certificateId: ocrResult?.certificateId || "-",
        date: ocrResult?.date || "-",
        score: verificationResult?.confidenceScore?.toString() || "0",
        score_float: verificationResult?.confidenceScore || 0,
        rawText: ocrResult?.rawText || "",
        certificateType: responseData?.certificateType || "",
        organize_name: verificationResult?.organize_name || "",
        confidenceScore: verificationResult?.confidenceScore || 0,
        hoursAdded: hoursAdded,
        verified: responseData?.passedVerification ?? true,
        warning: false,
        // ✅ เพิ่มข้อมูลการตรวจสอบชื่อ
        nameVerification: {
          isValid: nameVerification?.isValid ?? true,
          certificateName: nameVerification?.certificateName || ocrResult?.fullName || "-",
          studentName: nameVerification?.studentName || ocrResult?.fullName || "-"
        },
        // ✅ สำหรับไฟล์ PDF/รูปภาพ ไม่ใช่ link validation
        isLinkValidation: false
      } as any;
      
      console.log("🔍 [Certificate] Processed OCR Data:", ocrData);
      console.log("🔍 [Certificate] Missing fields check:", {
        fullName: ocrData.fullName === "-",
        courseName: ocrData.courseName === "-",
        teacher: ocrData.teacher === "-",
        certificateId: ocrData.certificateId === "-",
        date: ocrData.date === "-"
      });
      
      // ✅ ตั้งค่า OCR result ก่อน (เพื่อให้แสดงผลลัพธ์ทันที)
      setOcrResult(ocrData);
      setLastSubmittedSig(makeFileSig(file)); // ทำเครื่องหมายว่าไฟล์นี้ "ส่งแล้ว"
      
      // ✅ ตรวจสอบ hoursAdded และแสดง dialog
      console.log("🔍 [Certificate] Checking hoursAdded for dialog:", {
        hoursAdded: hoursAdded,
        hasType: hoursAdded?.type,
        hasHours: hoursAdded?.hours,
        hoursValue: hoursAdded?.hours,
        typeValue: hoursAdded?.type,
        condition: hoursAdded && hoursAdded.type && hoursAdded.hours
      });
      
      if (hoursAdded && hoursAdded.type && hoursAdded.hours > 0) {
        console.log("🎉 [Certificate] Hours added detected, opening dialog:", hoursAdded);
        
        // ✅ เก็บ state ใน ref และ sessionStorage เพื่อป้องกันการ reset
        const dialogData = {
          type: hoursAdded.type as 'Soft' | 'Hard',
          hours: hoursAdded.hours
        };
        hoursDataRef.current = dialogData;
        hoursDialogOpenRef.current = true;
        
        // ✅ เก็บ state ใน sessionStorage เพื่อให้ restore ได้หลัง refresh
        try {
          sessionStorage.setItem('certificate_hours_dialog', JSON.stringify({
            open: true,
            data: dialogData
          }));
          console.log("💾 [Certificate] Dialog state saved to sessionStorage");
        } catch (storageError) {
          console.warn("⚠️ [Certificate] Failed to save dialog state to sessionStorage:", storageError);
        }
        
        // ✅ ตั้งค่า state
        setHoursData(dialogData);
        setHoursDialogOpen(true);
        console.log("✅ [Certificate] Dialog state set:", {
          hoursDialogOpen: true,
          hoursData: dialogData
        });
        
        // ✅ ไม่ refresh ทันที แต่จะ refresh หลังจากปิด dialog
        // ✅ ตั้ง flag เพื่อบอกว่าต้อง refresh หลังจากปิด dialog
        try {
          sessionStorage.setItem('certificate_needs_refresh', 'true');
        } catch (storageError) {
          console.warn("⚠️ [Certificate] Failed to save refresh flag:", storageError);
        }
      } else if (submissionType === 'link' && responseData?.passedVerification) {
        // ✅ สำหรับลิ้งก์ที่สำเร็จ แสดง dialog เพิ่มชั่วโมง
        console.log("🎉 Link validation successful, showing hours dialog");
        
        // ✅ ใช้ชั่วโมงจาก Backend response หรือ activity ที่เลือก
        const activityData = responseData?.activityData;
        const activityHours = activityData?.receive_hours || selectedActivity?.recieve_hours || 0;
        const activityType = activityData?.activity_type || selectedActivity?.type || 'Soft';
        
        console.log("🔍 Response Data:", responseData);
        console.log("🔍 Activity data from backend:", activityData);
        console.log("🔍 Selected Activity:", selectedActivity);
        console.log("🔍 Selected Activity receive_hours:", selectedActivity?.recieve_hours);
        console.log("🔍 Selected Activity activity_type:", selectedActivity?.type);
        console.log("🔍 Final activity hours:", activityHours);
        console.log("🔍 Final activity type:", activityType);
        
        const dialogData = {
          type: activityType as 'Soft' | 'Hard',
          hours: activityHours
        };
        
        // ✅ เก็บ state ใน ref และ sessionStorage
        hoursDataRef.current = dialogData;
        hoursDialogOpenRef.current = true;
        
        try {
          sessionStorage.setItem('certificate_hours_dialog', JSON.stringify({
            open: true,
            data: dialogData
          }));
          sessionStorage.setItem('certificate_needs_refresh', 'true');
          console.log("💾 [Certificate] Dialog state saved to sessionStorage");
        } catch (storageError) {
          console.warn("⚠️ [Certificate] Failed to save dialog state:", storageError);
        }
        
        setHoursData(dialogData);
        setHoursDialogOpen(true);
        
        // ✅ ไม่ refresh ทันที แต่จะ refresh หลังจากปิด dialog
      }
    } catch (error: any) {
      console.error("❌ Error uploading certificate:", error);
      const errorMessage = error?.response?.data?.error || error?.message || certificateError || "ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง";
      alert("เกิดข้อผิดพลาดในการอัปโหลด: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ml-5 md:ml-25 mr-5">
      <CustomCard className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start">
        <div className="flex items-center justify-center relative mb-10 mt-10">
          {/* <button
            className="absolute left-0 items-center cursor-pointer text-black hover:text-[#1E3A8A] transition-colors duration-200 hidden sm:flex"
            onClick={() => navigate("/list-certificate-student")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> กลับ
          </button> */}
          <Button
            onClick={() => navigate("/list-certificate-student")}
            className="absolute left-0 items-center cursor-pointer text-black hover:text-[#1E3A8A] transition-colors duration-200 hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> กลับ
          </Button>
          <h2 className="font-bold text-2xl leading-snug">
            {submissionType === 'file' ? 'อัปโหลด Certificate' : 'ส่งลิ้งก์ Certificate'}
          </h2>
        </div>

        {/* ✅ เลือกประเภทการส่ง */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            เลือกวิธีการส่งใบรับรอง
          </Typography>
          <ToggleButtonGroup
            value={submissionType}
            exclusive
            onChange={handleSubmissionTypeChange}
            aria-label="submission type"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="file" aria-label="upload file">
              <Upload className="w-4 h-4 mr-2" />
              อัปโหลดไฟล์
            </ToggleButton>
            <ToggleButton value="link" aria-label="submit link">
              <Link className="w-4 h-4 mr-2" />
              ส่งลิ้งก์
            </ToggleButton>
          </ToggleButtonGroup>
          
          {submissionType === 'link' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>สำหรับ BUU MOOC:</strong> คุณสามารถส่งลิ้งก์ใบรับรองได้ 
                โดยระบบจะดาวน์โหลดและตรวจสอบใบรับรองจากลิ้งก์ที่คุณให้มา
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                <strong>หมายเหตุ:</strong> ระบบใช้ Backend API สำหรับดึงข้อมูล 
                ไม่มีปัญหา CORS และทำงานได้เสถียรกว่า
              </Typography>
            </Alert>
          )}
        </Box>

        <FormControl sx={{ m: 1, minWidth: 300 }}>
          <InputLabel id="activity-select-label">เลือกกิจกรรม</InputLabel>
          <Select
            labelId="activity-select-label"
            id="activity-select"
            value={selectedActivity?.activity_id || ""}
            label="เลือกกิจกรรม"
            onChange={handleActivityChange}
            disabled={activityLoading}
          >
            <MenuItem value="">
              <em>กรุณาเลือกกิจกรรม</em>
            </MenuItem>
            {availableCourseActivities.map((activity) => (
              <MenuItem key={activity.activity_id} value={activity.activity_id}>
                {activity.activity_name} - {activity.presenter_company_name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {selectedActivity 
              ? `เลือกกิจกรรม Course ที่กำลังดำเนินการ`
              : `กรุณาเลือกกิจกรรมที่ต้องการส่งใบรับรอง`
            }
          </FormHelperText>
          
          {/* ✅ แสดง template_description เมื่อเลือกกิจกรรม */}
          {selectedActivity?.template_description && (
            <Box 
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: '#f5f5f5', 
                borderRadius: 1,
                border: '1px solid #e0e0e0'
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>คำแนะนำการส่งใบรับรอง:</strong>
              </Typography>
              <Typography variant="body2" color="text.primary">
                {selectedActivity.template_description}
              </Typography>
            </Box>
          )}
        </FormControl>

        {/* ✅ แสดง UI ตามประเภทการส่ง */}
        {submissionType === 'file' ? (
          <UploadCertificate
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            setFile={setFile}
            file={file}
            disabled={disabled}
          />
        ) : (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              <FileText className="w-5 h-5 inline mr-2" />
              ส่งลิ้งก์ใบรับรอง
            </Typography>
            
            <TextField
              fullWidth
              label="ลิ้งก์ใบรับรอง"
              placeholder="https://mooc.buu.ac.th/certificates/..."
              value={certificateLink}
              onChange={handleLinkChange}
              error={!!linkError}
              helperText={linkError || "กรุณาใส่ลิ้งก์ใบรับรองที่ถูกต้อง"}
              disabled={disabled}
              sx={{ mb: 2 }}
            />
      

            {/* ✅ แสดงสถานะการตรวจสอบลิ้งก์ */}
            {isValidatingLink && (
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: '#fef3c7', 
                  borderRadius: 1,
                  border: '1px solid #f59e0b',
                  mb: 2
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  🔍 กำลังตรวจสอบลิ้งก์...
                </Typography>
              </Box>
            )}

            {linkValidationResult && (
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: linkValidationResult.isValid ? '#f0fdf4' : '#fef2f2', 
                  borderRadius: 1,
                  border: `1px solid ${linkValidationResult.isValid ? '#22c55e' : '#ef4444'}`,
                  mb: 2
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>สถานะการตรวจสอบลิ้งก์:</strong>
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={linkValidationResult.isValid ? "✅ พร้อมส่ง" : "❌ ข้อมูลไม่ถูกต้อง"}
                    color={linkValidationResult.isValid ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}

        <div className="flex justify-end mt-4 gap-3">
          <Button
            onClick={handleSendToOcr}
            disabled={
              loading || 
              certificateLoading || 
              submittedForCurrentFile || 
              !selectedActivity ||
              (submissionType === 'file' && !file) ||
              (submissionType === 'link' && (!certificateLink || !!linkError || !linkValidationResult?.isValid))
            }
            bgColor={submittedForCurrentFile ? "#22C55E" : undefined}
            textColor="#FFFFFF"
            className={`${
              loading || 
              certificateLoading || 
              submittedForCurrentFile || 
              !selectedActivity ||
              (submissionType === 'file' && !file) ||
              (submissionType === 'link' && (!certificateLink || !!linkError || !linkValidationResult?.isValid))
                ? "cursor-not-allowed" 
                : "hover:bg-blue-700"
            } mt-4 flex items-center gap-2`}
          >
            {loading || certificateLoading
              ? "กำลังตรวจสอบ..."
              : submittedForCurrentFile
              ? (<><Check className="w-4 h-4" /> ส่งแล้ว</>)
              : !selectedActivity
              ? "กรุณาเลือกกิจกรรม"
              : submissionType === 'file' && !file
              ? "กรุณาเลือกไฟล์"
              : submissionType === 'link' && !certificateLink
              ? "กรุณาใส่ลิ้งก์"
              : submissionType === 'link' && linkError
              ? "ลิ้งก์ไม่ถูกต้อง"
              : submissionType === 'link' && !linkValidationResult?.isValid
              ? "กรุณารอการตรวจสอบลิ้งก์"
              : submissionType === 'file'
              ? "ส่งตรวจ OCR"
              : "ส่งตรวจลิ้งก์"}
          </Button>

          {/* (ทางเลือก) ปุ่มล้างค่า เพื่ออัปโหลด/ส่งไฟล์อื่นเร็ว ๆ */}
          {/* <Button
            onClick={() => {
              setFile(null);
              setPreviewImage(null);
              setOcrResult(null);
              // ไม่ต้องยุ่ง lastSubmittedSig — ให้คงไว้สำหรับไฟล์เดิม
            }}
            className="mt-4"
          >
            ส่งเกียรติบัตรอื่นๆ
          </Button> */}
        </div>
      </CustomCard>

      <br />

      <CustomCard className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start mb-10">
        <h2 className="font-bold text-2xl leading-snug">ผลลัพธ์</h2>
        <br />
        {/* ✅ แสดงผล OCR result (สำหรับทั้ง file และ link) */}
        <OcrResult result={ocrResult} />
      </CustomCard>

      {/* ✅ Dialog แสดงผลการได้รับ Hours */}
      <Dialog 
        open={hoursDialogOpen} 
        onClose={async () => {
          console.log("🔒 [Certificate] Closing hours dialog");
          hoursDialogOpenRef.current = false;
          hoursDataRef.current = null;
          setHoursDialogOpen(false);
          setHoursData(null);
          
          // ✅ ลบ state จาก sessionStorage
          try {
            sessionStorage.removeItem('certificate_hours_dialog');
          } catch (storageError) {
            console.warn("⚠️ [Certificate] Failed to remove dialog state from sessionStorage:", storageError);
          }
          
          // ✅ Refresh user data และ activity history หลังจากปิด dialog
          const needsRefresh = sessionStorage.getItem('certificate_needs_refresh') === 'true';
          if (needsRefresh) {
            try {
              console.log("🔄 [Certificate] Refreshing user data after dialog closed...");
              await fetchMe();
              console.log("✅ [Certificate] User data refreshed successfully");
              
              const studentId = user?.student?.students_id;
              if (studentId) {
                console.log("🔄 [Certificate] Refreshing activity history for student:", studentId);
                await fetchEndedActivities(studentId);
                console.log("✅ [Certificate] Activity history refreshed successfully");
              }
              
              // ✅ ลบ refresh flag
              sessionStorage.removeItem('certificate_needs_refresh');
            } catch (refreshError) {
              console.error("❌ [Certificate] Error refreshing data:", refreshError);
            }
          }
          
          // ✅ Navigate ไปที่หน้า list certificate
          console.log("🔀 [Certificate] Navigating to certificate list page");
          navigate("/list-certificate-student");
        }}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={false}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Award className="w-6 h-6 text-green-600" />
            <Typography variant="h6" component="div">
              🎉 ใบรับรองผ่านการตรวจสอบ!
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box textAlign="center" py={2}>
            <Typography variant="body1" gutterBottom>
              ระบบได้เพิ่มชั่วโมงอบรมให้คุณแล้ว
            </Typography>
            
            {hoursData && (
              <Box mt={3}>
                <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                  <Clock className="w-5 h-5 text-blue-600" />
                  <Typography variant="h4" color="primary">
                    {hoursData.hours} ชั่วโมง
                  </Typography>
                </Box>
                
                <Chip
                  label={hoursData.type === 'Soft' ? 'Soft Skills' : 'Hard Skills'}
                  color={hoursData.type === 'Soft' ? 'primary' : 'secondary'}
                  variant="filled"
                  size="medium"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={async () => {
              console.log("🔒 [Certificate] Closing hours dialog via button");
              hoursDialogOpenRef.current = false;
              hoursDataRef.current = null;
              setHoursDialogOpen(false);
              setHoursData(null);
              
              // ✅ ลบ state จาก sessionStorage
              try {
                sessionStorage.removeItem('certificate_hours_dialog');
              } catch (storageError) {
                console.warn("⚠️ [Certificate] Failed to remove dialog state from sessionStorage:", storageError);
              }
              
              // ✅ Refresh user data และ activity history หลังจากปิด dialog
              const needsRefresh = sessionStorage.getItem('certificate_needs_refresh') === 'true';
              if (needsRefresh) {
                try {
                  console.log("🔄 [Certificate] Refreshing user data after dialog closed...");
                  await fetchMe();
                  console.log("✅ [Certificate] User data refreshed successfully");
                  
                  const studentId = user?.student?.students_id;
                  if (studentId) {
                    console.log("🔄 [Certificate] Refreshing activity history for student:", studentId);
                    await fetchEndedActivities(studentId);
                    console.log("✅ [Certificate] Activity history refreshed successfully");
                  }
                  
                  // ✅ ลบ refresh flag
                  sessionStorage.removeItem('certificate_needs_refresh');
                } catch (refreshError) {
                  console.error("❌ [Certificate] Error refreshing data:", refreshError);
                }
              }
              
              // ✅ Navigate ไปที่หน้า list certificate
              console.log("🔀 [Certificate] Navigating to certificate list page");
              navigate("/list-certificate-student");
            }}
            bgColor="#22C55E"
            textColor="#FFFFFF"
            className="hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2 " />
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
