import React from "react";
import { FormData } from "../Form/formdata"; 

{/* ช่องกรอกชื่อกิจกรรม  ช่องกรอกชื่อบริษัท/วิทยากร  ช่องกรอกคำอธิบาย */}
interface Props {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ActivityDetails: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div>
      <label className="block font-semibold w-50">ชื่อกิจกรรม *</label>
      <input type="text" name="activityName" value={formData.activityName} onChange={handleChange} className="w-2xl p-2 border rounded mb-4" required />
      
      <label className="block font-semibold">ชื่อบริษัท/วิทยากร *</label>
      <input type="text" name="companyOrSpeaker" value={formData.companyOrSpeaker} onChange={handleChange} className="w-2xl p-2 border rounded mb-4" required />

      <label className="block font-semibold">คำอธิบายกิจกรรม</label>
      <textarea name="description" value={formData.description} onChange={handleChange} className="w-2xl p-2 border rounded mb-4 h-70" required></textarea>
    </div>
  );
};

export default ActivityDetails;
