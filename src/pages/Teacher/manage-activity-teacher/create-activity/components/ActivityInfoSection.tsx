// components/AdminActivityForm/ActivityInfoSection.tsx
import { TextField, SelectChangeEvent } from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";


interface Props {
  formData: CreateActivityForm;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
  disabled?: boolean;
}

const ActivityInfoSection: React.FC<Props> = ({ formData, handleChange, disabled = false }) => {
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
          error={
            formData.activity_status === "Public" &&
            (formData.activity_name?.length ?? 0) > 0 &&
            ((formData.activity_name?.length ?? 0) < 4 || (formData.activity_name?.length ?? 0) > 50)
          }
          helperText={
            formData.activity_status === "Public" &&
            (formData.activity_name?.length ?? 0) > 0 &&
            (formData.activity_name?.length ?? 0) < 4
              ? "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร"
              : formData.activity_status === "Public" &&
                (formData.activity_name?.length ?? 0) > 50
                ? "ชื่อกิจกรรมต้องไม่เกิน 50 ตัวอักษร"
                : ""
          }
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
          error={
            formData.activity_status === "Public" &&
            (formData.presenter_company_name?.length ?? 0) > 0 &&
            ((formData.presenter_company_name?.length ?? 0) < 4 || (formData.presenter_company_name?.length ?? 0) > 50)
          }
          helperText={
            formData.activity_status === "Public" &&
            (formData.presenter_company_name?.length ?? 0) > 0 &&
            (formData.presenter_company_name?.length ?? 0) < 4
              ? "ต้องมีอย่างน้อย 4 ตัวอักษร"
              : formData.activity_status === "Public" &&
                (formData.presenter_company_name?.length ?? 0) > 50
                ? "ชื่อบริษัท/วิทยากรต้องไม่เกิน 50 ตัวอักษร"
                : ""
          }
          sx={{ height: "56px" }}
        />
      </div>
    </div>
  );
};

export default ActivityInfoSection;
