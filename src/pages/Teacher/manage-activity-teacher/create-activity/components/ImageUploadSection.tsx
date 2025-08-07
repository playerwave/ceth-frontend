// components/AdminActivityForm/ImageUploadSection.tsx
import { ImagePlus } from "lucide-react";

interface Props {
  previewImage: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const ImageUploadSection: React.FC<Props> = ({
  previewImage,
  handleFileChange,
  disabled = false,
}) => {
  return (
    <div className="mt-10">
      <label className="font-semibold">แนบไฟล์ :</label>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        className="w-118 p-2 border rounded ml-4 border-[#9D9D9D]"
      />

      {/* แสดงภาพ preview ถ้ามี */}
      {previewImage ? (
        <div className="mt-4 w-200 h-125">
          <p className="text-sm text-gray-500 mb-2">รูปภาพกิจกรรม:</p>
          <img
            src={previewImage}
            alt="รูปภาพกิจกรรม"
            className="w-200 h-125 object-cover border rounded-lg shadow"
          />
          <p className="text-xs text-gray-400 mt-2">คลิกเลือกไฟล์ใหม่เพื่อเปลี่ยนรูปภาพ</p>
        </div>
      ) : (
        <div className="w-200 h-125 mt-5 max-w-3xl bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center cursor-default transition pointer-events-none">
          <div className="text-center text-black-400">
            <ImagePlus size={48} className="mx-auto" />
            <p className="text-sm mt-2">อัปโหลดรูปภาพ</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
