// components/AdminActivityForm/ActivityInfoSection.tsx
import { TextField } from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";


interface Props {
  formData: CreateActivityForm;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const ActivityInfoSection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div className="flex flex-col space-y-6 w-140 ml-0">
      <div className="flex flex-col w-140">
        <label className="block font-semibold mb-1">ชื่อกิจกรรม *</label>
        <TextField
          id="ac_name"
          name="ac_name"
          placeholder="ชื่อกิจกรรม"
          value={formData.activity_name}
          className="w-full"
          onChange={handleChange}
          error={
            formData.activity_status !== "Private" &&
            (formData.activity_name?.length ?? 0) > 0 &&
            (formData.activity_name?.length ?? 0) < 4
          }
          helperText={
            formData.activity_status !== "Private" &&
            (formData.activity_name?.length ?? 0) > 0 &&
            (formData.activity_name?.length ?? 0) < 4
              ? "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร"
              : ""
          }
          sx={{ height: "56px" }}
        />
      </div>

      <div className="flex flex-col w-140 mt-2">
        <label className="block font-semibold mb-1">ชื่อบริษัท/วิทยากร *</label>
        <TextField
          id="ac_company_lecturer"
          name="ac_company_lecturer"
          placeholder="ชื่อบริษัท หรือ วิทยากร ที่มาอบรม"
          value={formData.presenter_company_name}
          className="w-full"
          onChange={handleChange}
          error={
            formData.activity_status !== "Private" &&
            (formData.presenter_company_name?.length ?? 0) > 0 &&
            (formData.presenter_company_name?.length ?? 0) < 4
          }
          helperText={
            formData.activity_status !== "Private" &&
            (formData.presenter_company_name?.length ?? 0) > 0 &&
            (formData.presenter_company_name?.length ?? 0) < 4
              ? "ต้องมีอย่างน้อย 4 ตัวอักษร"
              : ""
          }
          sx={{ height: "56px" }}
        />
      </div>
    </div>
  );
};

export default ActivityInfoSection;
