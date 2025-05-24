// components/AdminActivityForm/ImageUploadSection.tsx
import { ImagePlus } from "lucide-react";

interface Props {
  previewImage: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadSection: React.FC<Props> = ({ previewImage, handleFileChange }) => {
  return (
    <div className="mt-10">
      <label className="font-semibold">แนบไฟล์ :</label>
      <input
        type="file"
        onChange={handleFileChange}
        className="w-118 p-2 border rounded ml-4 border-[#9D9D9D]"
      />

      {/* แสดงภาพ preview ถ้ามี */}
      {previewImage ? (
        <div className="mt-4 w-200 h-125 border-red-900">
          <p className="text-sm text-gray-500">ตัวอย่างรูปที่อัปโหลด:</p>
          <img
            src={previewImage}
            alt="อัปโหลดภาพกิจกรรม"
            className="w-200 h-125 mt-2 object-cover border rounded-lg shadow"
          />
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
