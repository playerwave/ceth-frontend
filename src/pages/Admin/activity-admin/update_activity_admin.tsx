import React, { useState, useEffect } from "react";
import { ImagePlus } from "lucide-react";
import { useActivityStore } from "../../../stores/Admin/activity_store"; // ✅ นำเข้า Zustand Store
import Button from "../../../components/Button";
import { Activity } from "../../../stores/Admin/activity_store";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import { toast } from "sonner";
import ConfirmDialog from "../../../components/ConfirmDialog";

interface FormData {
  ac_name: string;
  assesment_id?: number;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_room?: string | null;
  ac_seat?: string | null;
  ac_food?: string[] | null;
  ac_status: string;
  ac_location_type: string;
  ac_state: string;
  ac_start_register: string | null;
  ac_end_register: string | null;
  ac_create_date?: string;
  ac_last_update?: string;
  ac_registered_count?: number;
  ac_attended_count?: number;
  ac_not_attended_count?: number;
  ac_start_time?: string | null;
  ac_end_time?: string | null;
  ac_image_data?: File | null;
  ac_normal_register?: string | null;
}

const UpdateActivityAdmin: React.FC = () => {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId; // ✅ ใช้ state หรือ param ถ้ามี
  const finalActivityId = id ? Number(id) : null;
  const { updateActivity, fetchActivity } = useActivityStore(); //
  const [formData, setFormData] = useState<FormData>({
    ac_name: "",
    assesment_id: null,
    ac_company_lecturer: "",
    ac_description: "",
    ac_type: "",
    ac_room: "",
    ac_seat: "",
    ac_food: [],
    ac_status: "",
    ac_location_type: "",
    ac_state: "",
    ac_start_register: "",
    ac_end_register: "",
    ac_create_date: "",
    ac_last_update: "",
    ac_registered_count: 0,
    ac_attended_count: 0,
    ac_not_attended_count: 0,
    ac_start_time: "",
    ac_end_time: "",
    ac_image_data: null,
    ac_normal_register: "",
  });

  const IfBuildingRoom: Record<string, string[]> = {
    "3": ["301", "302", "303"],
    "4": ["401", "402", "403", "404"],
    "5": ["501", "502", "503"],
    "6": ["601", "602"],
    "7": ["701", "702", "703", "704"],
    "8": ["801", "802"],
    "9": ["901", "902", "903"],
    "10": ["1001", "1002"],
    "11": ["1101", "1102", "1103"],
  };

  const navigate = useNavigate();

  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const room = e.target.value;

    setSelectedRoom(room); // ✅ อัปเดตค่าห้องที่เลือก
    setFormData((prev) => ({
      ...prev,
      ac_room: room, // ✅ อัปเดตค่า ac_room ใน formData
    }));
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const floor = e.target.value;

    setSelectedFloor(floor);
    setSelectedRoom(""); // ✅ รีเซ็ตค่าห้องเมื่อเปลี่ยนชั้น

    setFormData((prev) => ({
      ...prev,
      ac_room: "", // ✅ รีเซ็ตค่า ac_room
    }));
  };

  useEffect(() => {
    if (formData.ac_room) {
      const floor = formData.ac_room.charAt(0); // ✅ ดึงตัวเลขตัวแรกเป็นชั้น
      setSelectedFloor(floor);
      setSelectedRoom(formData.ac_room);
    }
  }, [formData.ac_room]); // ✅ ใช้ useEffect เมื่อ ac_room เปลี่ยน

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      // ✅ ดึงค่าเดิมของ `ac_end_register` ถ้ามี หรือใช้วันที่ปัจจุบัน
      let currentDateTime = prev.ac_end_register
        ? new Date(prev.ac_end_register)
        : new Date();

      // ✅ ป้องกันการเปลี่ยน Time Zone โดยบังคับใช้ Local Time
      const localDateTime = new Date(
        currentDateTime.getFullYear(),
        currentDateTime.getMonth(),
        currentDateTime.getDate(),
        currentDateTime.getHours(),
        currentDateTime.getMinutes()
      );

      if (name === "ac_end_register_date" && value) {
        // ✅ เมื่อเปลี่ยนวันที่ ให้ใช้เวลาเดิม
        const [hours, minutes] = [
          localDateTime.getHours(),
          localDateTime.getMinutes(),
        ];
        const newDateTime = new Date(value); // ใช้วันที่ที่เลือก
        newDateTime.setHours(hours, minutes, 0, 0); // ✅ คงค่าเวลาเดิม

        return { ...prev, ac_end_register: newDateTime.toISOString() };
      }

      if (name === "ac_end_register_time" && value) {
        // ✅ เมื่อเปลี่ยนเวลา ให้ใช้วันที่เดิม
        const [hours, minutes] = value.split(":").map(Number);
        localDateTime.setHours(hours, minutes, 0, 0); // ✅ อัปเดตเฉพาะเวลา

        return { ...prev, ac_end_register: localDateTime.toISOString() };
      }

      if (name === "ac_normal_register_date" && value) {
        // ✅ เมื่อเปลี่ยนวันที่ ให้ใช้เวลาเดิม
        const [hours, minutes] = [
          localDateTime.getHours(),
          localDateTime.getMinutes(),
        ];
        const newDateTime = new Date(value); // ใช้วันที่ที่เลือก
        newDateTime.setHours(hours, minutes, 0, 0); // ✅ คงค่าเวลาเดิม

        return { ...prev, ac_normal_register: newDateTime.toISOString() };
      }

      if (name === "ac_normal_register_time" && value) {
        // ✅ เมื่อเปลี่ยนเวลา ให้ใช้วันที่เดิม
        const [hours, minutes] = value.split(":").map(Number);
        localDateTime.setHours(hours, minutes, 0, 0); // ✅ อัปเดตเฉพาะเวลา

        return { ...prev, ac_normal_register: localDateTime.toISOString() };
      }

      return {
        ...prev,
        [name]: type === "number" ? (value ? parseInt(value, 10) : "") : value,
      };
    });
  };

  useEffect(() => {
    if (!formData.ac_status) {
      setFormData((prev) => ({
        ...prev,
        ac_status: "Private", // ✅ ตั้งค่าเริ่มต้นเป็น "Private"
      }));
    }
  }, [formData.ac_status]);

  useEffect(() => {
    const loadActivity = async () => {
      if (!finalActivityId) {
        console.error("❌ No valid activity ID!");
        return;
      }
      console.log("📌 Fetching activity with ID:", finalActivityId);

      try {
        const activityData: Activity | null = await fetchActivity(
          finalActivityId
        );
        console.log("📌 Received activity data:", activityData);

        if (!activityData) {
          console.error("❌ No activity data found!");
          return;
        }

        console.log("✅ Fetched activity:", activityData);

        setFormData((prev) => ({
          ...prev,
          ac_name: activityData.name || "",
          ac_company_lecturer: activityData.company_lecturer || "",
          ac_description: activityData.description || "",
          ac_type: activityData.type || "",
          ac_room: activityData.room || "",
          ac_seat: activityData.seat.toString() || "",
          ac_food: activityData.food || [],
          ac_status: activityData.status || "",
          ac_location_type: activityData.location_type,
          ac_state: activityData.state || "",
          ac_start_register: activityData.start_register
            ? activityData.start_register.toISOString().split("T")[0]
            : "",
          ac_end_register: activityData.end_register
            ? activityData.end_register.toISOString().split("T")[0]
            : "",
          ac_create_date: activityData.create_date
            ? activityData.create_date.toISOString()
            : "",
          ac_last_update: activityData.last_update
            ? activityData.last_update.toISOString()
            : "",
          ac_start_time: activityData.start_time
            ? activityData.start_time.toISOString()
            : "",
          ac_end_time: activityData.end_time
            ? activityData.end_time.toISOString()
            : "",
          ac_image_data: activityData.image_data || null,
        }));
      } catch (error) {
        console.error("❌ Error fetching activity:", error);
      }
    };

    loadActivity();
  }, [finalActivityId, fetchActivity]);
  // ✅ โหลดข้อมูลเมื่อ `finalActivityId` เปลี่ยน

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ac_name) {
      alert("กรุณากรอกชื่อกิจกรรม!");
      return;
    }

    const updatedActivity: Activity = {
      id: finalActivityId?.toString() || "",
      name: formData.ac_name,
      company_lecturer: formData.ac_company_lecturer,
      description: formData.ac_description,
      type: formData.ac_type as "Hard Skill" | "Soft Skill",
      room: formData.ac_room || "ไม่ระบุห้อง",
      seat: formData.ac_seat ? formData.ac_seat.toString() : "0",
      food: formData.ac_food || [],
      status: formData.ac_status || "Private",
      location_type: formData.ac_location_type as "Online" | "Offline",
      start_register: formData.ac_start_register
        ? new Date(formData.ac_start_register)
        : null,
      end_register: formData.ac_end_register
        ? new Date(formData.ac_end_register)
        : null,
      create_date: formData.ac_create_date
        ? new Date(formData.ac_create_date)
        : null,
      last_update: new Date(),
      registered_count: formData.ac_registered_count || 0,
      attended_count: formData.ac_attended_count || 0,
      not_attended_count: formData.ac_not_attended_count || 0,
      start_time: formData.ac_start_time
        ? new Date(formData.ac_start_time)
        : null,
      end_time: formData.ac_end_time ? new Date(formData.ac_end_time) : null,

      image_data: formData.ac_image_data, // ✅ ตรวจสอบให้แน่ใจว่าเป็น Base64 ที่ถูกต้อง
      state: formData.ac_state || "Not Start",
    };

    console.log("✅ Sending Updated Activity Data:", updatedActivity);

    try {
      await updateActivity(updatedActivity);
      toast.success("Updated Success !"); // ✅ แสดง Toast เมื่ออัปเดตเสร็จ
    } catch (error) {
      console.error("❌ Error updating activity:", error);
      toast.error("Update failed!"); // ✅ แสดง Toast ถ้าอัปเดตไม่สำเร็จ
    }
  };

  const addFoodOption = () => {
    setFormData((prev) => ({
      ...prev,
      ac_food: [
        ...(prev.ac_food ?? []),
        `เมนู ${prev.ac_food?.length ?? 0 + 1}`,
      ],
    }));
  };

  // ฟังก์ชันแก้ไขเมนูอาหาร
  const updateFoodOption = (index: number, newValue: string) => {
    const updatedFoodOptions = [...(formData.ac_food ?? [])];
    updatedFoodOptions[index] = newValue;
    setFormData((prev) => ({ ...prev, ac_food: updatedFoodOptions }));
  };

  // ฟังก์ชันลบเมนูอาหาร
  const removeFoodOption = (index: number) => {
    const updatedFoodOptions = formData.ac_food?.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ac_food: updatedFoodOptions }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // ✅ ตรวจสอบว่าเป็นไฟล์รูปภาพ
      if (!file.type.startsWith("image/")) {
        alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
        return;
      }

      // ✅ ตรวจสอบขนาดไฟล์ (ต้องไม่เกิน 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์ขนาดใหญ่เกินไป (ต้องไม่เกิน 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result?.toString() || "";

        setFormData((prev) => ({
          ...prev,
          ac_image_data: base64String, // ✅ บันทึก Base64 พร้อม `data:image/`
        }));
        console.log("set formData", formData.ac_image_data);

        setPreviewImage(URL.createObjectURL(file)); // ✅ แสดงตัวอย่างรูปใหม่
      };
    }
  };

  useEffect(() => {
    console.log("📌 ac_location_type:", formData.ac_location_type); // ✅ ตรวจสอบค่าจริงที่โหลดมา
  }, [formData.ac_location_type]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="justify-items-center">
        <div
          className={`w-320 mx-auto ml-2xl mt-5 p-6 border bg-white border-gray-200 rounded-lg shadow-sm h-435  flex flex-col`}
        >
          <h1 className="text-4xl font-bold mb-11">รายละเอียดกิจกรรมสหกิจ</h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col flex-grow"
          >
            {/* scrollbar */}
            <div className="max-h-[800px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 pr-4">
              <div className="flex space-x-6">
                {/* ช่องกรอกชื่อกิจกรรม */}
                <div>
                  <label className="block font-semibold w-50">
                    ชื่อกิจกรรม *
                  </label>
                  <input
                    type="text"
                    name="ac_name"
                    value={formData.ac_name}
                    onChange={handleChange}
                    className="w-140 p-2 border rounded mb-4 border-[#9D9D9D]"
                    placeholder="ชื่อกิจกรรม"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 w-full">
                  <div>
                    <label className="block font-semibold">
                      วันและเวลาปิดการลงทะเบียน *
                    </label>
                    <div className="flex space-x-2 w-full">
                      {/* กรอกวันและเวลาการปิดลงทะเบียน */}
                      <div className="w-1/2">
                        <div className="flex space-x-2">
                          {/* กรอกวันที่ปิดรับลงทะเบียน */}
                          <input
                            name="ac_end_register_date"
                            type="date"
                            value={
                              formData.ac_end_register
                                ? new Date(formData.ac_end_register)
                                    .toISOString()
                                    .split("T")[0] // ✅ แปลงเป็น YYYY-MM-DD
                                : ""
                            }
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />

                          {/* กรอกเวลาปิดรับลงทะเบียน */}
                          <input
                            type="time"
                            name="ac_end_register_time"
                            value={
                              formData.ac_end_register
                                ? new Date(
                                    formData.ac_end_register
                                  ).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) // ✅ ใช้เวลา 24 ชม.
                                : ""
                            }
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-6">
                {/* ช่องกรอกชื่อบริษัท/วิทยากร */}
                <div className="w-1/2">
                  <label className="block font-semibold ">
                    ชื่อบริษัท/วิทยากร *
                  </label>
                  <input
                    type="text"
                    name="ac_company_lecturer"
                    value={formData.ac_company_lecturer}
                    onChange={handleChange}
                    className="w-140 p-2 border rounded mb-4 border-[#9D9D9D]"
                    placeholder="ชื่อบริษัท หรือ วิทยากร ที่มาอบรม"
                    required
                  />
                </div>

                {/* ช่องกรอกวันและเวลาที่ให้นิสิตที่มีสถานะ normal ลงทะเบียน */}
                <div className="grid grid-cols-1 gap-2 w-full">
                  <div>
                    <label className="block font-semibold">
                      วันและเวลาที่ให้นิสิตที่มีสถานะ normal ลงทะเบียน *
                    </label>
                    <div className="flex space-x-2 w-full">
                      {/* กรอกวันเริ่มให้นิสิตที่มีสถานะ normal ลงทะเบียน */}
                      <div className="w-1/2">
                        <div className="flex space-x-2">
                          {/* กรอกวันที่ปิดรับลงทะเบียน */}
                          <input
                            name="ac_normal_register_date"
                            type="date"
                            value={
                              formData.ac_normal_register
                                ? new Date(formData.ac_normal_register)
                                    .toISOString()
                                    .split("T")[0] // ✅ แปลงเป็น YYYY-MM-DD
                                : ""
                            }
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />

                          {/* กรอกเวลาปิดรับลงทะเบียน */}
                          <input
                            type="time"
                            name="ac_normal_register_time"
                            value={
                              formData.ac_normal_register
                                ? new Date(
                                    formData.ac_normal_register
                                  ).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) // ✅ ใช้เวลา 24 ชม.
                                : ""
                            }
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ช่องกรอกคำอธิบาย */}
              <div className="flex space-x-6">
                <div>
                  <label className="block font-semibold w-50">
                    คำอธิบายกิจกรรม
                  </label>
                  <textarea
                    name="ac_description"
                    value={formData.ac_description}
                    onChange={handleChange}
                    className="w-140 p-2 border rounded mb-4 h-42 border-[#9D9D9D]"
                    placeholder="รายละเอียดกิจกรรม หรือ คำอธิบาย"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 w-full">
                  <div>
                    <label className="block font-semibold">
                      วันและเวลาการดำเนินการกิจกรรม *
                    </label>
                    <div className="flex space-x-2 w-full">
                      {/* กรอกวันเริ่้ม */}
                      <div className="w-1/2">
                        <div className="flex space-x-2">
                          <input
                            name="ac_start_date"
                            type="date"
                            value={
                              formData.ac_start_time
                                ? new Date(formData.ac_start_time)
                                    .toISOString()
                                    .split("T")[0] // ✅ แปลงเป็น YYYY-MM-DD
                                : ""
                            }
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />
                          {/* กรอกเวลาเริ่ม */}
                          <input
                            type="time"
                            name="ac_start_time"
                            value={
                              formData.ac_start_time
                                ? new Date(
                                    formData.ac_start_time
                                  ).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) // ✅ ใช้เวลา 24 ชม.
                                : ""
                            }
                            onChange={handleChange}
                            className="w-100 p-2 border rounded border-[#9D9D9D]"
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
                            name="ac_end_date"
                            value={
                              formData.ac_end_time
                                ? new Date(formData.ac_end_time)
                                    .toISOString()
                                    .split("T")[0] // ✅ แปลงเป็น YYYY-MM-DD
                                : ""
                            }
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />
                          {/* กรอกเวลาจบ */}
                          <input
                            type="time"
                            name="ac_end_time"
                            value={
                              formData.ac_end_time
                                ? new Date(
                                    formData.ac_end_time
                                  ).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) // ✅ ใช้เวลา 24 ชม.
                                : ""
                            }
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />
                        </div>
                        <p className="text-xs text-gray-500  mt-1">End</p>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold w-50">
                        ประเภทสถานที่จัดกิจกรรม *
                      </label>
                      <select
                        name="ac_location_type"
                        value={formData.ac_location_type} // ✅ ใช้ค่าจริงจาก formData ถ้ามี
                        onChange={handleChange}
                        className="w-1/2 p-2 border rounded mb-4 border-[#9D9D9D]"
                      >
                        <option value="">เลือกประเภทสถานที่</option>{" "}
                        {/* ป้องกันค่า null */}
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ช่องกรอกระเภท */}
              <div className="flex space-x-6">
                <div>
                  <label className="block font-semibold w-50">ประเภท *</label>
                  <select
                    name="ac_type"
                    value={formData.ac_type}
                    onChange={handleChange}
                    className="w-140 p-2 border rounded mb-4 border-[#9D9D9D]"
                  >
                    <option value="SoftSkill">
                      ชั่วโมงเตรียมความพร้อม (Soft Skill)
                    </option>
                    <option value="HardSkill">
                      ชั่วโมงทักษะทางวิชาการ (Hard Skill)
                    </option>
                    <option value="other">อื่นๆ </option>
                  </select>
                </div>
              </div>

              {/* ช่องกรอกห้องที่ใช้อบรม */}
              <div className="flex space-x-4">
                {/* เลือกชั้น */}
                <div className="w-1/6">
                  <label className="block font-semibold">เลือกชั้น</label>
                  <select
                    value={
                      selectedFloor ||
                      (formData.ac_room ? formData.ac_room.charAt(0) : "")
                    } // ✅ ใช้ตัวเลขตัวแรกของ ac_room ถ้ามี
                    onChange={handleFloorChange}
                    className="w-full p-2 border rounded border-[#9D9D9D]"
                  >
                    <option value="">เลือกชั้น</option>
                    {Object.keys(IfBuildingRoom).map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* เลือกห้อง */}
                <div className="w-85.5">
                  <label className="block font-semibold">เลือกห้อง</label>
                  <select
                    value={formData.ac_room || selectedRoom} // ✅ ใช้ค่า ac_room ถ้ามี
                    onChange={handleRoomChange}
                    className={`w-full p-2 border rounded border-[#9D9D9D] ${
                      selectedFloor ? "" : " cursor-not-allowed opacity-50"
                    }`}
                    disabled={!selectedFloor} // ปิดการใช้งานถ้ายังไม่ได้เลือกชั้น
                  >
                    <option value="">เลือกห้อง</option>
                    {selectedFloor &&
                      IfBuildingRoom[selectedFloor]?.map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                {/* ช่องกรอกสถานะ*/}
                <div className="w-1/6">
                  <label className="block font-semibold w-50">สถานะ *</label>
                  <select
                    name="ac_status"
                    value={formData.ac_status || "Private"} // ✅ ใช้ค่า ac_status ถ้ามี ถ้าไม่มีให้เป็น "Private"
                    onChange={handleChange}
                    className="w-full p-2 border rounded border-[#9D9D9D]"
                  >
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
                {/* ช่องกรอกจำนวนที่นั่ง*/}
                <div className="w-85.5">
                  <label className="block font-semibold ">จำนวนที่นั่ง *</label>
                  <input
                    type="number"
                    name="ac_seat"
                    value={formData.ac_seat ?? ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded border-[#9D9D9D]"
                    min="1"
                  />
                </div>
              </div>

              {/* ช่องเลือกอาหาร */}
              <div className="w-140 mt-5 bg-white p-6 border border-[#9D9D9D] rounded-lg shadow-sm">
                {/* หัวข้อ */}
                <label className="block font-semibold mb-2">อาหาร *</label>

                {/* ส่วนรายการเมนู มี Scrollbar */}
                <div className="max-h-30 overflow-y-auto pr-2 space-y-2">
                  {formData.ac_food?.map((menu, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={menu}
                        onChange={(e) =>
                          updateFoodOption(index, e.target.value)
                        }
                        className="w-full p-2 border rounded border-[#9D9D9D]"
                      />
                      <button
                        type="button"
                        onClick={() => removeFoodOption(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                {/* ปุ่มเพิ่มเมนู (อยู่นอก Scrollbar) */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={addFoodOption}
                    className="bg-[#1E3A8A] text-white px-4 py-2 rounded mt-4"
                  >
                    เพิ่มอาหาร
                  </button>
                </div>
              </div>

              {/* แบบประเมิน */}
              <div className="mt-4 border-[#9D9D9D]">
                <label className="block font-semibold">แบบประเมิน *</label>
                <select
                  name="evaluationType"
                  value={formData.assesment_id}
                  onChange={handleChange}
                  className="w-140 p-2 border rounded mb-4 border-[#9D9D9D]"
                >
                  <option value="แบบประเมิน 1">แบบประเมิน 1</option>
                  <option value="แบบประเมิน 2">แบบประเมิน 2</option>
                  <option value="แบบประเมิน 3">แบบประเมิน 3</option>
                </select>
              </div>

              {/* อัปโหลดไฟล์ */}
              <div>
                <label className=" font-semibold">แนบไฟล์ :</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-118 p-2 border rounded ml-4 border-[#9D9D9D]"
                />
              </div>

              {/* แสดงภาพที่อัปโหลด (ถ้าเป็นรูป) */}
              {/* แสดงภาพที่อัปโหลด (ถ้าเป็นรูป) */}
              {/* แสดงภาพที่อัปโหลด */}
              {previewImage || formData.ac_image_data ? (
                <div className="mt-4 w-200 h-125 border-red-900">
                  <p className="text-sm text-gray-500">
                    ตัวอย่างรูปที่อัปโหลด:
                  </p>
                  <img
                    src={
                      previewImage ||
                      (formData.ac_image_data?.startsWith("data:image")
                        ? formData.ac_image_data
                        : `data:image/png;base64,${formData.ac_image_data}`)
                    }
                    alt="อัปโหลดภาพกิจกรรม"
                    className="w-200 h-125 mt-2 object-cover border rounded-lg shadow"
                  />
                </div>
              ) : (
                <div className="w-200 h-125 mt-5 max-w-3xl bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center cursor-default transition pointer-events-none">
                  <div className="text-center text-black-400">
                    <ImagePlus size={48} className="mx-auto" />
                    <p className="text-sm mt-2">อัปโหลดรูปภาพ</p>
                  </div>
                </div>
              )}

              {/* Confirm Dialog */}
              <ConfirmDialog
                isOpen={isModalOpen}
                title="ยกเลิกการแก้ไขกิจกรรม"
                message="คุณแน่ใจว่าจะยกเลิกการแก้ไข
                กิจกรรมในครั้งนี้ ?"
                onCancel={() => setIsModalOpen(false)}
                onConfirm={() => {
                  navigate("/list-activity-admin"); // ✅ เปลี่ยนหน้าเมื่อกดยืนยัน
                }}
              />

              {/* ปุ่ม ยกเลิก & สร้าง */}
              <div className="mt-10 flex justify-end items-center space-x-4 px-6 ">
                {/* ปุ่มยกเลิก */}
                <Button
                  type="button"
                  color="red"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  ยกเลิก
                </Button>

                {/* ปุ่มสร้าง */}
                <Button type="submit" color="blue" width="100px">
                  แก้ไข
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateActivityAdmin;
