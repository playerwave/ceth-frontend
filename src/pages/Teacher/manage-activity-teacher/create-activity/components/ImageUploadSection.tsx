// components/AdminActivityForm/ImageUploadSection.tsx
import { ImagePlus, Edit3 } from "lucide-react";

interface Props {
  previewImage: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hasExistingImage?: boolean; // ✅ เพิ่ม prop สำหรับตรวจสอบว่ามีรูปภาพอยู่แล้วหรือไม่
}

const ImageUploadSection: React.FC<Props> = ({
  previewImage,
  handleFileChange,
  disabled = false,
  hasExistingImage = false, // ✅ เพิ่ม prop
}) => {
  return (
    <div className="mt-10">
      <label className="font-semibold">แนบไฟล์ :</label>
      
      {/* ✅ แสดงปุ่มที่เหมาะสมตามสถานะ */}
      <div className="flex items-center gap-4 ml-4">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={disabled}
          className="w-118 p-2 border rounded border-[#9D9D9D]"
          accept="image/*" // ✅ รับเฉพาะไฟล์รูปภาพ
        />
        
        {/* ✅ แสดงข้อความสถานะ */}
        {hasExistingImage && (
          <div className="flex items-center gap-2 text-blue-600">
            <Edit3 size={16} />
            <span className="text-sm font-medium">แก้ไขรูปภาพ</span>
          </div>
        )}
      </div>

      {/* ✅ แสดงภาพ preview ถ้ามี */}
      {previewImage ? (
        <div className="mt-4 w-200 h-125">
          <p className="text-sm text-gray-500 mb-2">
            {hasExistingImage ? "รูปภาพกิจกรรมปัจจุบัน:" : "รูปภาพกิจกรรม:"}
          </p>
          <img
            src={previewImage}
            alt="รูปภาพกิจกรรม"
            className="w-200 h-125 object-cover border rounded-lg shadow"
          />
          <p className="text-xs text-gray-400 mt-2">
            {hasExistingImage 
              ? "คลิกเลือกไฟล์ใหม่เพื่อเปลี่ยนรูปภาพ หรือปล่อยว่างเพื่อใช้รูปภาพเดิม" 
              : "คลิกเลือกไฟล์ใหม่เพื่อเปลี่ยนรูปภาพ"
            }
          </p>
        </div>
      ) : (
        <div className="w-200 h-125 mt-5 max-w-3xl bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center cursor-default transition pointer-events-none">
          <div className="text-center text-black-400">
            <ImagePlus size={48} className="mx-auto" />
            <p className="text-sm mt-2">
              {hasExistingImage ? "ไม่มีรูปภาพใหม่ที่เลือก" : "อัปโหลดรูปภาพ"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
