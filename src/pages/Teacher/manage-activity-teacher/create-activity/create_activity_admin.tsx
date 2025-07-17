import React, { useState, useEffect, useRef } from "react";
// import { useAssessmentStore } from "../../../../stores/Teacher/assessment_store";
import Loading from "../../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Box } from "@mui/material";
// import { Delete, Add } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material"; // ✅ นำเข้า SelectChangeEvent
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { Activity } from "../../../../types/model";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";

import {
  handleChange,
  validateForm,
  // convertToDate,
} from "./utils/form_utils"; // หรือเปลี่ยน path ให้ตรงกับตำแหน่งจริง
import { handleDateTimeChange as handleDateTimeChangeBase } from "./utils/form_utils";

import { handleChange as formHandleChange } from "./utils/form_utils";
import ActivityInfoSection from "./components/ActivityInfoSection";
import RegisterPeriodSection from "./components/RegisterPeriodSection";
import ActivityTimeSection from "./components/ActivityTimeSection";
import TypeAndLocationSection from "./components/TypeAndLocationSection";
import RoomSelectionSection from "./components/RoomSelectionSection";
// import FoodMenuSection from "./components/FoodMenuSection";

import FoodMultiSelect from "./components/FoodMultiSelection"; // ✅ ใช้ FoodMultiSelect แทน FoodMenuSection
// import AssessmentSection from "./components/AssessmentSection";
import ImageUploadSection from "./components/ImageUploadSection";
import ActionButtonsSection from "./components/ActionButtonsSection";
import DescriptionSection from "./components/DescriptionSection";
import StatusAndSeatSection from "./components/StatusAndSeatSection";
export interface CreateActivityForm extends Partial<Activity> {
  selectedFoods: number[];
}

