// components/AdminActivityForm/TypeAndLocationSection.tsx
import { MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";

interface Props {
  formData: CreateActivityForm;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
  setSelectedFloor: (val: string) => void;
  setSelectedRoom: (val: string) => void;
  setSeatCapacity: (val: string) => void;
  disabled?: boolean;
}

const TypeAndLocationSection: React.FC<Props> = ({
  formData,
  handleChange,
  setSelectedFloor,
  setSelectedRoom,
  setSeatCapacity,
  disabled = false,
}) => {
  return (
    <div className="flex space-x-6 items-center mt-6">
      {/* ประเภทสถานที่ */}
      <div className="w-76">
        <label className="block font-semibold">ประเภทสถานที่จัดกิจกรรม *</label>
         <Select
  labelId="event_format-label"
  name="event_format" // ✅ ตรงกับ formData
  value={formData.event_format}
  onChange={(e) => {
    handleChange(e);
    if (e.target.value !== "Onsite") {
      setSelectedFloor("");
      setSelectedRoom("");
      setSeatCapacity("");
    }
  }}
  disabled={disabled}
  className="rounded w-full"
  sx={{
    height: "56px",
    "& .MuiSelect-select": { padding: "8px" },
  }}
>
  <MenuItem value="Online">Online</MenuItem>
  <MenuItem value="Onsite">Onsite</MenuItem>
  <MenuItem value="Course">Course</MenuItem>
</Select>

      </div>
    </div>
  );
};

export default TypeAndLocationSection;
