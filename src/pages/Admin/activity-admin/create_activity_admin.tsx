//react hook
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//import icon
import { ImagePlus } from "lucide-react";

//import store
import { useActivityStore } from "../../../stores/Admin/activity_store"; // ✅ นำเข้า Zustand Store
import { Activity } from "../../../stores/Admin/activity_store";

//import component
import Button from "../../../components/Button";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";

interface FormData {
  ac_id: number | null;
  ac_name: string;
  assesment_id?: number | null;
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

const CreateActivityAdmin: React.FC = () => {
  const { createActivity } = useActivityStore(); //
  const [formData, setFormData] = useState<FormData>({
    ac_id: null,
    ac_name: "",
    assesment_id: null,
    ac_company_lecturer: "",
    ac_description: "",
    ac_type: "SoftSkill",
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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [endRegisterDate, setEndRegisterDate] = useState("");
  const [endRegisterTime, setEndRegisterTime] = useState("");

  const [normalRegisterDate, setNormalRegisterDate] = useState("");
  const [normalRegisterTime, setNormalRegisterTime] = useState("");

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const floor = e.target.value;
    setSelectedFloor(floor);
    setSelectedRoom(""); // รีเซ็ตห้องเมื่อเปลี่ยนชั้น
    setFormData((prev) => ({ ...prev, ac_room: "" })); // รีเซ็ตค่า ac_room
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const room = e.target.value;
    setSelectedRoom(room);
    setFormData((prev) => ({ ...prev, ac_room: room })); // อัปเดต ac_room
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseInt(value, 10) : "") : value,
    }));

    // ตรวจจับค่าของ input ที่เป็นวันที่หรือเวลา และอัปเดต state ให้ถูกต้อง
    switch (name) {
      case "ac_start_register":
        setStartDate(value);
        break;
      case "ac_end_register_date":
        setEndRegisterDate(value);
        break;
      case "ac_end_register_time":
        setEndRegisterTime(value);
        break;
      case "ac_normal_register_date":
        setNormalRegisterDate(value);
        break;
      case "ac_normal_register_time":
        setNormalRegisterTime(value);
        break;
      case "ac_start_date":
        setStartDate(value);
        break;
      case "ac_start_time":
        setStartTime(value);
        break;
      case "ac_end_date":
        setEndDate(value);
        break;
      case "ac_end_time":
        setEndTime(value);
        break;
      case "ac_normal_register":
        setNormalRegisterDate(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericSeats = formData.ac_seat ? parseInt(formData.ac_seat, 10) : 0;

    // ✅ แปลงค่า string เป็น Date (Backend คาดหวังเป็น Date)
    const endRegisterDateTime = new Date(
      `${endRegisterDate}T${endRegisterTime}:00Z`
    );
    const startDateTime = new Date(`${startDate}T${startTime}:00Z`);
    const endDateTime = new Date(`${endDate}T${endTime}:00Z`);
    const normalRegister = new Date(
      `${normalRegisterDate}T${normalRegisterTime}:00Z`
    );

    // ✅ ใช้ let แทน const และตรวจสอบสถานะ
    let startregister: Date | undefined;
    if (formData.ac_status === "Public") {
      startregister = new Date(); // ตั้งค่าเป็นวันที่ปัจจุบัน
    } else {
      startregister = undefined; // ถ้าไม่ใช่ Public ให้เป็น undefined
    }

    console.log("startDateTime: ", startDateTime);

    const activityData: Activity = {
      ac_name: formData.ac_name,
      assessment_id: 1,
      ac_company_lecturer: formData.ac_company_lecturer,
      ac_description: formData.ac_description,
      ac_type: formData.ac_type,
      ac_room: formData.ac_room || "Unknown",
      ac_seat: !isNaN(numericSeats) ? numericSeats : 0,
      ac_food: formData.ac_food || [],
      ac_status: formData.ac_status || "Private",
      ac_location_type: formData.ac_location_type || "Offline",
      ac_state: "Not Start",
      ac_start_register: startregister, // ✅ ใช้ค่าจาก if-check
      ac_end_register: endRegisterDateTime, // ✅ ส่งเป็น Date
      ac_create_date: new Date(),
      ac_last_update: new Date(),
      ac_registered_count: formData.ac_registered_count,
      ac_attended_count: formData.ac_attended_count,
      ac_not_attended_count: formData.ac_not_attended_count,
      ac_start_time: startDateTime, // ✅ ส่งเป็น Date
      ac_end_time: endDateTime, // ✅ ส่งเป็น Date
      ac_image_data: formData.ac_image_data || "", // ✅ ส่ง Base64 ไปที่ Backend
      ac_normal_register: normalRegister, // ✅ ส่งเป็น Date
    };

    console.log("✅ Sending Activity Data:", activityData);
    await createActivity(activityData);

    try {
      await createActivity(activityData);
      toast.success("Created Successfully!", { duration: 5000 });

      // ✅ ใช้ navigate พร้อม state เพื่อรีโหลดหน้าเพียงครั้งเดียว
      navigate("/list-activity-admin", { state: { reload: true } });
    } catch (error) {
      console.error("❌ Error creating activity:", error);
      toast.error("Create failed!"); // ✅ แสดง Toast ถ้าอัปเดตไม่สำเร็จ
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
        // ✅ ตัด "data:image/png;base64," ออกจาก Base64
        const base64String = reader.result?.toString().split(",")[1];

        setFormData((prev) => ({
          ...prev,
          ac_image_data: base64String, // ✅ บันทึก Base64 ลง state
        }));

        setPreviewImage(URL.createObjectURL(file)); // ✅ แสดงตัวอย่างรูป
      };
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (formData.ac_type === "Hard Skill") {
      setFormData((prev) => ({ ...prev, ac_type: "HardSkill" }));
    } else if (formData.ac_type === "Soft Skill") {
      setFormData((prev) => ({ ...prev, ac_type: "SoftSkill" }));
    }
  }, [formData.ac_type]);

  useEffect(() => {
    if (!formData.ac_status) {
      setFormData((prev) => ({
        ...prev,
        ac_status: "Private", // ✅ ตั้งค่าเริ่มต้นเป็น "Private"
      }));
    }
  }, [formData.ac_status]);

  const [msg, setMsg] = useState("ร่าง");

  useEffect(() => {
    if (formData.ac_status == "Public") {
      setMsg("สร้าง");
    } else {
      setMsg("ร่าง");
    }
  }, [formData.ac_status]);

  return (
    <>
      <div className="justify-items-center">
        <div
          className={`w-320 mx-auto ml-2xl mt-5 p-6 border bg-white border-gray-200 rounded-lg shadow-sm h-435  flex flex-col`}
        >
          <h1 className="text-4xl font-bold mb-11">สร้างกิจกรรมสหกิจ</h1>
          <h1>{isModalOpen.toString()}</h1>
          <Input
            type="text"
            name="ac_name"
            value={formData.ac_name}
            placeholder="ชื่อกิจกรรม"
            onChange={handleChange}
          />
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
                          <input
                            name="ac_end_register_date"
                            type="date"
                            value={endRegisterDate}
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />

                          {/* กรอกเวลาปิดรับลงทะเบียน */}
                          <input
                            type="time"
                            name="ac_end_register_time"
                            value={endRegisterTime}
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
                          <input
                            type="date"
                            name="ac_normal_register_date"
                            value={normalRegisterDate}
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />

                          {/* กรอกเวลาให้นิสิตสถานะ normal ลงทะเบียน */}
                          <input
                            type="time"
                            name="ac_normal_register_time"
                            value={normalRegisterTime}
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
                            type="date"
                            name="ac_start_date"
                            value={startDate}
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />

                          {/* กรอกเวลาเริ่ม */}
                          <input
                            type="time"
                            name="ac_start_time"
                            value={startTime}
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
                            value={endDate}
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                          />
                          {/* กรอกเวลาจบ */}
                          <input
                            type="time"
                            name="ac_end_time"
                            value={endTime}
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
                        value={formData.ac_location_type}
                        onChange={handleChange}
                        className="w-1/2 p-2 border rounded mb-4 border-[#9D9D9D]"
                      >
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
                    value={formData.ac_type || "SoftSkill"} // ✅ กำหนดค่าเริ่มต้นเพื่อป้องกัน undefined
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ac_type: e.target.value,
                      }))
                    }
                    className="w-140 p-2 border rounded mb-4 border-[#9D9D9D]"
                  >
                    <option value="SoftSkill">
                      ชั่วโมงเตรียมความพร้อม (Soft Skill)
                    </option>
                    <option value="HardSkill">
                      ชั่วโมงทักษะทางวิชาการ (Hard Skill)
                    </option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
              </div>

              {/* ช่องกรอกห้องที่ใช้อบรม */}
              <div className="flex space-x-4">
                {/* เลือกชั้น */}
                <div className="w-1/6">
                  <label className="block font-semibold">เลือกชั้น</label>
                  <select
                    value={selectedFloor}
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
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    className={`w-full p-2 border rounded border-[#9D9D9D] ${
                      !selectedFloor ? " cursor-not-allowed" : ""
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
                    value={formData.ac_status}
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
                  value={formData.as_id ?? ""}
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
              {previewImage ? (
                <div className="mt-4 w-200 h-125 border-red-900">
                  <p className="text-sm text-gray-500">
                    ตัวอย่างรูปที่อัปโหลด:
                  </p>
                  <img
                    src={previewImage}
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

              <ConfirmDialog
                isOpen={isModalOpen}
                title="สร้างกิจกรรม"
                message="คุณแน่ใจว่าจะสร้างกิจกรรมที่เป็น Public
            (นิสิตทุกคนในระบบจะเห็นกิจกรรมนี้)"
                onCancel={() => setIsModalOpen(false)}
                type="submit" // ✅ ทำให้เป็นปุ่ม submit
                onConfirm={() => {}}
              />

              {/* ปุ่ม ยกเลิก & สร้าง */}
              <div className="mt-10 flex justify-end items-center space-x-4 px-6 ">
                {/* ปุ่มยกเลิก */}
                <Button
                  type="button"
                  color="red"
                  onClick={() => navigate("/list-activity-admin")}
                >
                  ยกเลิก
                </Button>

                {/* ปุ่มสร้าง */}
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                    console.log("clicked");
                  }}
                  color="blue"
                >
                  {msg}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateActivityAdmin;
