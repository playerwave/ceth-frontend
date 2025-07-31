// components/AdminActivityForm/StatusAndSeatSection.tsx
import { MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { CreateActivityForm } from "../create_activity_admin";

interface Props {
  formData: CreateActivityForm;
  seatCapacity: number | string;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
  // setSeatCapacity: (value: number | string) => void;
  setSeatCapacity: Dispatch<SetStateAction<string>>;
  setFormData: Dispatch<SetStateAction<CreateActivityForm>>
  selectedRoom: string;
  disabled?: boolean;
}

const StatusAndSeatSection: React.FC<Props> = ({
  formData,
  seatCapacity,
  handleChange,
  setSeatCapacity,
  selectedRoom,
  setFormData,
  disabled = false,
}) => {
  return (
    <div className="flex space-x-4 mt-5 w-140">
  {/* สถานะ */}
  <div className="w-1/2">
    <label className="block font-semibold">สถานะ *</label>
    <Select
      labelId="ac_status"
      name="activity_status"
      value={formData.activity_status}
      onChange={handleChange}
      disabled={disabled}
      className="rounded w-full"
      sx={{
        height: "56px",
        "& .MuiSelect-select": { padding: "8px" },
      }}
    >
      <MenuItem value="Private">Private</MenuItem>
      <MenuItem value="Public">Public</MenuItem>
    </Select>
  </div>

  {/* จำนวนที่นั่ง */}
  <div className="w-1/2">
    <label className="block font-semibold">
      จำนวนที่นั่ง *
      {formData.event_format === "Course" && (
        <span className="text-gray-500 text-sm ml-2">(ไม่ใช้สำหรับ Course)</span>
      )}
    </label>
    <TextField
  id="ac_seat"
  name="seat"
  type="number"
  placeholder="จำนวนที่เปิดให้นิสิตลงทะเบียน"
  value={formData.event_format === "Course" ? "" : (formData.seat?.toString() ?? "")} // ✅ ล้างค่าเมื่อเป็น Course
  className="w-full"
  onChange={(e) => {
    // ✅ ไม่ให้แก้ไขเมื่อเป็น Course
    if (formData.event_format === "Course") return;
    
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const num = Number(value);
      const maxSeat = Number(seatCapacity); // ✅ ความจุของห้องที่เลือก

      if (num >= 0 && num <= maxSeat) {
        setFormData((prev: CreateActivityForm) => ({ ...prev, seat: num }));
      }
    }
  }}
  disabled={disabled || formData.event_format === "Course"} // ✅ ปิดเมื่อเป็น Course
  error={
  typeof formData.seat === "number" &&
  (formData.seat < 0 || formData.seat > Number(seatCapacity))
}
helperText={
  typeof formData.seat === "number" && formData.event_format !== "Course"
    ? formData.seat > Number(seatCapacity)
      ? `❌ จำนวนที่นั่งต้องไม่เกิน ${seatCapacity}`
      : formData.seat < 0
      ? "❌ กรุณาใส่จำนวนที่นั่ง"
      : ""
    : ""
}

  sx={{ height: "56px" }}
/>
  </div>
</div>
  );
};

export default StatusAndSeatSection;
