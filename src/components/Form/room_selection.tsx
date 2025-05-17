import React from "react";
import { FormData } from "../Form/formdata"; 
  {/* ช่องกรอกห้องที่ใช้อบรม */}
interface Props {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoomSelection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div>
      <label className="block font-semibold">ห้องที่ใช้อบรม</label>
      <div className="flex space-x-2">
        <input type="text" name="roomFloor" value={formData.roomFloor} onChange={handleChange} className="w-30 p-2 border rounded" placeholder="ชั้นที่" />
        <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} className="w-136 p-2 border rounded" placeholder="หมายเลขห้อง" />
      </div>
    </div>
  );
};

export default RoomSelection;
