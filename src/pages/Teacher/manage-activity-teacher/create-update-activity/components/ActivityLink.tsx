import React from "react";
import { TextField, SelectChangeEvent } from "@mui/material";
import { CreateActivityForm } from "../create.activity.teacher";
import { validateField, ValidationMode } from "../utils/form_utils";

interface Props {
  formData: CreateActivityForm;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
  disabled?: boolean;
  validationMode?: ValidationMode;
  originalActivityStatus?: string;
}

const ActivityLink: React.FC<Props> = ({ 
  formData, 
  handleChange, 
  disabled = false, 
  validationMode = 'create',
  originalActivityStatus 
}) => {
  // ✅ ใช้ validateField function ใหม่
  const urlValidation = validateField('url', formData, validationMode, originalActivityStatus);

  return (
    <div className="w-140 mb-2 mt-5">
      <label className="block font-semibold">ลิ้งกิจกรรม *</label>
      <TextField
        name="url"
        placeholder="กรอกลิ้งกิจกรรมที่นี่"
        value={formData.url || ""}
        onChange={handleChange}
        disabled={disabled}
        className="w-full"
        error={urlValidation.hasError}
        helperText={urlValidation.helperText}
        sx={{ height: "56px" }}
      />
    </div>
  );
};

export default ActivityLink;
