import { useState } from "react";
import CustomCard from "../../../../components/Card";
import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadCertificate from "./components/UploadCertificate";
import OcrResult from "./components/OcrResult";
import { callBuuOcr } from "./utils/ocrHelper";
import Button from "../../../../components/Button";

export default function SendCertificateStudent() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const [disabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // ✅ เพิ่ม

  async function handleSendToOcr() {
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }
    setLoading(true);

    try {
      const result = await callBuuOcr(file);
      setOcrResult({ ...result, score: "-", score_float: 0 });
      setSubmitted(true); // ✅ หลังเสร็จ 1 รอบ ห้ามกดซ้ำ
    } finally {
      setLoading(false);
    }
  }

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
          <h2 className="font-bold text-2xl leading-snug">
            อัปโหลด Certificate
          </h2>
        </div>

        <UploadCertificate
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          setFile={setFile}
          file={file}
          disabled={disabled}
        />

        <div className="flex justify-end mt-4">
          <Button
            onClick={() => {
              if (loading || submitted) return;
              handleSendToOcr();
            }}
            bgColor={submitted ? "#22C55E" : undefined} // ✅ เปลี่ยนเป็นสีเขียวเฉพาะตอน submitted
            textColor="#FFFFFF"
            className={`${loading || submitted ? "cursor-not-allowed" : "hover:bg-blue-700"} mt-4 flex items-center gap-2`}
          >
            {loading ? (
              "กำลังตรวจสอบ..."
            ) : submitted ? (
              <>
                <Check className="w-4 h-4" />
                ส่งแล้ว
              </>
            ) : (
              "ส่งตรวจ OCR"
            )}
          </Button>
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
