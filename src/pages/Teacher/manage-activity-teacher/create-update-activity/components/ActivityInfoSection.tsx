// components/AdminActivityForm/ActivityInfoSection.tsx
import { TextField, SelectChangeEvent } from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";
import { validateField, ValidationMode } from "../utils/form_utils";

interface Props {
  formData: CreateActivityForm;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
  disabled?: boolean;
  validationMode?: ValidationMode;
  originalActivityStatus?: string;
}

const ActivityInfoSection: React.FC<Props> = ({ 
  formData, 
  handleChange, 
  disabled = false, 
  validationMode = 'create',
  originalActivityStatus 
}) => {
  // ✅ ใช้ validateField function ใหม่
  const activityNameValidation = validateField('activity_name', formData, validationMode, originalActivityStatus);
  const presenterValidation = validateField('presenter_company_name', formData, validationMode, originalActivityStatus);

  return (
    <div className="flex flex-col space-y-6 w-140 ml-0">
      <div className="flex flex-col w-140">
        <label className="block font-semibold mb-1">ชื่อกิจกรรม *</label>
        <TextField
          name="activity_name"
          placeholder="ชื่อกิจกรรม"
          value={formData.activity_name}
          className="w-full"
          onChange={handleChange}
          disabled={disabled}
          error={activityNameValidation.hasError}
          helperText={activityNameValidation.helperText}
          sx={{ height: "56px" }}
        />
      </div>

      <div className="flex flex-col w-140 mt-2">
        <label className="block font-semibold mb-1">ชื่อบริษัท/วิทยากร *</label>
        <TextField
          name="presenter_company_name"
          placeholder="ชื่อบริษัท หรือ วิทยากร ที่มาอบรม"
          value={formData.presenter_company_name}
          className="w-full"
          onChange={handleChange}
          disabled={disabled}
          error={presenterValidation.hasError}
          helperText={presenterValidation.helperText}
          sx={{ height: "56px" }}
        />
      </div>
    </div>
  );
};

export default ActivityInfoSection;
