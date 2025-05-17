import React from "react";
import { FormData } from "./formdata"; // ✅ นำเข้า Type ของ formData

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>; // ✅ เพิ่ม setFormData
}

const FileUpload: React.FC<Props> = ({ formData, setFormData }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  return (
    <div>
      <div>
        <label className=" font-semibold">แนบไฟล์ :</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-146 p-2 border rounded ml-4 "
        />
      </div>

      {/* แสดงภาพที่อัปโหลด (ถ้าเป็นรูป) */}
      {formData.file && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">ไฟล์ที่อัปโหลด: {formData.file.name}</p>
          {formData.file.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(formData.file)}
              alt="อัปโหลดภาพกิจกรรม"
              className="mt-2 w-100 h-100 object-cover border rounded-lg shadow"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
