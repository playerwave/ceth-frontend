import { useState, useMemo, useEffect } from "react";
import CustomCard from "@/components/Card";
import { Check, ChevronLeft, Award, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  Chip
} from "@mui/material";
import { AvailableCourseActivity } from "@/stores/api/activity.api";

function makeFileSig(f: File | null) {
  return f ? `${f.name}:${f.size}:${f.lastModified}` : null;
}

export default function SendCertificateStudent() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<{ score: string; score_float: number; [key: string]: unknown } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<AvailableCourseActivity | null>(null);
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false);
  const [hoursData, setHoursData] = useState<{
    type: 'Soft' | 'Hard';
    hours: number;
  } | null>(null);

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
  const { user } = useAuthStore();

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

  // ✅ ฟังก์ชันจัดการการเลือกกิจกรรม
  const handleActivityChange = (event: any) => {
    const activityId = event.target.value as number;
    const activity = availableCourseActivities.find(a => a.activity_id === activityId);
    setSelectedActivity(activity || null);
  };

  async function handleSendToOcr() {
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อน");
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
      const result = await uploadCertificate(file, selectedActivity.activity_id);
      console.log("🔍 OCR Result from API:", result);
      console.log("🔍 OCR Result keys:", Object.keys(result));
      console.log("🔍 OCR Result structure:", JSON.stringify(result, null, 2));
      
      // ✅ ใช้ข้อมูลที่ backend process แล้ว (ตอนนี้เป็น CertificateVerificationResult)
      const certificateType = (result as any).certificateType || (result as any).ocrData?.certificateType || 'UNKNOWN';
      console.log("🔍 Certificate Type:", certificateType);
      
      // ✅ ตรวจสอบ hours ที่ได้รับ
      const hoursAdded = (result as any).hoursAdded;
      console.log("🔍 Hours Added:", hoursAdded);
      
      const ocrData = {
        fullName: result.ocrData.fullName || "-",
        courseName: result.ocrData.courseName || "-", 
        teacher: result.ocrData.teacher || "-",
        certificateId: result.ocrData.certificateId || "-",
        date: result.ocrData.date || "-",
        score: result.confidenceScore.toString(),
        score_float: result.confidenceScore,
        rawText: result.ocrData.rawText || "",
        certificateType: certificateType, // ✅ เพิ่ม certificate type
        organize_name: (result.ocrData as any).organize_name || "-", // ✅ เพิ่ม organize_name
        confidenceScore: result.confidenceScore, // ✅ เพิ่ม confidence score
        hoursAdded: hoursAdded, // ✅ เพิ่ม hours ที่ได้รับ
        verified: (result as any).verified ?? false, // ✅ เพิ่ม: ผ่านการตรวจสอบหรือไม่
        warning: (result as any).warning ?? false // ✅ เพิ่ม: เตือนถ้ามีข้อมูลไม่ครบ
      } as any;
      
      console.log("🔍 Processed OCR Data:", ocrData);
      console.log("🔍 Missing fields check:", {
        fullName: ocrData.fullName === "-",
        courseName: ocrData.courseName === "-",
        teacher: ocrData.teacher === "-",
        certificateId: ocrData.certificateId === "-",
        date: ocrData.date === "-"
      });
      setOcrResult(ocrData);
      setLastSubmittedSig(makeFileSig(file)); // ทำเครื่องหมายว่าไฟล์นี้ "ส่งแล้ว"
      
      // ✅ แสดง dialog ถ้าได้รับ hours
      if (hoursAdded && hoursAdded.type && hoursAdded.hours) {
        setHoursData(hoursAdded);
        setHoursDialogOpen(true);
        console.log("🎉 Hours added:", hoursAdded);
        
        // ✅ เพิ่ม: Refresh activity history หลังจาก claim certificate สำเร็จ
        try {
          const studentId = user?.student?.students_id; // ✅ ใช้ students_id แทน users_id
          if (studentId) {
            console.log("🔄 [Certificate] Refreshing activity history for student:", studentId);
            await fetchEndedActivities(studentId);
            console.log("✅ [Certificate] Activity history refreshed successfully");
          }
        } catch (refreshError) {
          console.error("❌ [Certificate] Error refreshing activity history:", refreshError);
        }
      }
    } catch (error) {
      console.error("❌ Error uploading certificate:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด: " + (certificateError || "ไม่ทราบสาเหตุ"));
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
          <h2 className="font-bold text-2xl leading-snug">อัปโหลด Certificate</h2>
        </div>

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

        <UploadCertificate
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          setFile={setFile}
          file={file}
          disabled={disabled}
        />

        <div className="flex justify-end mt-4 gap-3">
          <Button
            onClick={handleSendToOcr}
            disabled={loading || certificateLoading || submittedForCurrentFile || !selectedActivity}             // ✅ เพิ่มเงื่อนไข !selectedActivity
            bgColor={submittedForCurrentFile ? "#22C55E" : undefined} // ✅ ไฟล์ใหม่กลับเป็น default
            textColor="#FFFFFF"
            className={`${loading || certificateLoading || submittedForCurrentFile || !selectedActivity ? "cursor-not-allowed" : "hover:bg-blue-700"} mt-4 flex items-center gap-2`}
          >
            {loading || certificateLoading
              ? "กำลังตรวจสอบ..."
              : submittedForCurrentFile
              ? (<><Check className="w-4 h-4" /> ส่งแล้ว</>)
              : !selectedActivity
              ? "กรุณาเลือกกิจกรรม"
              : "ส่งตรวจ OCR"}
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
        <OcrResult result={ocrResult} />
      </CustomCard>

      {/* ✅ Dialog แสดงผลการได้รับ Hours */}
      <Dialog 
        open={hoursDialogOpen} 
        onClose={() => setHoursDialogOpen(false)}
        maxWidth="sm"
        fullWidth
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
            onClick={() => setHoursDialogOpen(false)}
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
