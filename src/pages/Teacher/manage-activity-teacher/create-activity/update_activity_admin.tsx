import React, { useState, useEffect, useRef } from "react";
import { useAssessmentStore } from "../../../../stores/Teacher/assessment.store";
import Loading from "../../../../components/Loading";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Box } from "@mui/material";
// import { Delete, Add } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material"; // ✅ นำเข้า SelectChangeEvent
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { Activity } from "../../../../types/model";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import { useRoomStore } from "../../../../stores/Teacher/room.store";

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
import AssessmentSection from "./components/AssessmentSection";
import ImageUploadSection from "./components/ImageUploadSection";
import ActionButtonsSection from "./components/ActionButtonsSection";
import DescriptionSection from "./components/DescriptionSection";
import StatusAndSeatSection from "./components/StatusAndSeatSection";
import ActivityLink from "./components/ActivityLink"; // ✅ นำเข้า ActivityLink
import {
  useSecureParams,
  extractSecureParam,
} from "../../../../routes/secure/SecureRoute";


export interface CreateActivityForm extends Partial<Activity> {
  selectedFoods: number[];
}

const CreateActivityAdmin: React.FC = () => {
  const { createActivity, activityLoading, fetchActivity, activity, updateActivity } = useActivityStore(); //
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

  const navigate = useNavigate();
  const location = useLocation();
  const params = useSecureParams();
  
  // 🔐 ดึง ID จาก URL ที่เข้ารหัส
  const finalActivityId = extractSecureParam(params, 'id', 0);

  // ✅ ฟังก์ชันตรวจสอบว่าเวลาปัจจุบันเลย start_activity_date แล้วหรือยัง
  const isActivityStarted = () => {
    if (!formData.start_activity_date) return false;
    const now = dayjs();
    const startTime = dayjs(formData.start_activity_date);
    return now.isAfter(startTime) || now.isSame(startTime);
  };

  // ✅ ฟังก์ชันตรวจสอบว่าแก้ไขได้หรือไม่
  const isFieldEditable = (fieldName: string) => {
    if (!isActivityStarted()) return true; // ถ้ายังไม่เริ่มกิจกรรม แก้ไขได้ทุก field
    
    // ถ้าเริ่มกิจกรรมแล้ว แก้ไขได้แค่ end_assessment
    return fieldName === 'end_assessment';
  };

  const { assessments, fetchAssessments } = useAssessmentStore();
  const foods = useFoodStore((state) => state.foods); // ✅ ต้องมีตรงนี้ก่อน
  const fetchFoods = useFoodStore((state) => state.fetchFoods);
  const { rooms, fetchRooms } = useRoomStore();

  // ✅ ดึงข้อมูล activity เมื่อ component mount
  useEffect(() => {
    if (finalActivityId) {
      console.log("📥 Fetching activity for update:", finalActivityId);
      fetchActivity(finalActivityId);
    }
  }, [finalActivityId, fetchActivity]);

  // ✅ อัปเดต form เมื่อได้ข้อมูล activity
  useEffect(() => {
    if (activity) {
      console.log("📝 Populating form with activity data:", activity);
      console.log("🍽️ Activity foods:", (activity as any).foods);
      console.log("🍽️ Activity activityFood:", (activity as any).activityFood);
      setFormData({
        activity_id: activity.activity_id,
        activity_name: activity.activity_name || "",
        presenter_company_name: activity.presenter_company_name || "",
        description: activity.description || "",
        type: activity.type || "Soft",
        seat: activity.event_format === "Course" ? 0 : activity.seat, // ✅ เซ็ตเป็น 0 ถ้าเป็น Course
        recieve_hours: activity.recieve_hours || 0,
        event_format: activity.event_format || "Onsite",
        activity_status: activity.activity_status || "Private",
        activity_state: activity.activity_state || "Not Start",
        create_activity_date: activity.create_activity_date || "",
        last_update_activity_date: activity.last_update_activity_date || "",
        start_register_date: activity?.start_register_date ? convertUTCToLocal(activity.start_register_date) : "",
        special_start_register_date: activity?.special_start_register_date ? convertUTCToLocal(activity.special_start_register_date) : "",
        end_register_date: activity?.end_register_date ? convertUTCToLocal(activity.end_register_date) : "",
        start_activity_date: activity?.start_activity_date ? convertUTCToLocal(activity.start_activity_date) : "",
        end_activity_date: activity?.end_activity_date ? convertUTCToLocal(activity.end_activity_date) : "",
        image_url: activity.image_url || "",
        assessment_id: activity.event_format === "Course" ? undefined : activity.assessment_id, // ✅ ล้างค่าแบบประเมินถ้าเป็น Course
        room_id: activity.room_id,
        start_assessment: activity.event_format === "Course" ? "" : (activity?.start_assessment ? convertUTCToLocal(activity.start_assessment) : ""), // ✅ ล้างค่าวันเริ่มประเมินถ้าเป็น Course
        end_assessment: activity.event_format === "Course" ? "" : (activity?.end_assessment ? convertUTCToLocal(activity.end_assessment) : ""), // ✅ ล้างค่าวันสิ้นสุดประเมินถ้าเป็น Course
        status: activity.status || "Active",
        url: activity.url || "",
        selectedFoods: (activity as any).foods?.map((food: any) => food.food_id) || savedFoods,
      });

      // ✅ อัปเดต preview image เมื่อมีรูปภาพ
      if (activity.image_url && typeof activity.image_url === 'string') {
        setPreviewImage(activity.image_url);
      }

      // ✅ อัปเดตห้องที่เลือก
      if (activity.room_id) {
        const selectedRoom = rooms.find(room => room.room_id === activity.room_id);
        if (selectedRoom) {
          setSelectedFloor(selectedRoom.floor);
          setSelectedRoom(selectedRoom.room_name);
          setSeatCapacity(selectedRoom.seat_number?.toString() || "");
        }
      }
    }
  }, [activity, rooms]);


  // const IfBuildingRoom: Record<string, { name: string; capacity: number }[]> = {
  //   "3": [
  //     { name: "IF-3M210", capacity: 210 }, // ห้องบรรยาย
  //     { name: "IF-3C01", capacity: 55 }, // ห้องปฏิบัติการ
  //     { name: "IF-3C02", capacity: 55 },
  //     { name: "IF-3C03", capacity: 55 },
  //     { name: "IF-3C04", capacity: 55 },
  //   ],
  //   "4": [
  //     { name: "IF-4M210", capacity: 210 }, // ห้องบรรยาย
  //     { name: "IF-4C01", capacity: 55 }, // ห้องปฏิบัติการ
  //     { name: "IF-4C02", capacity: 55 },
  //     { name: "IF-4C03", capacity: 55 },
  //     { name: "IF-4C04", capacity: 55 },
  //   ],
  //   "5": [
  //     { name: "IF-5M210", capacity: 210 }, // ห้องบรรยาย
  //   ],
  //   "11": [
  //     { name: "IF-11M280", capacity: 280 }, // ห้องบรรยาย
  //   ],
  // };

  useEffect(() => {
  fetchRooms(); // ✅ โหลดข้อมูลห้องเมื่อ component mount
}, []);

useEffect(() => {
  fetchFoods(); // ✅ เรียก API หรือโหลดรายการอาหาร
}, []);

useEffect(() => {
    fetchAssessments(); // ✅ โหลดข้อมูลเมื่อ component mount
  }, []);



  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [seatCapacity, setSeatCapacity] = useState<string>(""); // ✅ เก็บจำนวนที่นั่งของห้องที่เลือก
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const uniqueFloors = Array.from(new Set(rooms.map((r) => r.floor))).sort();

  const filteredRooms = rooms.filter((r) => r.floor === selectedFloor);


  // const handleFloorChange = (event: SelectChangeEvent) => {
  //   setSelectedFloor(event.target.value);
  //   setSelectedRoom(""); // ✅ รีเซ็ตห้องเมื่อเปลี่ยนชั้น
  //   setSeatCapacity(""); // ✅ รีเซ็ตที่นั่งเมื่อเปลี่ยนชั้น
  // };

  // const handleRoomChange = (event: SelectChangeEvent) => {
  //   setSelectedRoom(event.target.value);

  //   // ✅ ค้นหา `capacity` ของห้องที่เลือก
  //   const selectedRoomObj = IfBuildingRoom[selectedFloor]?.find(
  //     (room) => room.name === event.target.value,
  //   );

  //   const newSeatCapacity = selectedRoomObj ? selectedRoomObj.capacity : "";

  //   setSeatCapacity(newSeatCapacity === "" ? "" : String(newSeatCapacity));
  //   // ✅ อัปเดตจำนวนที่นั่ง

  //   setFormData((prev) => ({
  //     ...prev,
  //     ac_room: event.target.value, // ✅ บันทึกห้องที่เลือก
  //     ac_seat: newSeatCapacity.toString(), // ✅ บันทึกจำนวนที่นั่ง
  //   }));
  // };

  const handleFloorChange = (event: SelectChangeEvent) => {
  setSelectedFloor(event.target.value);
  setSelectedRoom("");
  setSeatCapacity("");
};

const handleRoomChange = (event: SelectChangeEvent) => {
  const roomName = event.target.value;
  setSelectedRoom(roomName);

  const selectedRoomObj = filteredRooms.find((r) => r.room_name === roomName);
  const newSeatCapacity = selectedRoomObj?.seat_number ?? "";

  setSeatCapacity(newSeatCapacity.toString());

  setFormData((prev) => ({
    ...prev,
    room_id: selectedRoomObj?.room_id,
    seat: typeof newSeatCapacity === "string"
      ? parseInt(newSeatCapacity)
      : newSeatCapacity, // ✅ แปลงให้เป็น number
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
      if (finalActivityId) {
        // ✅ อัปเดตกิจกรรมที่มีอยู่
        console.log("🔄 Updating existing activity:", finalActivityId);
        
        // ✅ เตรียมข้อมูลให้ตรงกับ backend requirements
        const updateData = {
          ...formData,
          // ✅ ใช้ acRecieveHours ที่คำนวณแล้วแทน formData.recieve_hours
          recieve_hours: acRecieveHours,
          // แก้ไข floor ให้เป็น string (ใช้จาก selectedFloor หรือจาก room ที่เลือก)
          floor: selectedFloor || (formData.room_id ? rooms.find(r => r.room_id === formData.room_id)?.floor || "" : ""),
          // แก้ไข room_id ให้เป็น integer
          room_id: formData.room_id ? Number(formData.room_id) : null,
          // แก้ไข seat ให้เป็น integer และไม่เป็น null
          seat: formData.seat ? Number(formData.seat) : 0,
          // แก้ไข foodIds ให้เป็น array และไม่ว่าง (backend ต้องการ foodIds)
          foodIds: Array.isArray(formData.selectedFoods) && formData.selectedFoods.length > 0 ? formData.selectedFoods : [],
        };

        // ✅ จัดการ image_url แยก (ไม่ส่งถ้าไม่มีรูปภาพ)
        if (typeof formData.image_url === 'string' && formData.image_url.trim() !== "") {
          updateData.image_url = formData.image_url;
        }
        
        console.log("🚀 Data ที่ส่งไป store:", updateData);
        await updateActivity(updateData as Activity);
        toast.success("อัปเดตกิจกรรมสำเร็จ!");
      } else {
        // ✅ สร้างกิจกรรมใหม่
        console.log("➕ Creating new activity");
        await createActivity(formData);
        toast.success("สร้างกิจกรรมสำเร็จ!");
      }
      // navigate("/list-activity-admin");
    } catch (error) {
      console.error("❌ Error saving activity:", error);
      toast.error("บันทึกกิจกรรมไม่สำเร็จ!");
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
    savedFoods.length === 0 && // ✅ ต้องมี check แบบนี้
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // ✅ แสดงตัวอย่างรูปภาพทันที
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewImage(localPreviewUrl);

      try {
        // ✅ อัปโหลดไปยัง Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(file);

        // ✅ เซ็ต URL กลับเข้า formData
        setFormData((prev) => ({
          ...prev,
          image_url: cloudinaryUrl,
        }));

        toast.success("📸 อัปโหลดรูปภาพสำเร็จ!");
      } catch (error) {
        console.error("❌ Upload failed:", error);
        toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
      }
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
    
    // ✅ ถ้าเปลี่ยน event_format เป็น Course ให้เซ็ต seat เป็น 0 และล้างค่าแบบประเมิน
    if (e.target.name === "event_format" && e.target.value === "Course") {
      setFormData((prev) => ({
        ...prev,
        seat: 0,
        assessment_id: undefined, // ✅ ล้างค่าแบบประเมิน
        start_assessment: "", // ✅ ล้างค่าวันเริ่มประเมิน
        end_assessment: "", // ✅ ล้างค่าวันสิ้นสุดประเมิน
      }));
    }
  };

  // ✅ Wrapper ที่ fix setFormData
  const handleDateTimeChange = (name: string, newValue: Dayjs | null) => {
    handleDateTimeChangeBase(name, newValue, setFormData);
  };

  // ✅ ฟังก์ชันแปลง UTC เป็น local time
  const convertUTCToLocal = (utcString: string): string => {
    if (!utcString) return "";
    try {
      const date = new Date(utcString);
      return date.toLocaleString('sv-SE').replace(' ', 'T');
    } catch (error) {
      console.error("❌ Error converting UTC to local:", error);
      return utcString;
    }
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
            <h1 className="text-4xl font-bold mb-11">
              {finalActivityId ? "แก้ไขกิจกรรมสหกิจ" : "สร้างกิจกรรมสหกิจ"}
            </h1>
            
            {/* ✅ แสดงข้อความแจ้งเตือนเมื่อกิจกรรมเริ่มแล้ว */}
            {isActivityStarted() && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-yellow-800 font-medium">
                    ⚠️ กิจกรรมได้เริ่มดำเนินการแล้ว สามารถแก้ไขได้เฉพาะ "วันสิ้นสุดการประเมิน" เท่านั้น
                  </span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-10 flex-grow">
              <div>
                {/* แถวแรก: ชื่อกิจกรรม + วันเวลาปิด/เปิดลงทะเบียน */}
                <div className="flex space-x-6  ">
                  <ActivityInfoSection
                    formData={formData}
                    handleChange={handleFormChange} // ✅ รับได้ 1 argument ตาม type ที่ต้องการ
                    disabled={isActivityStarted()}
                  />

                  <RegisterPeriodSection
                    formData={formData}
                    handleDateTimeChange={handleDateTimeChange}
                    disabled={isActivityStarted()}
                    isEditMode={!!finalActivityId}
                  />
                  
                </div>

                {/* แถวสอง: คำอธิบาย + วันเวลาการดำเนินกิจกรรม + จำนวนชั่วโมง */}
                {/* <div className="flex space-x-6 ">
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
                /> */}

                <div className="flex space-x-6">
  <DescriptionSection
    formData={formData}
    handleChange={handleFormChange}
    disabled={isActivityStarted()}
  />

  <div className="flex flex-col space-y-3">
    <ActivityTimeSection
      formData={formData}
      setFormData={setFormData}
      handleDateTimeChange={handleDateTimeChange}
      disabled={isActivityStarted()}
    />

    <TypeAndLocationSection
      formData={formData}
      handleChange={(e) => handleChange(e, setFormData)}
      setSelectedFloor={setSelectedFloor}
      setSelectedRoom={setSelectedRoom}
      setSeatCapacity={setSeatCapacity}
      disabled={isActivityStarted()}
    />
  </div>
</div>


<div className="flex space-x-6">
                <RoomSelectionSection
                  formData={formData}
                  selectedFloor={selectedFloor}
                  selectedRoom={selectedRoom}
                  rooms={rooms}
                  handleFloorChange={handleFloorChange}
                  handleRoomChange={handleRoomChange}
                  handleChange={handleFormChange}
                  disabled={isActivityStarted()}
                />

                <ActivityLink formData={formData} handleChange={handleFormChange} disabled={isActivityStarted()} />
                </div>

                <StatusAndSeatSection
                  formData={formData}
                  seatCapacity={seatCapacity}
                  handleChange={handleFormChange}
                  setSeatCapacity={setSeatCapacity}
                  selectedRoom={selectedRoom}
                  setFormData={setFormData}
                  disabled={isActivityStarted()}
                />

                <div className="mt-6 max-w-xl w-full">
                  <label className="block font-semibold">อาหาร *</label>
                  <FoodMultiSelect
                    foods={foods}
                    selectedFoodIds={formData.selectedFoods}
                    setSelectedFoodIds={(newIds) => {
                      console.log("🍽️ Food selection changed:", { old: formData.selectedFoods, new: newIds });
                      localStorage.setItem("selectedFoods", JSON.stringify(newIds)); // ✅ sync ทันที
                      setFormData((prev) => ({ ...prev, selectedFoods: newIds }));
                    }}
                    disabled={formData.event_format !== "Onsite"}
                  />
                </div>

                {/* Debug Section */}
                {import.meta.env.DEV && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">🔍 Debug Food Info:</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Selected Foods:</strong> {JSON.stringify(formData.selectedFoods)}</p>
                      <p><strong>Activity Foods:</strong> {JSON.stringify((activity as any)?.foods)}</p>
                      <p><strong>Activity ActivityFood:</strong> {JSON.stringify((activity as any)?.activityFood)}</p>
                      <p><strong>Total Foods Available:</strong> {foods.length}</p>
                      <p><strong>Event Format:</strong> {formData.event_format}</p>
                    </div>
                  </div>
                )}

                

                <AssessmentSection
                  formData={formData}
                  assessments={assessments}
                  handleChange={handleFormChange}
                  handleDateTimeChange={handleDateTimeChange}
                  disabled={isActivityStarted()}
                />

                <ImageUploadSection
                  previewImage={previewImage}
                  handleFileChange={handleFileChange}
                  disabled={isActivityStarted()}
                />

                <ActionButtonsSection
                  formStatus={formData.activity_status ?? "Private"}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  isEditMode={!!finalActivityId}
                  originalStatus={activity?.activity_status ?? "Private"}
                  onSubmit={() => {
                    // ✅ สร้าง fake event object ที่มี preventDefault method
                    const fakeEvent = {
                      preventDefault: () => {},
                    } as React.FormEvent;
                    handleSubmit(fakeEvent);
                  }}
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
