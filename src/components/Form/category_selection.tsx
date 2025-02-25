import React from "react";
 {/* ช่องกรอประเภท */}
interface Props {
  formData: {
    category: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategorySelection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div>
      <label className="block font-semibold w-50">ประเภท *</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-2xl p-2 border rounded mb-4"
      >
        <option value="Soft Skill">ชั่วโมงเตรียมความพร้อม (Soft Skill)</option>
        <option value="Technical">ชั่วโมงทักษะทางวิชาการ (Technical)</option>
        <option value="other">อื่นๆ </option>
      </select>
    </div>
  );
};

export default CategorySelection;
