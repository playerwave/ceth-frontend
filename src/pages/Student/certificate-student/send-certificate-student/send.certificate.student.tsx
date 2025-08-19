import { useState } from "react";
import CustomCard from "../../../../components/Card";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadCertificate from "./components/UploadCertificate";
import OcrResult from "./components/OcrResult";
import { callBuuOcr } from "./utils/ocrHelper";

export default function SendCertificateStudent() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const [disabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // function ส่งไฟล์ไป backend OCR
  async function handleSendToOcr() {
  if (!file) {
    alert("กรุณาเลือกไฟล์ก่อน");
    return;
  }

  setLoading(true);

  try {
    const result = await callBuuOcr(file);

    setOcrResult({
      ...result,
      score: "-",
      score_float: 0,
    });
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
          disabled={disabled}
        />

        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={handleSendToOcr}
          disabled={loading}
        >
          {loading ? "กำลังตรวจสอบ..." : "ส่งตรวจ OCR"}
        </button>
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