const CreateActivityAdmin: React.FC = () => {
  const { createActivity, activityLoading } = useActivityStore(); //
  const savedFoods = JSON.parse(localStorage.getItem("selectedFoods") || "[]");
  const [formData, setFormData] = useState<CreateActivityForm>({
  activity_id: undefined,
  activity_name: "",
  presenter_company_name: "",
  description: "",
  type: "Soft",
  seat: undefined,
  recieve_hours: 0,
  event_format: "Onsite",
  activity_status: "Private",
  activity_state: "Not Start",
  create_activity_date: "",
  last_update_activity_date: "",
  start_register_date: "",
  special_start_register_date: "",
  end_register_date: "",
  start_activity_date: "",
  end_activity_date: "",
  image_url: "",
  assessment_id: undefined,
  room_id: undefined,
  start_assessment: "",
  end_assessment: "",
  status: "Active",
  url: "",
  selectedFoods: savedFoods,
});



  const IfBuildingRoom: Record<string, { name: string; capacity: number }[]> = {
    "3": [
      { name: "IF-3M210", capacity: 210 }, // ห้องบรรยาย
      { name: "IF-3C01", capacity: 55 }, // ห้องปฏิบัติการ
      { name: "IF-3C02", capacity: 55 },
      { name: "IF-3C03", capacity: 55 },
      { name: "IF-3C04", capacity: 55 },
    ],
    "4": [
      { name: "IF-4M210", capacity: 210 }, // ห้องบรรยาย
      { name: "IF-4C01", capacity: 55 }, // ห้องปฏิบัติการ
      { name: "IF-4C02", capacity: 55 },
      { name: "IF-4C03", capacity: 55 },
      { name: "IF-4C04", capacity: 55 },
    ],
    "5": [
      { name: "IF-5M210", capacity: 210 }, // ห้องบรรยาย
    ],
    "11": [
      { name: "IF-11M280", capacity: 280 }, // ห้องบรรยาย
    ],
  };

  const navigate = useNavigate();
  // const { assessments, fetchAssessments } = useAssessmentStore();
  const foods = useFoodStore((state) => state.foods); // ✅ ต้องมีตรงนี้ก่อน
  const fetchFoods = useFoodStore((state) => state.fetchFoods);

useEffect(() => {
  fetchFoods(); // ✅ เรียก API หรือโหลดรายการอาหาร
}, []);


  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [seatCapacity, setSeatCapacity] = useState<string>(""); // ✅ เก็บจำนวนที่นั่งของห้องที่เลือก
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFloorChange = (event: SelectChangeEvent) => {
    setSelectedFloor(event.target.value);
    setSelectedRoom(""); // ✅ รีเซ็ตห้องเมื่อเปลี่ยนชั้น
    setSeatCapacity(""); // ✅ รีเซ็ตที่นั่งเมื่อเปลี่ยนชั้น
  };

  const handleRoomChange = (event: SelectChangeEvent) => {
    setSelectedRoom(event.target.value);

    // ✅ ค้นหา `capacity` ของห้องที่เลือก
    const selectedRoomObj = IfBuildingRoom[selectedFloor]?.find(
      (room) => room.name === event.target.value,
    );

    const newSeatCapacity = selectedRoomObj ? selectedRoomObj.capacity : "";

    setSeatCapacity(newSeatCapacity === "" ? "" : String(newSeatCapacity));
    // ✅ อัปเดตจำนวนที่นั่ง

    setFormData((prev) => ({
      ...prev,
      ac_room: event.target.value, // ✅ บันทึกห้องที่เลือก
      ac_seat: newSeatCapacity.toString(), // ✅ บันทึกจำนวนที่นั่ง
    }));
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const uploadImageToCloudinary = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Please upload an image.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ceth-project"); // ✅ ตรวจสอบค่าตรงนี้

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dn5vhwoue/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload image success!", data.secure_url);
    return data.secure_url;
  };

  // const convertToDate = (value: string | null | undefined) =>
  //   value && value.trim() !== "" ? new Date(value) : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData, setErrors)) {
      toast.error("กรุณากรอกข้อมูลให้ถูกต้องก่อนส่งฟอร์ม!");
      return;
    }

    if (imageFile) {
      await uploadImageToCloudinary(imageFile);
    }

    let acRecieveHours = formData.recieve_hours
      ? Number(formData.recieve_hours)
      : 0;

    if (
      formData.event_format !== "Course" &&
      formData.start_activity_date &&
      formData.end_activity_date
    ) {
      const start = dayjs(formData.start_activity_date);
      const end = dayjs(formData.end_activity_date);
      const duration = end.diff(start, "hour", true); // ✅ คำนวณเป็นชั่วโมง (รวมเศษทศนิยม)
      acRecieveHours = duration > 0 ? duration : 0; // ✅ ป้องกันค่าติดลบ
    }

    if (!formData.start_register_date) {
      toast.error("กรุณาเลือกวันเวลาเริ่มลงทะเบียน");
      return;
    }

    let startRegister = dayjs(formData.start_register_date ?? "").toDate();
    if (formData.activity_status == "Public") {
      startRegister = new Date(); // ไม่ต้องใช้ dayjs ก็ได้
    }

    console.log("🚀 Data ที่ส่งไป store:", formData);

    try {
      await createActivity(formData);
      navigate("/list-activity-admin");
    } catch (error) {
      console.error("❌ Error creating activity:", error);
      toast.error("Create failed!");
    }
  };

  // const addFoodOption = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     ac_food: [
  //       ...(prev.selectedFoods ?? []),
  //       `เมนู ${prev.selectedFoods?.length ?? 0 + 1}`,
  //     ],
  //   }));
  // };


  function addFoodOption() {
  setFormData((prev) => ({
    ...prev,
    selectedFoods: [...prev.selectedFoods, 0], // ✅ เพิ่มค่า food_id เช่น 0
  }));
}

const hasAdded = useRef(false);

useEffect(() => {
   if (
    formData.event_format === "Onsite" &&
    foods.length > 0 &&
    formData.selectedFoods.length === 0 &&
    savedFoods.length === 0 && // ✅ ป้องกัน restore เมนูเดียวหลัง refresh
    !hasAdded.current
  ) {
    hasAdded.current = true;
    addFoodOption();
  }
}, [formData.event_format, foods, formData.selectedFoods]);

