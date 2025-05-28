// components/AdminActivityForm/TypeAndLocationSection.tsx
import { MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
  setSelectedFloor: (val: string) => void;
  setSelectedRoom: (val: string) => void;
  setSeatCapacity: (val: string) => void;
}

const TypeAndLocationSection: React.FC<Props> = ({
  formData,
  handleChange,
  setSelectedFloor,
  setSelectedRoom,
  setSeatCapacity,
}) => {
  return (
    <div className="flex space-x-6 items-center mt-6">
      {/* ประเภทกิจกรรม */}
      <div className="w-140">
        <label className="block font-semibold">ประเภท *</label>
        <Select
          labelId="ac_type-label"
          name="ac_type"
          value={formData.ac_type}
          onChange={handleChange}
          className="rounded w-full"
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <span className="text-black">เลือกประเภทกิจกรรม</span>;
            }
            return selected;
          }}
          sx={{
            height: "56px",
            "& .MuiSelect-select": {
              padding: "8px",
            },
          }}
        >
          <MenuItem disabled value="">
            เลือกประเภทกิจกรรม
          </MenuItem>
          <MenuItem value="Soft Skill">ชั่วโมงเตรียมความพร้อม (Soft Skill)</MenuItem>
          <MenuItem value="Hard Skill">ชั่วโมงทักษะทางวิชาการ (Hard Skill)</MenuItem>
        </Select>
      </div>

      {/* ประเภทสถานที่ */}
      <div className="w-76">
        <label className="block font-semibold">ประเภทสถานที่จัดกิจกรรม *</label>
        <Select
          labelId="ac_location_type-label"
          name="ac_location_type"
          value={formData.ac_location_type}
          onChange={(e) => {
            handleChange(e); // อัปเดต formData ปกติ
            if (e.target.value !== "Onsite") {
              // ถ้าไม่ใช่ Onsite → ล้างค่าที่เกี่ยวข้องกับห้อง
              setSelectedFloor("");
              setSelectedRoom("");
              setSeatCapacity("");
            }
          }}
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
