import React, { useState } from "react";
import { ImagePlus } from "lucide-react";
import { useActivityStore } from "../../../stores/Test/manage_activity_store"; // ✅ นำเข้า Zustand Store
import Button from "../../../components/Button";
import { Activity } from "../../../stores/Test/manage_activity_store"
interface FormData {
  activityName: string;
  companyOrSpeaker: string;
  description: string;
  category: string;
  roomFloor: string;
  roomNumber: string;
  status: string;
  seats: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  foodOptions: string[];
  selectedFoods: string[];
  evaluationType: string;
  file: File | null;
}

const ManageActivityAdmin: React.FC = () => {
  const { createActivity } = useActivityStore(); //
  const [formData, setFormData] = useState<FormData>({
    activityName: "a",
    companyOrSpeaker: "a",
    description: "aaa",
    category: "Soft Skill",
    roomFloor: "1",
    roomNumber: "2",
    status: "Private",
    seats: "50",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    foodOptions: ["เมนู 1", "เมนู 2"],
    selectedFoods: [], // อาหารที่เลือก
    evaluationType: "แบบประเมิน 1",
    file: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "seats") {
      // อนุญาตให้เป็นช่องว่าง (""), ถ้าไม่ใช่ช่องว่างให้ตรวจสอบค่าเป็นตัวเลข
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setFormData((prev) => ({ ...prev, seats: value })); // เก็บค่าเป็น string
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const numericSeats = formData.seats === "" ? 0 : parseInt(formData.seats, 10);
  
    const startDateTime = `${formData.startDate}T${formData.startTime}:00Z`;
    const endDateTime = `${formData.endDate}T${formData.endTime}:00Z`;
  
    const formattedFood: Record<string, string> = {};
    formData.selectedFoods.forEach((food, index) => {
      formattedFood[`menu${index + 1}`] = food;
    });
  
    const activityData: Activity = {
      ac_id: Date.now(),
      ac_name: formData.activityName,
      ac_company_lecturer: formData.companyOrSpeaker,
      ac_description: formData.description,
      ac_type: formData.category,
      ac_room: formData.roomNumber || "Unknown", // ✅ ใส่ค่าเริ่มต้น
      ac_seat: numericSeats || 0, // ✅ ถ้าไม่มีให้ใช้ 0
      ac_food: formattedFood || {}, // ✅ ถ้าไม่มีให้เป็นอ็อบเจกต์ว่าง
      ac_status: [formData.status], // ✅ แปลงเป็น Array // ✅ ถ้าไม่มีให้เป็น "Public"
      ac_start_register: new Date().toISOString(), // ✅ แก้ไขให้เป็นรูปแบบ Date
      ac_start_time: startDateTime,
      ac_end_time: endDateTime,
      ac_image_url: formData.file ? URL.createObjectURL(formData.file) : "https://example.com/default-image.jpg",
      ac_room_floor: "",
      ac_evaluation: "",
      ac_create_date: "",
      ac_end_enrolled_date: "",
      ac_end_register: "",
      ac_registrant_count: 0,
      ac_state: ""
    };
    
  
    console.log("✅ Sending Activity Data:", activityData);
  
    await createActivity(activityData);
  };
  
  
  
  

  const addFoodOption = () => {
    setFormData((prev) => ({
      ...prev,
      foodOptions: [...prev.foodOptions, `เมนู ${prev.foodOptions.length + 1}`],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  // ฟังก์ชันแก้ไขเมนูอาหาร
  const updateFoodOption = (index: number, newValue: string) => {
    const updatedFoodOptions = [...formData.foodOptions];
    updatedFoodOptions[index] = newValue;
    setFormData((prev) => ({ ...prev, foodOptions: updatedFoodOptions }));
  };

  // ฟังก์ชันลบเมนูอาหาร
  const removeFoodOption = (index: number) => {
    const updatedFoodOptions = formData.foodOptions.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, foodOptions: updatedFoodOptions }));
  };

  // ฟังก์ชันเลือก/ยกเลิกการเลือกเมนูอาหาร
  const toggleFoodSelection = (food: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFoods: prev.selectedFoods.includes(food)
        ? prev.selectedFoods.filter((item) => item !== food) // เอาออกถ้าถูกเลือกแล้ว
        : [...prev.selectedFoods, food], // เพิ่มเข้าไปถ้ายังไม่ได้เลือก
    }));
  };

  return (
    <>
      <div className="justify-items-center">
        <div className="w-320 h-385 mx-auto ml-2xl mt-5 bg-white p-6 border border-gray-200 rounded-lg shadow-sm min-h-screen ">
          <h1 className="text-4xl font-bold mb-11">สร้างกิจกรรมสหกิจ</h1>
          <form onSubmit={handleSubmit} className="space-y-4 ">
            {/* scrollbar */}
            <div className="max-h-[800px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 pr-4">
              {/* ช่องกรอกชื่อกิจกรรม */}
              <div>
                <label className="block font-semibold w-50">
                  ชื่อกิจกรรม *
                </label>
                <input
                  type="text"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  className="w-140 p-2 border rounded mb-4 border-[#9D9D9D]"
                  placeholder="ชื่อกิจกรรม"
                  required
                />
              </div>

              <div className="flex space-x-6">
                {/* ช่องกรอกชื่อบริษัท/วิทยากร */}
                <div className="w-1/2">
                  <label className="block font-semibold ">
                    ชื่อบริษัท/วิทยากร *
                  </label>
                  <input
                    type="text"
                    name="companyOrSpeaker"
                    value={formData.companyOrSpeaker}
                    onChange={handleChange}
                    className="w-140 p-2 border rounded mb-4 border-[#9D9D9D]"
                    placeholder="ชื่อบริษัท หรือ วิทยากร ที่มาอบรม"
                    required
                  />
                </div>

                {/* ช่องกรอกวันและเวลาการดำเนินการกิจกรรม */}
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
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                            required
                          />

                          {/* กรอกเวลาเริ่ม */}
                          <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
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
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                            required
                          />
                          {/* กรอกเวลาจบ */}
                          <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-1/2 p-2 border rounded border-[#9D9D9D]"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500  mt-1">End</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ช่องกรอกคำอธิบาย */}
              <div>
                <label className="block font-semibold w-50">
                  คำอธิบายกิจกรรม
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-140 p-2 border rounded mb-4 h-42 border-[#9D9D9D]"
                  placeholder="รายละเอียดกิจกรรม หรือ คำอธิบาย"
                  required
                ></textarea>
              </div>

              {/* ช่องกรอกระเภท */}
              <div>
                <label className="block font-semibold w-50">ประเภท *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-140 p-2 border rounded mb-4 border-[#9D9D9D]"
                >
                  <option value="Soft Skill">
                    ชั่วโมงเตรียมความพร้อม (Soft Skill)
                  </option>
                  <option value="Technical">
                    ชั่วโมงทักษะทางวิชาการ (Technical)
                  </option>
                  <option value="other">อื่นๆ </option>
                </select>
              </div>

              {/* ช่องกรอกห้องที่ใช้อบรม */}
              <div>
                <label className="block font-semibold ">ห้องที่ใช้อบรม</label>

                <div className="flex space-x-2  ">
                  <input
                    type="text"
                    name="roomFloor"
                    value={formData.roomFloor}
                    onChange={handleChange}
                    className="w-30 p-2 border rounded mb-4 border-[#9D9D9D]"
                    placeholder="ชั้นที่"
                  />
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="ml-2 w-106 p-2 border rounded mb-4 border-[#9D9D9D]"
                    placeholder="หมายเลขห้อง"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                {/* ช่องกรอกสถานะ*/}
                <div className="w-1/6">
                  <label className="block font-semibold w-50">สถานะ *</label>
                  <select
                    name="status"
                    value={formData.status}
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
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    className="w-full p-2 border rounded border-[#9D9D9D]"
                    min="1"
                  />
                </div>
              </div>

              {/* ช่องเลือกอาหาร */}
              <div className="w-140  mt-5 bg-white p-6 border border-[#9D9D9D] rounded-lg shadow-sm">
                <label className="block font-semibold mb-2">อาหาร *</label>
                {formData.foodOptions.map((menu, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.selectedFoods.includes(menu)}
                      onChange={() => toggleFoodSelection(menu)}
                      className="w-5 h-5"
                    />
                    {/* อินพุตที่แก้ไขได้ */}
                    <input
                      type="text"
                      value={menu}
                      onChange={(e) => updateFoodOption(index, e.target.value)}
                      className="w-full p-2 border rounded border-[#9D9D9D]"
                    />
                    {/* ปุ่มกากบาทลบเมนู */}
                    <button
                      type="button"
                      onClick={() => removeFoodOption(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFoodOption}
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded mt-2"
                >
                  เพิ่มอาหาร
                </button>
              </div>

              {/* แบบประเมิน */}
              <div className="mt-4 border-[#9D9D9D]">
                <label className="block font-semibold">แบบประเมิน *</label>
                <select
                  name="evaluationType"
                  value={formData.evaluationType}
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
              {formData.file && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    ไฟล์ที่อัปโหลด: {formData.file.name}
                  </p>
                  {formData.file.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="อัปโหลดภาพกิจกรรม"
                      className="mt-2 w-100 h-100 object-cover border rounded-lg shadow"
                    />
                  )}
                </div>
              )}

              {/* แสดงภาพ */}
              <div className="w-full h-80 mt-5 max-w-3xl h-64 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center cursor-default transition pointer-events-none">
                <div className="text-center text-black-400">
                  <ImagePlus size={48} className="mx-auto" />
                  <p className="text-sm mt-2">คลิกเพื่ออัปโหลดรูปภาพ</p>
                </div>
              </div>

              {/* ปุ่ม ยกเลิก & สร้าง */}
              <div className="flex justify-end space-x-4 mt-5">
                <Button color="red">ยกเลิก</Button>
                <Button color="blue" width="100px">
                  สร้าง
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageActivityAdmin;
