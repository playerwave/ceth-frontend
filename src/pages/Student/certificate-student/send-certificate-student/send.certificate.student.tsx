import { useState } from "react";
import CustomCard from "../../../../components/Card";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadCertificate from "./components/UploadCertificate";
import OcrResult from "./components/OcrResult";

export default function SendCertificateStudent() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [disabled] = useState(false);

  // mock OCR result
  const ocrResult = {
    fullName: "YanaKorn Bannhnuk",
    courseName: "Data Visuallztion with tableaa Destop",
    teacher: "อุรีรัตน์ สุขสวัชน",
    certificateId: "97c5a568556149808Za0683da8d93",
    score: "82.87 % ต่ำกว่าเกณฑ์",
  };

  return (
    <div className="ml-5 md:ml-25 mr-5">
      <CustomCard className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start">
        <div className="flex items-center justify-center relative mb-4">
          <button
            className="absolute left-0 items-center cursor-pointer text-black hover:text-[#1E3A8A] transition-colors duration-200 hidden sm:flex"
            onClick={() => navigate("/list-certificate-student")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            กลับ
          </button>
          <h2 className="font-bold text-2xl leading-snug">อัปโหลด Certificate</h2>
        </div>

        <UploadCertificate
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          disabled={disabled}
        />
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
