import { ChevronLeft, ImagePlus } from "lucide-react";
import CustomCard from "../../../../components/Card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const sendCertificateStudent = () => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [disabled] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // ถ้าเป็นภาพให้ preview; ถ้าเป็น PDF แสดงเป็น icon ก็ได้ (ที่นี่ preview เฉพาะภาพ)
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  }

  // ล้าง URL object ตอน unmount/เปลี่ยนไฟล์
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="ml-5 md:ml-25 mr-5">
      <CustomCard className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start">
        <div className="flex items-center justify-center relative mb-4">
          {/* ปุ่มกลับ ชิดซ้าย */}
          <button
            className="absolute left-0 items-center cursor-pointer text-black hover:text-[#1E3A8A] transition-colors duration-200 hidden sm:flex"
            onClick={() => navigate("/list-certificate-student")}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            กลับ
          </button>

          {/* หัวข้ออยู่ตรงกลาง */}
          <h2 className="font-bold text-2xl leading-snug">
            อัปโหลด Certificate
          </h2>
        </div>

        {/* แนบไฟล์ + Preview */}
        <div className="mt-10">
          <div className="mt-10">
            <label className="font-semibold">แนบไฟล์ :</label>
            <input
              id="fileUpload" // ✅ ใส่ id
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              disabled={disabled}
              className="ml-4 inline-block rounded border border-[#9D9D9D] px-3 py-2
                 w-[200px] sm:w-[300px] md:w-[400px]"
            />
          </div>

          {/* Preview */}
          <div className="flex justify-center mt-4">
            <div className="w-full max-w-[750px]">
              <div className="relative w-full aspect-[750/519] rounded-lg border bg-white shadow">
                {/* ✅ ทำให้ทั้งกรอบคลิกได้ด้วย label ผูกกับ input */}
                <label
                  htmlFor="fileUpload"
                  className={`absolute inset-0 rounded-lg flex items-center justify-center
                      ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
                      transition`}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="รูปภาพเกียรติบัตร"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImagePlus size={40} className="mx-auto" />
                      <p className="mt-2 text-sm">อัปโหลดเกียรติบัตร</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </CustomCard>
      <br />
      
       {/* ผลลัพธ์ OCR            */}
      <CustomCard className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start">
        <h2 className="font-bold text-2xl leading-snug">ผลลัพธ์ OCR</h2>
        <br />

        <div className="flex flex-col lg:flex-row ">
          {/* ซ้าย */}
          <div className="flex-1 p-0 lg:p-4">
            <div className="flex flex-col md:flex-row mb-2">
              <p className="font-bold w-36 lg:w-40 shrink-0">ชื่อ-นามสกุล:</p>
              <p className="flex-1 break-words">YanaKorn Bannhnuk</p>
            </div>

            <div className="flex flex-col md:flex-row mb-2">
              <p className="font-bold w-36 lg:w-40 shrink-0">ชื่อหลักสูตร:</p>
              <p className="flex-1 break-words">
                Data Visuallztion with tableaa Destop
              </p>
            </div>

            <div className="flex flex-col md:flex-row mb-2">
              <p className="font-bold w-36 lg:w-40 shrink-0">ชื่ออาจารย์:</p>
              <p className="flex-1 break-words">อุรีรัตน์ สุขสวัชน</p>
            </div>
          </div>

          {/* ขวา */}
          <div className="flex-1 p-0 lg:p-4">
            <div className="flex flex-col md:flex-row mb-2">
              <p className="font-bold w-36 lg:w-40 shrink-0">Certificate ID:</p>
              <p className="flex-1 break-words">
                97c5a568556149808Za0683da8d93
              </p>
            </div>

            <div className="flex flex-col md:flex-row mb-2">
              <p className="font-bold w-36 lg:w-40 shrink-0">
                Confidence Score:
              </p>
              <p className="flex-1">82.87 % ต่ำกว่าเกณฑ์</p>
            </div>

            <p className="text-red-600 font-bold mt-3">
              ไม่ผ่านเกณฑ์ ระบบจะทำการส่งให้อาจารย์ตรวจสอบยืนยัน
              กรุณารอผลลัพธ์การตรวจสอบ
            </p>
          </div>
        </div>
      </CustomCard>
    </div>
  );
};

export default sendCertificateStudent;