useEffect(() => {
  if (formData.selectedFoods.length > 0) {
    localStorage.setItem("selectedFoods", JSON.stringify(formData.selectedFoods));
  }
}, [formData.selectedFoods]);




  // ฟังก์ชันแก้ไขเมนูอาหาร

  const updateFoodOption = (index: number, newFoodId: number) => {
  const updated = [...formData.selectedFoods];
  updated[index] = newFoodId;
  setFormData((prev) => ({
    ...prev,
    selectedFoods: updated,
  }));
};


  // ฟังก์ชันลบเมนูอาหาร
  const removeFoodOption = (index: number) => {
    const updatedFoodOptions = formData.selectedFoods?.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, selectedFoods: updatedFoodOptions }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("ไฟล์ขนาดใหญ่เกินไป (ต้องไม่เกิน 5MB)");
        return;
      }

      // ✅ แสดงตัวอย่างรูปภาพ
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      // ✅ เก็บไฟล์ไว้ใน `ac_image_url`
      setFormData((prev) => ({
        ...prev,
        ac_image_url: file, // ✅ ตอนนี้เก็บเป็น File
      }));
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   console.log("Fetching assessments..."); // ✅ ตรวจสอบว่า useEffect ทำงาน
  //   fetchAssessments();
  // }, []);

  // useEffect(() => {
  //   console.log("Assessments:", assessments); // ✅ ตรวจสอบว่า assessments มีค่าหรือไม่
  // }, [assessments]);

  const handleFormChange = (e: React.ChangeEvent<any> | SelectChangeEvent) => {
    formHandleChange(e, setFormData);
  };

  // ✅ Wrapper ที่ fix setFormData
  const handleDateTimeChange = (name: string, newValue: Dayjs | null) => {
    handleDateTimeChangeBase(name, newValue, setFormData);
  };

  return (
    <>
      {activityLoading ? (
        <Loading />
      ) : (
        <Box className="justify-items-center">
          <div
            className={`w-320 mx-auto ml-2xl mt-5 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-sm min-h-screen flex flex-col`}
          >
            <h1 className="text-4xl font-bold mb-11">สร้างกิจกรรมสหกิจ</h1>
            <form onSubmit={handleSubmit} className="space-y-10 flex-grow">
              <div>
                {/* แถวแรก: ชื่อกิจกรรม + วันเวลาปิด/เปิดลงทะเบียน */}
                <div className="flex space-x-6  ">
                  <ActivityInfoSection
                    formData={formData}
                    handleChange={handleFormChange} // ✅ รับได้ 1 argument ตาม type ที่ต้องการ
                  />
                  <RegisterPeriodSection
                    formData={formData}
                    handleDateTimeChange={handleDateTimeChange}
                  />
                </div>

                {/* แถวสอง: คำอธิบาย + วันเวลาการดำเนินกิจกรรม + จำนวนชั่วโมง */}
                <div className="flex space-x-6 ">
                  <DescriptionSection
                    formData={formData}
                    handleChange={handleFormChange}
                  />

                  <ActivityTimeSection
                    formData={formData}
                    setFormData={setFormData}
                    handleDateTimeChange={handleDateTimeChange}
                  />
                </div>

                <TypeAndLocationSection
                  formData={formData}
                  handleChange={(e) => handleChange(e, setFormData)}
                  setSelectedFloor={setSelectedFloor}
                  setSelectedRoom={setSelectedRoom}
                  setSeatCapacity={setSeatCapacity}
                />

                <RoomSelectionSection
                  formData={formData}
                  selectedFloor={selectedFloor}
                  selectedRoom={selectedRoom}
                  IfBuildingRoom={IfBuildingRoom}
                  handleFloorChange={handleFloorChange}
                  handleRoomChange={handleRoomChange}
                />

                <StatusAndSeatSection
                  formData={formData}
                  seatCapacity={seatCapacity}
                  handleChange={handleFormChange}
                  setSeatCapacity={setSeatCapacity}
                  selectedRoom={selectedRoom}
                />

                {/* <FoodMenuSection
                  formData={formData}
                  addFoodOption={addFoodOption}
                  removeFoodOption={removeFoodOption}
                  updateFoodOption={updateFoodOption}
                /> */}

<div className="mt-6 max-w-xl w-full">
  <label className="block font-semibold">อาหาร *</label>
                <FoodMultiSelect
  foods={foods}
  selectedFoodIds={formData.selectedFoods}
  setSelectedFoodIds={(newIds) => {
  localStorage.setItem("selectedFoods", JSON.stringify(newIds)); // ✅ sync ทันที
  setFormData((prev) => ({ ...prev, selectedFoods: newIds }));
}}

/>
</div>

                

                {/* <AssessmentSection
                  formData={formData}
                  assessments={assessments}
                  handleChange={handleFormChange}
                  handleDateTimeChange={handleDateTimeChange}
                /> */}

                <ImageUploadSection
                  previewImage={previewImage}
                  handleFileChange={handleFileChange}
                />

                <ActionButtonsSection
                  formStatus={formData.activity_status ?? "Private"}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              </div>
              
            </form>
          </div>
        </Box>
      )}
    </>
  );
};

export default CreateActivityAdmin;
