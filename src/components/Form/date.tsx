import React from "react";
import { FormData } from "../Form/formdata"; 

interface Props {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventSchedule: React.FC<Props> = ({ formData, handleChange }) => {
  return (  
    <div className="w-1/2 mt-20.5">
     
    <label className="block font-semibold">วันและเวลาการดำเนินการกิจกรรม *</label>
    <div className="flex space-x-2">

      {/* กรอกวันเริ่้ม */}
      <div className="w-1/2">
        <div className="flex space-x-2">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          />

          {/* กรอกเวลาเริ่ม */}
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>
        <p className="text-xs text-gray-500  mt-1">Start</p>
      </div>

      <span className="self-center font-semibold">-</span>

      {/* กรอกวันจบ */}
      <div className="w-1/2">
        <div className="flex space-x-2">
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          />
          {/* กรอกเวลาจบ */}
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>
        <p className="text-xs text-gray-500  mt-1">End</p>
      </div>

    </div>
  </div>
  );
};

export default EventSchedule;
