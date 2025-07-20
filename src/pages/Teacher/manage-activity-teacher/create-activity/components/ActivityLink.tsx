import React from "react";
import { TextField, SelectChangeEvent } from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";

interface Props {
  formData: CreateActivityForm;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
}

const ActivityLink: React.FC<Props> = ({ formData,handleChange  }) => {
  const showError =
    formData.event_format === "Course" && (!formData.url || formData.url.trim() === "");

  return (
    <div className="w-140 mb-2 mt-5">
      <label className="block font-semibold">ลิ้งกิจกรรม *</label>
      {/* <TextField
        name="url"
        placeholder="กรอกลิ้งกิจกรรมที่นี่"
        value={formData.url || ""}
        className="w-full"
        error={showError}
        helperText={
          showError
            ? "❌ กิจกรรมแบบ Course ต้องระบุลิ้งกิจกรรม"
            : ""
        }
        sx={{ height: "56px" }}
      /> */}
      <TextField
  name="url"
  placeholder="กรอกลิ้งกิจกรรมที่นี่"
  value={formData.url || ""}
  onChange={handleChange} // ✅ เพิ่มตรงนี้
  className="w-full"
  error={showError}
  helperText={
    showError
      ? "❌ กิจกรรมแบบ Course ต้องระบุลิ้งกิจกรรม"
      : ""
  }
  sx={{ height: "56px" }}
/>

    </div>
  );
};

export default ActivityLink;
