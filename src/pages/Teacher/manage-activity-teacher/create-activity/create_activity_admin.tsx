import React, { useState, useEffect, useRef } from "react";
import { useAssessmentStore } from "../../../../stores/Teacher/assessment.store";
import Loading from "../../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Box } from "@mui/material";
// import { Delete, Add } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material"; // ✅ นำเข้า SelectChangeEvent
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher";
import { useSecureLink } from "../../../../routes/secure/SecureRoute";
import { Activity } from "../../../../types/model";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import { useRoomStore } from "../../../../stores/Teacher/room.store";
import roomService from "../../../../service/Teacher/room.service";
import { useLocation } from 'react-router-dom';



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
export interface CreateActivityForm extends Partial<Activity> {
  selectedFoods: number[];
}

const CreateActivityAdmin: React.FC = () => {
  const { createActivity, activityLoading } = useActivityStore(); //
  const { createSecureLink } = useSecureLink();
  const savedFoods = JSON.parse(localStorage.getItem("selectedFoods") || "[]");
  const [formData, setFormData] = useState<CreateActivityForm>({
    activity_name: "",
    presenter_company_name: "",
    description: "",
    type: "Soft",
    seat: 0,
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

  const location = useLocation();
  const fromPage = location.state?.from ?? 'list'; // fallback เป็น list
  const navigate = useNavigate();
  const { assessments, fetchAssessments } = useAssessmentStore();
  const foods = useFoodStore((state) => state.foods); // ✅ ต้องมีตรงนี้ก่อน
  const fetchFoods = useFoodStore((state) => state.fetchFoods);
  const {
    rooms,
    fetchRooms,
    roomConflicts,
    checkingAvailability,
    checkRoomConflicts,
    clearAvailabilityCheck
  } = useRoomStore();



  // ✅ เพิ่ม useEffect เพื่อดึงข้อมูลจาก location.state
  useEffect(() => {
    // Check if location state exists and is not empty
    if (location.state) {
      const { start_activity_date, end_activity_date, from } = location.state as {
        start_activity_date?: string;
        end_activity_date?: string;
        from?: string;
      };

      // If start and end dates are passed, update the form data
      if (start_activity_date && end_activity_date) {
        setFormData((prev: CreateActivityForm) => ({
          ...prev,
          start_activity_date: start_activity_date,
          end_activity_date: end_activity_date,
        }));
      }
    }
  }, [location.state]); // ✅ Dependency array เพื่อให้ effect ทำงานเมื่อ location.stat

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
    // ✅ ไม่รีเซ็ต seatCapacity เพื่อให้สามารถกำหนดเองได้สำหรับ Online
    if (formData.event_format !== "Online") {
      setSeatCapacity("");
    }
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

    // ✅ ตรวจสอบ room conflicts เมื่อเลือกห้องและมีวันที่เวลา
    if (selectedRoomObj?.room_id && formData.start_activity_date && formData.end_activity_date) {
      checkRoomConflicts(
        selectedRoomObj.room_id,
        formData.start_activity_date,
        formData.end_activity_date
      );
    }
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

    // ✅ ตรวจสอบ room conflicts ก่อนบันทึก
    if (formData.event_format === "Onsite" && formData.room_id &&
      formData.start_activity_date && formData.end_activity_date) {
      try {
        const conflicts = await roomService.getRoomConflicts(
          formData.room_id,
          formData.start_activity_date,
          formData.end_activity_date
        );

        if (conflicts.length > 0) {
          toast.error("ห้องที่เลือกถูกใช้งานในช่วงเวลานี้ กรุณาเลือกห้องอื่นหรือเปลี่ยนเวลา");
          return;
        }
      } catch (error) {
        console.error("❌ Error checking room conflicts:", error);
        toast.error("ไม่สามารถตรวจสอบห้องที่ว่างได้");
        return;
      }
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

    // ✅ ตรวจสอบว่าวันที่และเวลาการดำเนินกิจกรรมต้องห่างกันอย่างน้อย 1 ชั่วโมง
    if (formData.start_activity_date && formData.end_activity_date) {
      const start = dayjs(formData.start_activity_date);
      const end = dayjs(formData.end_activity_date);
      const duration = end.diff(start, "hour", true);

      if (duration < 1) {
        toast.error("❌ วันและเวลาการดำเนินกิจกรรมต้องห่างกันอย่างน้อย 1 ชั่วโมง");
        return;
      }
    }

    if (formData.activity_status === "Public" && !formData.start_register_date) {
      toast.error("กรุณาเลือกวันเวลาเริ่มลงทะเบียน");
      return;
    }


    const formattedStart = formData.start_activity_date
      ? dayjs(formData.start_activity_date).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
      : undefined;

    const formattedEnd = formData.end_activity_date
      ? dayjs(formData.end_activity_date).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
      : undefined;


    // ✅ กฎใหม่: ถ้า Public และเป็น Onsite/Online
    const isPublic = formData.activity_status === "Public";
    const isOnsiteOrOnline = formData.event_format === "Onsite" || formData.event_format === "Online";

    if (
      isPublic &&
      isOnsiteOrOnline &&
      formData.special_start_register_date &&
      formData.start_register_date
    ) {
      const diffMinutes = dayjs(formData.start_register_date).diff(
        dayjs(formData.special_start_register_date),
        "minute"
      );
      if (diffMinutes < 60) {
        toast.error("❌ วัน/เวลาเปิดลงทะเบียนต้องห่างจากวันลงทะเบียนพิเศษอย่างน้อย 1 ชั่วโมง");
        return;
      }
    }

    if (
      isPublic &&
      isOnsiteOrOnline &&
      formData.end_register_date &&
      formData.start_activity_date
    ) {
      const endReg = dayjs(formData.end_register_date).startOf("day");
      const startAct = dayjs(formData.start_activity_date).startOf("day");
      if (!startAct.isAfter(endReg)) {
        toast.error("❌ วันเริ่มกิจกรรมต้องเป็นวันถัดไปหลังวันปิดลงทะเบียน (อย่างน้อย 1 วัน)");
        return;
      }
    }

    if (isPublic && isOnsiteOrOnline && formData.start_assessment && formData.end_activity_date) {
      const startAsm = dayjs(formData.start_assessment);
      const endAct = dayjs(formData.end_activity_date);
      if (startAsm.isBefore(endAct)) {
        toast.error("❌ วันที่และเวลาเปิดให้ทำแบบประเมินต้องอยู่วันที่เดียวกันหรือหลังวันที่จบกิจกรรมและเวลาต้องอยู่เท่ากับหรือหลังจากเวลาจบกิจกรรม");
        return;
      }
    }

    console.log("🚀 Data ที่ส่งไป store:", formData);

    try {
      // ✅ สร้างข้อมูลใหม่ที่มี recieve_hours ที่คำนวณแล้ว
      const createData = {
        ...formData,
        recieve_hours: acRecieveHours,
        start_activity_date: formattedStart,
        end_activity_date: formattedEnd,
        // ✅ ส่ง foodIds เฉพาะเมื่อ event_format เป็น Onsite และกรอง foodIds ที่ถูกต้อง
        foodIds: formData.event_format === "Onsite" ?
          (Array.isArray(formData.selectedFoods) && formData.selectedFoods.length > 0 ?
            formData.selectedFoods.filter(foodId => foodId > 0) : []) : [],
        // ✅ ลบ selectedFoods ออกจาก request เมื่อไม่ใช่ Onsite
        selectedFoods: formData.event_format === "Onsite" ? formData.selectedFoods : [],
      };

      const result = await createActivity(createData);
      console.log("✅ Activity created successfully:", result);

      // ✅ ส่งคืน activity_id เพื่อใช้ในการ navigate
      return result;
    } catch (error) {
      console.error("❌ Error creating activity:", error);
      toast.error("Create failed!");
      throw error; // ✅ re-throw เพื่อให้ ActionButtonsSection รู้ว่าเกิด error
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
      selectedFoods: [...prev.selectedFoods, -1], // ✅ ใช้ -1 เป็น placeholder สำหรับ food ที่ยังไม่ได้เลือก
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

    // ✅ รีเซ็ต hasAdded เมื่อเปลี่ยน event_format
    if (formData.event_format !== "Onsite") {
      hasAdded.current = false;
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

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const file = e.target.files[0];

  //     if (!file.type.startsWith("image/")) {
  //       toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
  //       return;
  //     }

  //     if (file.size > 5 * 1024 * 1024) {
  //       toast.error("ไฟล์ขนาดใหญ่เกินไป (ต้องไม่เกิน 5MB)");
  //       return;
  //     }

  //     // ✅ แสดงตัวอย่างรูปภาพ
  //     const imageUrl = URL.createObjectURL(file);
  //     setPreviewImage(imageUrl);

  //     // ✅ เก็บไฟล์ไว้ใน `ac_image_url`
  //     setFormData((prev) => ({
  //       ...prev,
  //       image_url: file, // ✅ ตอนนี้เก็บเป็น File
  //     }));
  //   }
  // };

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

    // ✅ ถ้าเปลี่ยน event_format ไม่ใช่ Onsite ให้ล้างข้อมูลอาหาร
    if (e.target.name === "event_format" && e.target.value !== "Onsite") {
      setFormData((prev) => ({
        ...prev,
        selectedFoods: [], // ✅ ล้างข้อมูลอาหาร
      }));
      localStorage.removeItem("selectedFoods"); // ✅ ล้าง localStorage ด้วย
      console.log("🧹 Cleared selectedFoods for non-Onsite event format");
    }

    // ✅ ล้าง room conflicts เมื่อเปลี่ยน event_format
    if (e.target.name === "event_format") {
      clearAvailabilityCheck();
    }
  };

  // ✅ Wrapper ที่ fix setFormData
  const handleDateTimeChange = (name: string, newValue: Dayjs | null) => {
    handleDateTimeChangeBase(name, newValue, setFormData);

    // ✅ เช็คห้องที่ว่างเฉพาะเมื่อปิด dialog เลือกวันที่และเวลา และเป็น Onsite เท่านั้น
    if (newValue && (name === "start_activity_date" || name === "end_activity_date")) {
      // รอให้ formData อัปเดตก่อน
      setTimeout(() => {
        const updatedFormData = {
          ...formData,
          [name]: newValue.format("YYYY-MM-DD HH:mm:ss")
        };

        // เช็คเฉพาะเมื่อเป็น Onsite และมีข้อมูลครบ
        if (updatedFormData.event_format === "Onsite" &&
          updatedFormData.room_id &&
          updatedFormData.start_activity_date &&
          updatedFormData.end_activity_date) {
          checkRoomConflicts(
            updatedFormData.room_id,
            updatedFormData.start_activity_date,
            updatedFormData.end_activity_date
          );
        } else if (updatedFormData.event_format !== "Onsite") {
          // ล้าง conflicts เมื่อไม่ใช่ Onsite
          clearAvailabilityCheck();
        }
      }, 100);
    }
  };

  // ✅ useEffect เพื่อล้าง conflicts เมื่อเปลี่ยน event_format
  useEffect(() => {
    if (formData.event_format !== "Onsite") {
      clearAvailabilityCheck();
    }
  }, [formData.event_format]);

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
                    backendActivityStatus="Private"
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
                  />

                  <div className="flex flex-col space-y-3">
                    <ActivityTimeSection
                      formData={formData}
                      setFormData={setFormData}
                      handleDateTimeChange={handleDateTimeChange}
                    />

                    <TypeAndLocationSection
                      formData={formData}
                      handleChange={(e) => handleChange(e, setFormData)}
                      setSelectedFloor={setSelectedFloor}
                      setSelectedRoom={setSelectedRoom}
                      setSeatCapacity={setSeatCapacity}
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
                    seatCapacity={seatCapacity}
                    setSeatCapacity={setSeatCapacity}
                    roomConflicts={roomConflicts}
                    checkingAvailability={checkingAvailability}
                    hasTimeConflict={roomConflicts.length > 0}
                  />

                  <ActivityLink formData={formData} handleChange={handleFormChange} />
                </div>

                <StatusAndSeatSection
                  formData={formData}
                  seatCapacity={seatCapacity}
                  handleChange={handleFormChange}
                  setSeatCapacity={setSeatCapacity}
                  selectedRoom={selectedRoom}
                  setFormData={setFormData}
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
                    disabled={formData.event_format !== "Onsite"}
                  />
                </div>



                <AssessmentSection
                  formData={formData}
                  assessments={assessments}
                  handleChange={handleFormChange}
                  handleDateTimeChange={handleDateTimeChange}
                />

                <ImageUploadSection
                  previewImage={previewImage}
                  handleFileChange={handleFileChange}
                />

                <ActionButtonsSection
                  formStatus={formData.activity_status ?? "Private"}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  fromPage={fromPage} // ✅ เพิ่มตรงนี้
                  onSubmit={async () => {
                    // ✅ สร้าง fake event object ที่มี preventDefault method
                    const fakeEvent = {
                      preventDefault: () => { },
                    } as React.FormEvent;
                    return await handleSubmit(fakeEvent);
                  }}
                  onSuccess={(activityId) => {
                    // ✅ หลังจากสร้างกิจกรรมสำเร็จ เด้งไปหน้า activity-info-admin
                    console.log("🎯 Navigating to activity info with ID:", activityId);
                    if (activityId && activityId > 0) {
                      const secureUrl = createSecureLink("/activity-info-admin", { id: activityId.toString() });
                      console.log("🔗 Secure URL:", secureUrl);
                      window.location.href = secureUrl;
                    } else {
                      console.error("❌ Invalid activity ID:", activityId);
                    }
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
