// components/AdminActivityForm/StatusAndSeatSection.tsx
import { MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface Props {
  formData: any;
  seatCapacity: number | string;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
  setSeatCapacity: (value: number | string) => void;
  selectedRoom: string;
}

const StatusAndSeatSection: React.FC<Props> = ({
  formData,
  seatCapacity,
  handleChange,
  setSeatCapacity,
  selectedRoom,
}) => {
  return (
    <div className="flex space-x-4 mt-5">
      {/* สถานะ */}
      <div className="w-1/6">
        <label className="block font-semibold w-50">สถานะ *</label>
        <Select
          labelId="ac_status"
          name="ac_status"
          value={formData.ac_status}
          onChange={handleChange}
          className="rounded w-50"
          sx={{
            height: "56px",
            "& .MuiSelect-select": {
              padding: "8px",
            },
          }}
        >
          <MenuItem value="Private">Private</MenuItem>
          <MenuItem value="Public">Public</MenuItem>
        </Select>
      </div>

      {/* จำนวนที่นั่ง */}
      <div className="w-85.5">
        <label className="block font-semibold">จำนวนที่นั่ง *</label>
        <TextField
          id="ac_seat"
          name="ac_seat"
          type="number"
          placeholder="จำนวนที่เปิดให้นิสิตลงทะเบียน"
          value={seatCapacity}
          className="w-full"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setSeatCapacity(value);
            }
          }}
          error={Number(seatCapacity) < 0}
          helperText={
            Number(seatCapacity) < 0 ? "❌ กรุณาใส่จำนวนที่นั่ง" : ""
          }
          disabled={selectedRoom !== ""} // ✅ ปิดการแก้ไขถ้ามีการเลือกห้องแล้ว
          sx={{ height: "56px" }}
        />
      </div>
    </div>
  );
};

export default StatusAndSeatSection;
