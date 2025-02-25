import React from "react";
import { FormData } from "../Form/formdata"; 

interface Props {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

const StatusAndSeats: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div className="flex space-x-4">
      {/* เลือกสถานะ */}
      <div className="w-1/6">
        <label className="block font-semibold">สถานะ *</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Private">Private</option>
          <option value="Public">Public</option>
        </select>
      </div>

      {/* จำนวนที่นั่ง */}
      <div className="w-109">
        <label className="block font-semibold">จำนวนที่นั่ง *</label>
        <input type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-107.5 p-2 border rounded" min="1" />
      </div>
    </div>
  );
};

export default StatusAndSeats;
