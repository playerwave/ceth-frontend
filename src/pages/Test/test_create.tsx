import React, { useState } from "react";
import { useActivityStore } from "../../stores/Admin/activity_store"; // Zustand Store
import { Activity } from "../../stores/Admin/activity_store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import TextField from "@mui/material/TextField";

interface FormData {
  ac_id: number | null;
  ac_name: string;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_status: string;
  ac_start_register: string | null;
  ac_end_register: string | null;
  ac_start_time?: string | null;
  ac_end_time?: string | null;
}

const TestCreate: React.FC = () => {
  const { createActivity } = useActivityStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    ac_id: null,
    ac_name: "",
    ac_company_lecturer: "",
    ac_description: "",
    ac_type: "SoftSkill",
    ac_status: "Private",
    ac_start_register: "",
    ac_end_register: "",
    ac_start_time: "",
    ac_end_time: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ตรวจสอบว่าข้อมูลต้องมีอย่างน้อย 4 ตัวอักษร
    if (
      formData.ac_name.length < 4 ||
      formData.ac_company_lecturer.length < 4 ||
      formData.ac_description.length < 4
    ) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วนและต้องมีอย่างน้อย 4 ตัวอักษร");
      return;
    }

    try {
      await createActivity(formData as Activity);
      toast.success("Created Successfully!");
      navigate("/list-activity-admin", { state: { reload: true } });
    } catch (error) {
      toast.error("Create failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-320 mx-auto ml-2xl mt-5 p-6 border bg-white border-gray-200 rounded-lg shadow-sm h-435  flex flex-col">
        <h1 className="text-2xl font-bold mb-6">สร้างกิจกรรมสหกิจ</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ชื่อกิจกรรม */}
          <div>
            <label className="block font-semibold w-50">ชื่อกิจกรรม *</label>
            <TextField
              id="ac_name"
              name="ac_name"
              value={formData.ac_name}
              className="w-150"
              onChange={handleChange}
              error={formData.ac_name.length > 0 && formData.ac_name.length < 4}
              helperText={
                formData.ac_name.length > 0 && formData.ac_name.length < 4
                  ? "ต้องมีอย่างน้อย 4 ตัวอักษร"
                  : ""
              }
            />
          </div>

          {/* ชื่อบริษัท / วิทยากร */}
          <div>
            <TextField
              id="ac_name"
              name="ac_name"
              value={formData.ac_company_lecturer}
              className="w-150"
              onChange={handleChange}
              error={formData.ac_name.length > 0 && formData.ac_name.length < 4}
              helperText={
                formData.ac_name.length > 0 && formData.ac_name.length < 4
                  ? "ต้องมีอย่างน้อย 4 ตัวอักษร"
                  : ""
              }
            />
          </div>

          {/* คำอธิบายกิจกรรม */}
          <div>
            <label className="block text-gray-700">คำอธิบายกิจกรรม *</label>
            <textarea
              name="ac_description"
              value={formData.ac_description}
              onChange={handleChange}
              minLength={4}
              required
              rows={4}
              className="w-150 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            />
          </div>

          {/* ประเภทกิจกรรม */}
          <div>
            <label className="block text-gray-700">ประเภท</label>
            <select
              name="ac_type"
              value={formData.ac_type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            >
              <option value="SoftSkill">SoftSkill</option>
              <option value="HardSkill">HardSkill</option>
              <option value="Other">อื่นๆ</option>
            </select>
          </div>

          {/* วันเริ่มลงทะเบียน */}
          <div>
            <label className="block text-gray-700">วันเริ่มลงทะเบียน *</label>
            <input
              type="date"
              name="ac_start_register"
              value={formData.ac_start_register || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            />
          </div>

          {/* วันสิ้นสุดการลงทะเบียน */}
          <div>
            <label className="block text-gray-700">
              วันสิ้นสุดการลงทะเบียน *
            </label>
            <input
              type="date"
              name="ac_end_register"
              value={formData.ac_end_register || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            />
          </div>

          {/* เวลาเริ่มกิจกรรม */}
          <div>
            <label className="block text-gray-700">เวลาเริ่มกิจกรรม *</label>
            <input
              type="time"
              name="ac_start_time"
              value={formData.ac_start_time || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            />
          </div>

          {/* เวลาสิ้นสุดกิจกรรม */}
          <div>
            <label className="block text-gray-700">เวลาสิ้นสุดกิจกรรม *</label>
            <input
              type="time"
              name="ac_end_time"
              value={formData.ac_end_time || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            />
          </div>

          {/* ปุ่ม */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate("/list-activity-admin")}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              สร้างกิจกรรม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestCreate;
