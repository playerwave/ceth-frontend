import { useState, useMemo } from "react";
import CustomCard from "../../../../components/Card";
import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadCertificate from "./components/uploadCertificate";
import OcrResult from "./components/ocrResult";
import Button from "../../../../components/Button";
import { useCertificateStore } from "../../../../stores/Student/certificate.store.student";

function makeFileSig(f: File | null) {
  return f ? `${f.name}:${f.size}:${f.lastModified}` : null;
}

export default function SendCertificateStudent() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<{ score: string; score_float: number; [key: string]: unknown } | null>(null);

  const [disabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ ใช้ Certificate Store
  const { 
    uploadCertificate, 
    certificateLoading, 
    certificateError 
  } = useCertificateStore();

  // เก็บ “ไฟล์ที่ส่งล่าสุด” เป็น signature
  const [lastSubmittedSig, setLastSubmittedSig] = useState<string | null>(null);

  // ลายเซ็นของไฟล์ปัจจุบัน
  const currentSig = useMemo(() => makeFileSig(file), [file]);

  // ถือว่า "ส่งแล้ว" เฉพาะกรณีเป็นไฟล์เดียวกับที่เพิ่งส่งสำเร็จ
  const submittedForCurrentFile = !!currentSig && currentSig === lastSubmittedSig;

  async function handleSendToOcr() {
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }
    if (loading || certificateLoading) return;

    setLoading(true);
    try {
      // ✅ ใช้ store แทน direct API call
      const result = await uploadCertificate(file);
      console.log("🔍 OCR Result from API:", result);
      console.log("🔍 OCR Result keys:", Object.keys(result));
      console.log("🔍 OCR Result structure:", JSON.stringify(result, null, 2));
      
      // ✅ ใช้ข้อมูลที่ backend process แล้ว
      const ocrData = {
        fullName: result.fullName || "-",
        courseName: result.courseName || "-", 
        teacher: result.teacher || "-",
        certificateId: result.certificateId || "-",
        date: result.date || "-",
        score: "-",
        score_float: 0,
        rawText: result.rawText || ""
      };
      
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
    } catch (error) {
      console.error("❌ Error uploading certificate:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด: " + (certificateError || "ไม่ทราบสาเหตุ"));
    } finally {
      setLoading(false);
    }
  }

  // (ถ้าอยากรีเซ็ตผลลัพธ์ด้วยเมื่อเลือกไฟล์ใหม่ ให้ปลดคอมเมนต์ 2 บรรทัดนี้)
  // useEffect(() => {
  //   setOcrResult(null);
  // }, [currentSig]);

  return (
    <div className="ml-5 md:ml-25 mr-5">
      <CustomCard className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start">
        <div className="flex items-center justify-center relative mb-4">
          <button
            className="absolute left-0 items-center cursor-pointer text-black hover:text-[#1E3A8A] transition-colors duration-200 hidden sm:flex"
            onClick={() => navigate("/list-certificate-student")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> กลับ
          </button>
          <h2 className="font-bold text-2xl leading-snug">อัปโหลด Certificate</h2>
        </div>

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
            disabled={loading || certificateLoading || submittedForCurrentFile}             // ✅ กันกดซ้ำเฉพาะไฟล์เดิม
            bgColor={submittedForCurrentFile ? "#22C55E" : undefined} // ✅ ไฟล์ใหม่กลับเป็น default
            textColor="#FFFFFF"
            className={`${loading || certificateLoading || submittedForCurrentFile ? "cursor-not-allowed" : "hover:bg-blue-700"} mt-4 flex items-center gap-2`}
          >
            {loading || certificateLoading
              ? "กำลังตรวจสอบ..."
              : submittedForCurrentFile
              ? (<><Check className="w-4 h-4" /> ส่งแล้ว</>)
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

      <CustomCard className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start">
        <h2 className="font-bold text-2xl leading-snug">ผลลัพธ์ OCR</h2>
        <br />
        <OcrResult result={ocrResult} />
      </CustomCard>
    </div>
  );
}
