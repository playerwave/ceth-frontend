import { useState, useMemo } from "react";
import CustomCard from "../../../../components/Card";
import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadCertificate from "./components/UploadCertificate";
import OcrResult from "./components/OcrResult";
import { callBuuOcr } from "./utils/ocrHelper";
import Button from "../../../../components/Button";

function makeFileSig(f: File | null) {
  return f ? `${f.name}:${f.size}:${f.lastModified}` : null;
}

export default function SendCertificateStudent() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const [disabled] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (loading) return;

    setLoading(true);
    try {
      const result = await callBuuOcr(file);
      setOcrResult({ ...result, score: "-", score_float: 0 });
      setLastSubmittedSig(makeFileSig(file)); // ทำเครื่องหมายว่าไฟล์นี้ "ส่งแล้ว"
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
            disabled={loading || submittedForCurrentFile}             // ✅ กันกดซ้ำเฉพาะไฟล์เดิม
            bgColor={submittedForCurrentFile ? "#22C55E" : undefined} // ✅ ไฟล์ใหม่กลับเป็น default
            textColor="#FFFFFF"
            className={`${loading || submittedForCurrentFile ? "cursor-not-allowed" : "hover:bg-blue-700"} mt-4 flex items-center gap-2`}
          >
            {loading
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
