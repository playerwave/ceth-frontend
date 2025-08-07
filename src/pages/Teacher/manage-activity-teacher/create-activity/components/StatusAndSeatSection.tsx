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
        <label className="block font-semibold">จำนวนที่นั่ง *</label>
        <TextField
          id="ac_seat"
          name="seat"
          type="number"
          placeholder={
            formData.event_format === "Course" 
              ? "ไม่สามารถกำหนดได้สำหรับ Course"
              : formData.event_format === "Online"
              ? "กรอกจำนวนที่นั่ง (ไม่จำกัด)"
              : "จำนวนที่เปิดให้นิสิตลงทะเบียน"
          }
          value={formData.seat?.toString() ?? ""}
          className="w-full"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              const num = Number(value);
              
              // ✅ ตรวจสอบตาม event_format
              if (formData.event_format === "Onsite") {
                // ✅ Onsite: ไม่เกินความจุห้อง
                const maxSeat = Number(seatCapacity);
                if (num >= 0 && num <= maxSeat) {
                  setFormData((prev: CreateActivityForm) => ({ ...prev, seat: num }));
                }
              } else if (formData.event_format === "Online") {
                // ✅ Online: ไม่จำกัด (แต่ต้องมากกว่า 0)
                if (num >= 0) {
                  setFormData((prev: CreateActivityForm) => ({ ...prev, seat: num }));
                }
              }
              // ✅ Course: ไม่สามารถกำหนดได้ (disabled)
            }
          }}
          disabled={disabled || formData.event_format === "Course"}
          error={
            formData.activity_status === "Public" &&
            formData.event_format === "Onsite" &&
            typeof formData.seat === "number" &&
            (formData.seat < 0 || formData.seat > Number(seatCapacity))
          }
          helperText={
            formData.event_format === "Course"
              ? "Course ไม่ต้องการจำนวนที่นั่ง"
              : formData.event_format === "Online"
              ? "กำหนดจำนวนที่นั่งสำหรับกิจกรรม Online (ไม่จำกัด)"
              : formData.activity_status === "Public" && typeof formData.seat === "number"
              ? formData.seat > Number(seatCapacity)
                ? `❌ จำนวนที่นั่งต้องไม่เกิน ${seatCapacity}`
                : formData.seat < 0
                  ? "❌ กรุณาใส่จำนวนที่นั่ง"
                  : ""
              : ""
          }
          sx={{ 
            height: "56px",
            opacity: formData.event_format === "Course" ? 0.5 : 1,
          }}
        />
      </div>
    </div>

  );
};

export default StatusAndSeatSection;
