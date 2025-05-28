// components/AdminActivityForm/ActivityInfoSection.tsx
import { TextField } from "@mui/material";

interface Props {
  formData: any;
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
          value={formData.ac_name}
          className="w-full"
          onChange={handleChange}
          error={
            formData.ac_status !== "Private" &&
            formData.ac_name.length > 0 &&
            formData.ac_name.length < 4
          }
          helperText={
            formData.ac_status !== "Private" &&
            formData.ac_name.length > 0 &&
            formData.ac_name.length < 4
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
          value={formData.ac_company_lecturer}
          className="w-full"
          onChange={handleChange}
          error={
            formData.ac_status !== "Private" &&
            formData.ac_company_lecturer.length > 0 &&
            formData.ac_company_lecturer.length < 4
          }
          helperText={
            formData.ac_status !== "Private" &&
            formData.ac_company_lecturer.length > 0 &&
            formData.ac_company_lecturer.length < 4
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
