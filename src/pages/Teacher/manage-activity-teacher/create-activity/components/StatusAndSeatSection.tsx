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
  placeholder="จำนวนที่เปิดให้นิสิตลงทะเบียน"
  value={formData.seat?.toString() ?? ""}
  className="w-full"
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const num = Number(value);
      const maxSeat = Number(seatCapacity); // ✅ ความจุของห้องที่เลือก

      if (num >= 0 && num <= maxSeat) {
        setFormData((prev: CreateActivityForm) => ({ ...prev, seat: num }));
      }
    }
  }}
  disabled={disabled}
  error={
  typeof formData.seat === "number" &&
  (formData.seat < 0 || formData.seat > Number(seatCapacity))
}
helperText={
  typeof formData.seat === "number"
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
