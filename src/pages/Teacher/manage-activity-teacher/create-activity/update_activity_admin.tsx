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
import { useSecureLink } from "../../../../routes/secure/SecureRoute";
import { Activity } from "../../../../types/model";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import { useRoomStore } from "../../../../stores/Teacher/room.store";
import { Trash2 } from "lucide-react"; // ✅ เพิ่ม icon ถังขยะ
import ConfirmDialog from "../../../../components/ConfirmDialog"; // ✅ เพิ่ม ConfirmDialog

import {
  handleChange,
  // convertToDate,
} from "./utils/form_utils"; // หรือเปลี่ยน path ให้ตรงกับตำแหน่งจริง
import { handleDateTimeChange as handleDateTimeChangeBase } from "./utils/form_utils";

import { handleChange as formHandleChange, validateForm } from "./utils/form_utils";
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
  const { createSecureLink } = useSecureLink();
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
      
      // 🔍 ตรวจสอบข้อมูล validation จาก URL
      const urlValidationError = extractSecureParam(params, 'validationError', '');
      const urlTargetStatus = extractSecureParam(params, 'targetStatus', '');
      const urlShowValidationErrors = extractSecureParam(params, 'showValidationErrors', false);
      
      console.log("🔍 Validation data from URL:", {
        urlValidationError,
        urlTargetStatus,
        urlShowValidationErrors
      });
      
      // เซ็ตค่า state สำหรับ validation
      setValidationError(urlValidationError);
      setTargetStatus(urlTargetStatus);
      setShowValidationErrors(urlShowValidationErrors);
      
      // เก็บ activity_status จาก Backend
      setBackendActivityStatus(activity.activity_status || "Private");
      
      // ถ้ามี validation error และต้องการเปลี่ยนเป็น Public ให้ตั้งค่า activity_status เป็น Public
      const initialActivityStatus = (urlShowValidationErrors && urlTargetStatus && urlTargetStatus === "Public") 
        ? "Public" 
        : (activity.activity_status || "Private");
      
      setFormData({
        activity_id: activity.activity_id,
        activity_name: activity.activity_name || "",
        presenter_company_name: activity.presenter_company_name || "",
        description: activity.description || "",
        type: activity.type || "Soft",
        seat: activity.event_format === "Course" ? 0 : activity.seat, // ✅ เซ็ตเป็น 0 ถ้าเป็น Course
        recieve_hours: activity.recieve_hours || 0,
        event_format: activity.event_format || "Onsite",
        activity_status: initialActivityStatus, // ใช้ค่าที่ตรวจสอบจาก URL
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // ✅ เพิ่ม state สำหรับ dialog ลบ
  
  // ✅ เพิ่ม state สำหรับ validation
  const [validationError, setValidationError] = useState<string>('');
  const [targetStatus, setTargetStatus] = useState<string>('');
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  
  // ✅ เพิ่ม state สำหรับเก็บ error และ activity_status จาก Backend
  const [backendActivityStatus, setBackendActivityStatus] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

    // ✅ ตรวจสอบเฉพาะเมื่อ activity_status เป็น "Public"
    if (formData.activity_status === "Public" && !formData.start_register_date) {
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
          // ✅ ส่ง foodIds เฉพาะเมื่อ event_format เป็น Onsite
          foodIds: formData.event_format === "Onsite" ? (Array.isArray(formData.selectedFoods) && formData.selectedFoods.length > 0 ? formData.selectedFoods : []) : [],
          // ✅ ลบ selectedFoods ออกจาก request เมื่อไม่ใช่ Onsite
          selectedFoods: formData.event_format === "Onsite" ? formData.selectedFoods : [],
        };

        // ✅ จัดการ image_url แยก (ไม่ส่งถ้าไม่มีรูปภาพ)
        if (typeof formData.image_url === 'string' && formData.image_url.trim() !== "") {
          updateData.image_url = formData.image_url;
        }
        
        console.log("🚀 Data ที่ส่งไป store:", updateData);
        const result = await updateActivity(updateData as Activity);
        console.log("✅ Activity updated successfully:", result);
        toast.success("อัปเดตกิจกรรมสำเร็จ!");
        return finalActivityId; // ✅ ส่งคืน activity_id
      } else {
        // ✅ สร้างกิจกรรมใหม่
        console.log("➕ Creating new activity");
        const result = await createActivity(formData);
        console.log("✅ Activity created successfully:", result);
        toast.success("สร้างกิจกรรมสำเร็จ!");
        return result; // ✅ ส่งคืน activity_id
      }
    } catch (error) {
      console.error("❌ Error saving activity:", error);
      toast.error("บันทึกกิจกรรมไม่สำเร็จ!");
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
    
    // ✅ ถ้าเปลี่ยน event_format ไม่ใช่ Onsite ให้ล้างข้อมูลอาหาร
    if (e.target.name === "event_format" && e.target.value !== "Onsite") {
      setFormData((prev) => ({
        ...prev,
        selectedFoods: [], // ✅ ล้างข้อมูลอาหาร
      }));
      localStorage.removeItem("selectedFoods"); // ✅ ล้าง localStorage ด้วย
      console.log("🧹 Cleared selectedFoods for non-Onsite event format");
    }
  };

  // ✅ Wrapper ที่ fix setFormData
  const handleDateTimeChange = (name: string, newValue: Dayjs | null) => {
    handleDateTimeChangeBase(name, newValue, setFormData);
  };
  
  // ✅ ฟังก์ชันตรวจสอบ validation เมื่อ activity_status เป็น Public
  const checkValidationForPublic = () => {
    if (formData.activity_status === "Public") {
      const isValid = validateForm(formData, setValidationErrors);
      return isValid;
    }
    return true;
  };
  
  // ✅ ฟังก์ชัน handleFormChange ที่เพิ่มการตรวจสอบ validation
  const handleFormChangeWithValidation = (e: React.ChangeEvent<any> | SelectChangeEvent) => {
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
    
    // ✅ ตรวจสอบ validation เมื่อเปลี่ยน activity_status เป็น Public
    if (e.target.name === "activity_status" && e.target.value === "Public") {
      setTimeout(() => {
        checkValidationForPublic();
      }, 100); // รอให้ formData อัปเดตก่อน
    }
  };
  
  // ✅ useEffect เพื่อตรวจสอบ validation เมื่อ formData เปลี่ยน
  useEffect(() => {
    if (backendActivityStatus === "Private" && formData.activity_status === "Public") {
      checkValidationForPublic();
    }
  }, [formData, backendActivityStatus]);

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

  // ✅ ฟังก์ชันตรวจสอบว่าสามารถลบกิจกรรมได้หรือไม่
  const canDeleteActivity = () => {
    if (!activity) return false;
    const restrictedStates = ["Close Register", "Start Activity", "End Activity", "Start Assessment", "End Assessment"];
    return !restrictedStates.includes(activity.activity_state || "");
  };

  // ✅ ฟังก์ชันลบกิจกรรม
  const handleDeleteActivity = async () => {
    if (!activity || !canDeleteActivity()) {
      toast.error("ไม่สามารถลบกิจกรรมนี้ได้");
      return;
    }

    try {
      // ✅ เรียก API ลบกิจกรรม
      await useActivityStore.getState().deleteActivity(activity.activity_id);
      toast.success("ลบกิจกรรมสำเร็จ!");
      setDeleteDialogOpen(false);
      navigate("/list-activity-admin");
    } catch (error) {
      console.error("❌ Error deleting activity:", error);
      toast.error("ลบกิจกรรมไม่สำเร็จ!");
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
            <div className="flex items-center justify-between mb-11">
              <h1 className="text-4xl font-bold">
                {finalActivityId ? "แก้ไขกิจกรรมสหกิจ" : "สร้างกิจกรรมสหกิจ"}
              </h1>
              {finalActivityId && canDeleteActivity() && (
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-600 rounded-lg transition-colors"
                  title="ลบกิจกรรม"
                >
                  <Trash2 size={20} />
                  <span className="font-medium">ลบกิจกรรม</span>
                </button>
              )}
            </div>
            
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
            
            {/* ✅ แสดงข้อความแจ้งเตือนเมื่อมี validation error */}
            {/* {showValidationErrors && validationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 font-medium">
                    ❌ กรุณาแก้ไขข้อมูลให้ถูกต้องเพื่อเปลี่ยนสถานะเป็น Public
                  </span>
                </div>
                <div className="mt-2 text-red-700 text-sm">
                  <p>• ตรวจสอบข้อมูลที่จำเป็นให้ครบถ้วน</p>
                  <p>• ตรวจสอบวันที่ให้ถูกต้อง</p>
                  <p>• ตรวจสอบรูปภาพและข้อมูลอื่นๆ</p>
                </div>
              </div>
            )} */}
            
            {/* ✅ แสดงข้อความแจ้งเตือนเมื่อ Backend เป็น Private แต่ select เป็น Public */}
            {backendActivityStatus === "Private" && formData.activity_status === "Public" && Object.keys(validationErrors).length > 0 && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-orange-800 font-medium">
                    ⚠️ กรุณาแก้ไขข้อมูลให้ถูกต้องเพื่อเปลี่ยนสถานะเป็น Public
                  </span>
                </div>
                <div className="mt-2 text-orange-700 text-sm">
                  <p>• ข้อมูลบางส่วนไม่ครบถ้วนหรือไม่ถูกต้อง</p>
                  <p>• กรุณาตรวจสอบข้อความ error ด้านล่าง</p>
                </div>
                {/* ✅ แสดงรายการ error ที่พบ */}
                <div className="mt-3 text-orange-700 text-sm">
                  <p className="font-semibold">รายการที่ต้องแก้ไข:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {Object.entries(validationErrors).map(([field, message]) => (
                      <li key={field} className="text-orange-600">
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-10 flex-grow">
              <div>
                {/* แถวแรก: ชื่อกิจกรรม + วันเวลาปิด/เปิดลงทะเบียน */}
                <div className="flex space-x-6  ">
                  <ActivityInfoSection
                    formData={formData}
                    handleChange={handleFormChangeWithValidation} // ✅ ใช้ฟังก์ชันใหม่ที่มี validation
                    disabled={isActivityStarted()}
                  />

                  <RegisterPeriodSection
                    formData={formData}
                    handleDateTimeChange={handleDateTimeChange}
                    disabled={isActivityStarted()}
                    isEditMode={false} // ✅ เปลี่ยนเป็น false เพื่อให้แสดง error
                  />
                  
                </div>

                {/* แถวสอง: คำอธิบาย + วันเวลาการดำเนินกิจกรรม + จำนวนชั่วโมง */}
                {/* <div className="flex space-x-6 ">
                    <DescriptionSection
    formData={formData}
    handleChange={handleFormChangeWithValidation}
  />

                  <ActivityTimeSection
                    formData={formData}
                    setFormData={setFormData}
                    handleDateTimeChange={handleDateTimeChange}
                  />
                  
                </div>

                    <TypeAndLocationSection
      formData={formData}
      handleChange={handleFormChangeWithValidation}
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
                  handleChange={handleFormChangeWithValidation}
                  disabled={isActivityStarted()}
                  seatCapacity={seatCapacity}
                  setSeatCapacity={setSeatCapacity}
                />

                <ActivityLink formData={formData} handleChange={handleFormChangeWithValidation} disabled={isActivityStarted()} />
                </div>

                <StatusAndSeatSection
                  formData={formData}
                  seatCapacity={seatCapacity}
                  handleChange={handleFormChangeWithValidation}
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
                <AssessmentSection
                  formData={formData}
                  assessments={assessments}
                  handleChange={handleFormChangeWithValidation}
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
                  onSubmit={async () => {
                    // ✅ สร้าง fake event object ที่มี preventDefault method
                    const fakeEvent = {
                      preventDefault: () => {},
                    } as React.FormEvent;
                    return await handleSubmit(fakeEvent);
                  }}
                  onSuccess={(activityId) => {
                    // ✅ หลังจากอัปเดตกิจกรรมสำเร็จ เด้งไปหน้า activity-info-admin
                    const targetId = activityId || finalActivityId;
                    console.log("🎯 Navigating to activity info with ID:", targetId);
                    if (targetId && targetId > 0) {
                      const secureUrl = createSecureLink("/activity-info-admin", { id: targetId.toString() });
                      console.log("🔗 Secure URL:", secureUrl);
                      window.location.href = secureUrl;
                    } else {
                      console.error("❌ Invalid activity ID:", targetId);
                    }
                  }}
                />
              </div>
              
            </form>
          </div>
        </Box>
      )}

      {/* ✅ Dialog สำหรับยืนยันการลบกิจกรรม */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="ยืนยันการลบกิจกรรม"
        message={`คุณแน่ใจหรือไม่ที่ต้องการลบกิจกรรม "${activity?.activity_name}"?\n\nการดำเนินการนี้ไม่สามารถยกเลิกได้`}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteActivity}
        type="button"
      />
    </>
  );
};

export default CreateActivityAdmin;
