import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAssessmentStore } from "../../../../stores/Teacher/assessment.store.ts";
import Loading from "../../../../components/Loading.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Box } from "@mui/material";
// import { Delete, Add } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material"; // ✅ นำเข้า SelectChangeEvent
import { useActivityStore } from "../../../../stores/Teacher/activity.store.teacher.ts";
import { useSecureLink } from "../../../../routes/secure/SecureRoute.tsx";
import { Activity } from "../../../../types/activity.types.ts";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher.ts";
import { useRoomStore } from "../../../../stores/Teacher/room.store.ts";
import roomService from "../../../../service/Teacher/room.service.ts";
import { Trash2 } from "lucide-react"; // ✅ เพิ่ม icon ถังขยะ
import ConfirmDialog from "../../../../components/Dialog/ConfirmDialog.tsx"; // ✅ เพิ่ม ConfirmDialog
import {
  handleChange,
  validateForm,
  ValidationMode,
  // convertToDate,
} from "./utils/form_utils.tsx"; // หรือเปลี่ยน path ให้ตรงกับตำแหน่งจริง
import { handleDateTimeChange as handleDateTimeChangeBase } from "./utils/form_utils.tsx";
import ActivityInfoSection from "./components/ActivityInfoSection.tsx";
//
// ✅ Import component สำหรับ update mode
import RegisterPeriodSectionUpdate from "./components/timestamp-update/RegisterPeriodSection.update.tsx";
import ActivityTimeSectionUpdate from "./components/timestamp-update/ActivityTimeSection.update.tsx";
import AssessmentSectionUpdate from "./components/timestamp-update/AssessmentSection.update.tsx";
import TypeAndLocationSection from "./components/TypeAndLocationSection.tsx";
import RoomSelectionSection from "./components/RoomSelectionSection.tsx";

import FoodMultiSelect from "./components/FoodMultiSelection.tsx"; // ✅ ใช้ FoodMultiSelect แทน FoodMenuSection
// import AssessmentSection from "./components/AssessmentSection";
import ImageUploadSection from "./components/ImageUploadSection.tsx";
import ActionButtonsSection from "./components/ActionButtonsSection.tsx";
import DescriptionSection from "./components/DescriptionSection.tsx";
import StatusAndSeatSection from "./components/StatusAndSeatSection.tsx";
import ActivityLink from "./components/ActivityLink.tsx"; // ✅ นำเข้า ActivityLink
import CertificateTemplate from "./components/CertificateTemplate.tsx";
import {
  useSecureParams,
  extractSecureParam,
} from "../../../../routes/secure/SecureRoute.tsx";


export interface CreateActivityForm extends Partial<Activity> {
  selectedFoods: number[];
  certificate_template_url?: string | null;
  certificateBase?: any;
}

const CreateActivityAdmin: React.FC = () => {
  const { createActivity, activityLoading, fetchActivity, activity, updateActivity } = useActivityStore(); //
  const { createSecureLink } = useSecureLink();
  const savedFoods = JSON.parse(localStorage.getItem("selectedFoods") || "[]");
  
  // ✅ กำหนด validation mode สำหรับ update activity
  const getValidationMode = (): ValidationMode => {
    if (activity?.activity_status === "Private" && formData.activity_status === "Public") {
      return 'edit_private_to_public';
    }
    return 'edit';
  };
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
  // const location = useLocation();
  const params = useSecureParams();
const secureParams = useSecureParams();
const fromPage = secureParams?.from === 'calendar' ? 'calendar' : 'list';

  // 🔐 ดึง ID จาก URL ที่เข้ารหัส
  const finalActivityId = extractSecureParam(params, 'id', 0);

  // ✅ ฟังก์ชันตรวจสอบว่าเวลาปัจจุบันเลย start_activity_date แล้วหรือยัง
  // const isActivityStarted = () => {
  //   if (!formData.start_activity_date) return false;
  //   const now = dayjs();
  //   const startTime = dayjs(formData.start_activity_date);
  //   return now.isAfter(startTime) || now.isSame(startTime);
  // };

  // ✅ ฟังก์ชันตรวจสอบว่าแก้ไขได้หรือไม่ตาม activity_state และ event_format
  const isFieldEditable = (fieldName: string) => {
    const activityState = activity?.activity_state || "Not Start";
    const eventFormat = formData.event_format || "Onsite";

    // ✅ Not Start: แก้ได้ทุก field
    if (activityState === "Not Start") {
      return true;
    }

    // ✅ Course: กฎพิเศษ
    if (eventFormat === "Course") {
      if (activityState === "Start Activity" || activityState === "End Activity") {
        // แก้ได้แค่ end_activity_date
        return fieldName === 'end_activity_date';
      }
      // Course อื่นๆ แก้ได้ทุก field
      return true;
    }

    // ✅ Special Open Register, Open Register: แก้ได้แค่วันที่ + รูปภาพ + activity_status + ห้อง (ถ้าเป็น Onsite)
    if (activityState === "Special Open Register" || activityState === "Open Register") {
      const editableFields = [
        'end_register_date',
        'start_activity_date',
        'end_activity_date',
        'start_assessment',
        'end_assessment',
        'image_url', // ✅ เพิ่มรูปภาพ
        'activity_status' // ✅ เพิ่ม activity_status
      ];
      
      // ✅ ถ้าเป็น Onsite ให้แก้ไขห้องได้ด้วย
      if (eventFormat === "Onsite" && (fieldName === 'room_id' || fieldName === 'event_format')) {
        return true;
      }
      
      return editableFields.includes(fieldName);
    }

    // ✅ Start Activity, End Activity, Start Assessment, End Assessment: แก้ได้แค่ end_assessment และ start_activity_date
    if (activityState === "Start Activity" || 
        activityState === "End Activity" || 
        activityState === "Start Assessment" || 
        activityState === "End Assessment") {
      return fieldName === 'end_assessment' || fieldName === 'start_activity_date';
    }

    // ✅ Close Register: แก้ได้แค่วันที่ + รูปภาพ + activity_status + ห้อง (ถ้าเป็น Onsite)
    if (activityState === "Close Register") {
      const editableFields = [
        'start_activity_date',
        'end_activity_date',
        'start_assessment',
        'end_assessment',
        'image_url', // ✅ เพิ่มรูปภาพ
        'activity_status' // ✅ เพิ่ม activity_status
      ];
      
      // ✅ ถ้าเป็น Onsite ให้แก้ไขห้องได้ด้วย
      if (eventFormat === "Onsite" && (fieldName === 'room_id' || fieldName === 'event_format')) {
        return true;
      }
      
      return editableFields.includes(fieldName);
    }

    // ✅ กรณีอื่นๆ: แก้ได้ทุก field
    return true;
  };

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
      console.log("🍽️ Activity foods:", (activity as { foods?: unknown; activityFood?: unknown }).foods);
      console.log("🍽️ Activity activityFood:", (activity as { foods?: unknown; activityFood?: unknown }).activityFood);
      console.log("🔍 Certificate fields from activity:", {
        certificate_base_id: activity.certificateBase?.certificate_base_id,
        certificateBase: activity.certificateBase,
        // Backward compatibility
        certificate_template_url: activity.certificate_template_url,
        upload_certificate_description: activity.upload_certificate_description,
        certificate_ocr_data: activity.certificate_ocr_data,
        certificate_image_analysis: activity.certificate_image_analysis
      });

      // Log certificate base data if exists
      if (activity.certificateBase) {
        console.log("📄 [UpdateActivity] Certificate base found:", {
          certificate_base_id: activity.certificateBase.certificate_base_id,
          certificate_name: activity.certificateBase.certificate_name,
          template_image_url: activity.certificateBase.template_image_url,
          description: activity.certificateBase.description,
          has_ocr_data: !!activity.certificateBase.ocr_data,
          has_image_analysis: !!activity.certificateBase.image_analysis
        });
      } else {
        console.log("⚠️ [UpdateActivity] No certificate base found for activity:", activity.activity_id);
        console.log("💡 [UpdateActivity] This is normal for activities without certificate data. You can add certificate data by uploading a template image and description.");
      }

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
      // setValidationError(urlValidationError);
      // setTargetStatus(urlTargetStatus);
      // setShowValidationErrors(urlShowValidationErrors);

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
        last_update_activity_date: typeof activity?.last_update_activity_date === "string" ? convertUTCToLocal(activity.last_update_activity_date) : "",
        start_register_date: typeof activity?.start_register_date === "string" ? convertUTCToLocal(activity.start_register_date) : "",
        special_start_register_date: typeof activity?.special_start_register_date === "string" ? convertUTCToLocal(activity.special_start_register_date) : "",
        end_register_date: typeof activity?.end_register_date === "string" ? convertUTCToLocal(activity.end_register_date) : "",
        start_activity_date: typeof activity?.start_activity_date === "string" ? convertUTCToLocal(activity.start_activity_date) : "",
        end_activity_date: typeof activity?.end_activity_date === "string" ? convertUTCToLocal(activity.end_activity_date) : "",
        image_url: activity.image_url || "",
        assessment_id: activity.event_format === "Course" ? undefined : activity.assessment_id, // ✅ ล้างค่าแบบประเมินถ้าเป็น Course
        room_id: activity.room_id,
        start_assessment: activity.event_format === "Course"
          ? ""
          : (typeof activity?.start_assessment === "string"
            ? convertUTCToLocal(activity.start_assessment)
            : ""),
        end_assessment: activity.event_format === "Course"
          ? ""
          : (typeof activity?.end_assessment === "string"
            ? convertUTCToLocal(activity.end_assessment)
            : ""),
        status: activity.status || "Active",
        url: activity.url || "",
        selectedFoods: (activity as { foods?: Array<{ food_id: number }> }).foods?.map((food) => food.food_id) || savedFoods,
        // ✅ เพิ่ม certificate fields สำหรับ Course
        certificate_base_id: activity.certificateBase?.certificate_base_id || null,
        certificateBase: activity.certificateBase || null,
        // Backward compatibility
        certificate_template_url: activity.certificateBase?.template_image_url || activity.certificate_template_url || null,
        certificate_ocr_data: activity.certificateBase?.ocr_data || activity.certificate_ocr_data || null,
        certificate_image_analysis: activity.certificateBase?.image_analysis || activity.certificate_image_analysis || null,
        upload_certificate_description: activity.certificateBase?.description || activity.upload_certificate_description || "",
      });

      // ✅ อัปเดต preview image เมื่อมีรูปภาพ
      if (activity.image_url && typeof activity.image_url === 'string') {
        setPreviewImage(activity.image_url);
        setHasNewImage(false); // ✅ ตั้งค่าว่าเป็นรูปภาพเดิม
      }

      // ✅ อัปเดตห้องที่เลือก
      if (activity.room_id && rooms.length > 0) {
        const selectedRoom = rooms.find(room => room.room_id === activity.room_id);
        console.log("🏢 Selected Room:", selectedRoom);
        console.log("🪑 Seat Number:", selectedRoom?.seat_number);
        
        if (selectedRoom) {
          setSelectedFloor(selectedRoom.floor || "");
          setSelectedRoom(selectedRoom.room_name || "");
          const capacity = selectedRoom.seat_number?.toString() || "0";
          setSeatCapacity(capacity);
          console.log("✅ Set seatCapacity to:", capacity);
        } else {
          console.warn("⚠️ Room not found in rooms list for room_id:", activity.room_id);
        }
      }
    }
  }, [activity?.activity_id, rooms.length, params, savedFoods.length]); // ✅ ใช้ specific properties แทน object ทั้งหมด


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
  }, []); // ✅ ลบ dependency ที่ทำให้ infinite loop

  useEffect(() => {
    fetchFoods(); // ✅ เรียก API หรือโหลดรายการอาหาร
  }, []); // ✅ ลบ dependency ที่ทำให้ infinite loop

  useEffect(() => {
    fetchAssessments(); // ✅ โหลดข้อมูลเมื่อ component mount
  }, []); // ✅ ลบ dependency ที่ทำให้ infinite loop



  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [seatCapacity, setSeatCapacity] = useState<string>(""); // ✅ เก็บจำนวนที่นั่งของห้องที่เลือก
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // ✅ เพิ่ม state สำหรับ dialog ลบ

  // ✅ เพิ่ม state สำหรับ validation
  // const [validationError, setValidationError] = useState<string>('');
  // const [targetStatus, setTargetStatus] = useState<string>('');
  // const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  // ✅ เพิ่ม state สำหรับเก็บ error และ activity_status จาก Backend
  const [backendActivityStatus, setBackendActivityStatus] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // const uniqueFloors = Array.from(new Set(rooms.map((r) => r.floor))).sort();

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

    // ✅ ตรวจสอบ room conflicts เมื่อเลือกห้องและมีวันที่เวลา
    if (selectedRoomObj?.room_id && formData.start_activity_date && formData.end_activity_date) {
      checkRoomConflicts(
        selectedRoomObj.room_id,
        String(formData.start_activity_date),
        String(formData.end_activity_date),
        finalActivityId // ✅ ส่ง activity_id เพื่อ exclude กิจกรรมปัจจุบัน
      );
    }
  };



  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasNewImage, setHasNewImage] = useState<boolean>(false); // ✅ เพิ่ม state สำหรับติดตามรูปภาพใหม่

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

    // ✅ เรียก validateForm และเก็บผลลัพธ์
    const isValid = validateForm(formData, setErrors, !!finalActivityId);

    if (!isValid) {
      // ✅ useEffect จะจัดการแสดง error toast ให้
      return;
    }

    // ✅ ตรวจสอบ room conflicts ก่อนบันทึก
    if (formData.event_format === "Onsite" && formData.room_id &&
      formData.start_activity_date && formData.end_activity_date) {
      try {
        const conflicts = await roomService.getRoomConflicts(
          formData.room_id,
          String(formData.start_activity_date),
          String(formData.end_activity_date),
          finalActivityId // ✅ ส่ง activity_id เพื่อ exclude กิจกรรมปัจจุบัน
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

    // if (imageFile) {
    //   await uploadImageToCloudinary(imageFile);
    // }

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

    // ✅ ตรวจสอบเฉพาะเมื่อ activity_status เป็น "Public" และไม่ใช่ Course
    if (formData.activity_status === "Public" && formData.event_format !== "Course" && !formData.start_register_date) {
      toast.error("กรุณาเลือกวันเวลาเริ่มลงทะเบียน");
      return;
    }

    // let startRegister = dayjs(formData.start_register_date ?? "").toDate();
    // if (formData.activity_status == "Public") {
    //   startRegister = new Date(); // ไม่ต้องใช้ dayjs ก็ได้
    // }

        console.log("🚀 Data ที่ส่งไป store:", formData);
        console.log("🔍 Certificate fields ที่ส่งไป:", {
          certificate_template_url: formData.certificate_template_url,
          upload_certificate_description: formData.upload_certificate_description,
          certificate_ocr_data: formData.certificate_ocr_data,
          certificate_image_analysis: formData.certificate_image_analysis
        });

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
          // ✅ ส่ง foodIds เฉพาะเมื่อ event_format เป็น Onsite และกรอง foodIds ที่ถูกต้อง
          foodIds: formData.event_format === "Onsite" ?
            (Array.isArray(formData.selectedFoods) && formData.selectedFoods.length > 0 ?
              formData.selectedFoods.filter(foodId => foodId > 0) : []) : [],
          // ✅ Course ไม่ต้องมี registration dates และ assessment
          ...(formData.event_format === "Course" ? {
            special_start_register_date: null,
            start_register_date: null,
            end_register_date: null,
            assessment_id: null,
            start_assessment: null,
            end_assessment: null,
          } : {}),
          // ✅ ส่ง certificate fields สำหรับ Course activities
          ...(formData.event_format === "Course" ? {
            certificate_template_url: formData.certificate_template_url,
            certificate_ocr_data: formData.certificate_ocr_data,
            certificate_image_analysis: formData.certificate_image_analysis,
            upload_certificate_description: formData.upload_certificate_description,
          } : {}),
        };

        // ✅ Clean up undefined values และ circular references
        const cleanUpdateData: any = { ...updateData };
        
        console.log("🔍 updateData certificate fields:", {
          certificate_template_url: updateData.certificate_template_url,
          upload_certificate_description: updateData.upload_certificate_description,
          certificate_ocr_data: updateData.certificate_ocr_data,
          certificate_image_analysis: updateData.certificate_image_analysis
        });
        
        // ✅ ลบ undefined values และ functions
        Object.keys(cleanUpdateData).forEach(key => {
          if (cleanUpdateData[key] === undefined) {
            delete cleanUpdateData[key];
          } else if (typeof cleanUpdateData[key] === 'function') {
            delete cleanUpdateData[key];
          }
        });

        // ✅ แปลงวันที่ให้เป็น format ที่ถูกต้องก่อนส่งไป backend
        const convertToLocalFormat = (dateValue: any): string => {
          if (!dateValue) return "";
          
          // ถ้าเป็น UTC format (มี T และ Z) ให้แปลงเป็น local time
          if (typeof dateValue === 'string' && dateValue.includes('T') && dateValue.includes('Z')) {
            const date = new Date(dateValue);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }
          
          // ถ้าเป็น local format อยู่แล้ว ให้ใช้ตามเดิม
          return dateValue;
        };

        // ✅ แปลงวันที่ทั้งหมดให้เป็น local format
        cleanUpdateData.start_register_date = convertToLocalFormat(cleanUpdateData.start_register_date);
        cleanUpdateData.special_start_register_date = convertToLocalFormat(cleanUpdateData.special_start_register_date);
        cleanUpdateData.end_register_date = convertToLocalFormat(cleanUpdateData.end_register_date);
        cleanUpdateData.start_activity_date = convertToLocalFormat(cleanUpdateData.start_activity_date);
        cleanUpdateData.end_activity_date = convertToLocalFormat(cleanUpdateData.end_activity_date);
        cleanUpdateData.start_assessment = convertToLocalFormat(cleanUpdateData.start_assessment);
        cleanUpdateData.end_assessment = convertToLocalFormat(cleanUpdateData.end_assessment);

        // ✅ จัดการ image_url แยก
        if (hasNewImage && typeof formData.image_url === 'string' && formData.image_url.trim() !== "") {
          // ✅ ถ้ามีรูปภาพใหม่ที่อัปโหลด ให้ใช้รูปภาพใหม่
          cleanUpdateData.image_url = formData.image_url;
        } else if (activity?.image_url && typeof activity.image_url === 'string' && activity.image_url.trim() !== "") {
          // ✅ ถ้าไม่มีรูปภาพใหม่ แต่มีรูปภาพเดิมอยู่ ให้ใช้รูปภาพเดิม
          cleanUpdateData.image_url = activity.image_url;
        } else {
          // ✅ ถ้าไม่มีรูปภาพทั้งใหม่และเดิม ให้เป็น empty string
          cleanUpdateData.image_url = "";
        }

        const isPublic = formData.activity_status === "Public";
        const isOnsiteOrOnline =
          formData.event_format === "Onsite" || formData.event_format === "Online";

        if (isPublic && isOnsiteOrOnline && formData.start_assessment && formData.end_activity_date) {
          const startAsm = dayjs(formData.start_assessment);
          const endAct = dayjs(formData.end_activity_date);
          if (startAsm.isBefore(endAct)) {
            toast.error("❌ วันที่และเวลาเปิดให้ทำแบบประเมินต้องอยู่วันที่เดียวกันหรือหลังวันที่จบกิจกรรมและเวลาต้องอยู่เท่ากับหรือหลังจากเวลาจบกิจกรรม");
            return;
          }
        }

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

        console.log("🚀 Data ที่ส่งไป store:", cleanUpdateData);
        console.log("🔍 cleanUpdateData type:", typeof cleanUpdateData);
        console.log("🔍 cleanUpdateData is object:", typeof cleanUpdateData === 'object' && cleanUpdateData !== null);
        console.log("🔍 cleanUpdateData keys:", Object.keys(cleanUpdateData));
        const result = await updateActivity(cleanUpdateData as Activity);
        console.log("✅ Activity updated successfully:", result);
        
        // ✅ Certificate template URL ถูกส่งไปพร้อมกับ Activity แล้ว (ไม่ต้องเรียก API แยก)
        
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
  }, [formData.event_format, foods, formData.selectedFoods, savedFoods.length]);

  useEffect(() => {
    if (formData.selectedFoods.length > 0) {
      localStorage.setItem("selectedFoods", JSON.stringify(formData.selectedFoods));
    }
  }, [formData.selectedFoods]);




  // ฟังก์ชันแก้ไขเมนูอาหาร

  // const updateFoodOption = (index: number, newFoodId: number) => {
  //   const updated = [...formData.selectedFoods];
  //   updated[index] = newFoodId;
  //   setFormData((prev) => ({
  //     ...prev,
  //     selectedFoods: updated,
  //   }));
  // };


  // ฟังก์ชันลบเมนูอาหาร
  // const removeFoodOption = (index: number) => {
  //   const updatedFoodOptions = formData.selectedFoods?.filter((_, i) => i !== index);
  //   setFormData((prev) => ({ ...prev, selectedFoods: updatedFoodOptions }));
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
      setHasNewImage(true); // ✅ ตั้งค่าว่ามีรูปภาพใหม่

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
        setHasNewImage(false); // ✅ รีเซ็ตถ้าอัปโหลดไม่สำเร็จ
        setPreviewImage(null); // ✅ รีเซ็ต preview
      }
    } else {
      // ✅ ถ้าไม่เลือกไฟล์ ให้รีเซ็ต
      setHasNewImage(false);
      setPreviewImage(null);
      setFormData((prev) => ({
        ...prev,
        image_url: "",
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    handleChange(e, setFormData);

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

  // ✅ Wrapper ที่ fix setFormData และเช็คห้องที่ว่างเฉพาะตอนปิด dialog
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
            String(updatedFormData.start_activity_date),
            String(updatedFormData.end_activity_date),
            finalActivityId
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
  }, [formData.event_format]); // ✅ ลบ clearAvailabilityCheck dependency

  // ✅ ฟังก์ชันตรวจสอบ validation เมื่อ activity_status เป็น Public
  const checkValidationForPublic = useCallback(() => {
    if (formData.activity_status === "Public") {
      const isValid = validateForm(formData, setValidationErrors, !!finalActivityId);
      return isValid;
    }
    return true;
  }, [formData.activity_status, formData.activity_name, formData.presenter_company_name, formData.description, formData.type, formData.seat, formData.recieve_hours, formData.event_format, formData.start_register_date, formData.end_register_date, formData.start_activity_date, formData.end_activity_date, formData.room_id, formData.assessment_id, formData.start_assessment, formData.end_assessment, formData.image_url, formData.url, formData.selectedFoods, finalActivityId]); // ✅ ระบุ specific properties แทน object ทั้งหมด

  // ✅ ฟังก์ชัน handleFormChange ที่เพิ่มการตรวจสอบ validation
      const handleFormChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    handleChange(e, setFormData);

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
  }, [formData.activity_status, backendActivityStatus, checkValidationForPublic]);

  // ✅ useEffect เพื่อแสดง error toast เมื่อ errors state เปลี่ยน
  useEffect(() => {
    const errorEntries = Object.entries(errors).filter(([, msg]) => msg.trim() !== '');
    if (errorEntries.length > 0) {
      const fieldNameMap: Record<string, string> = {
        activity_name: "ชื่อกิจกรรม",
        presenter_company_name: "ชื่อบริษัท/วิทยากร",
        description: "คำอธิบาย",
        type: "ประเภทกิจกรรม",
        seat: "จำนวนที่นั่ง",
        recieve_hours: "จำนวนชั่วโมง",
        event_format: "รูปแบบกิจกรรม",
        start_register_date: "วันเริ่มลงทะเบียน",
        end_register_date: "วันสิ้นสุดลงทะเบียน",
        start_activity_date: "วันเริ่มกิจกรรม",
        end_activity_date: "วันสิ้นสุดกิจกรรม",
        room_id: "ห้อง",
        assessment_id: "แบบประเมิน",
        start_assessment: "วันเริ่มประเมิน",
        end_assessment: "วันสิ้นสุดประเมิน",
        image_url: "รูปภาพ",
        url: "ลิงก์กิจกรรม",
        selectedFoods: "อาหาร"
      };

      const errorList = errorEntries.slice(0, 3).map(([field, msg]) => {
        const fieldName = fieldNameMap[field] || field;
        return `${fieldName}: ${msg}`;
      }).join('\n• ');

      const remainingCount = errorEntries.length - 3;
      const message = `กรุณาแก้ไขข้อมูลต่อไปนี้:\n• ${errorList}${remainingCount > 0 ? `\nและอีก ${remainingCount} รายการ` : ''}`;

      toast.error(message, {
        duration: 6000,
      });
    }
  }, [JSON.stringify(errors)]); // ✅ ใช้ JSON.stringify เพื่อป้องกัน infinite loop

  // ✅ ฟังก์ชันแปลง UTC เป็น local time (ลด 7 ชั่วโมง)
  const convertUTCToLocal = (utcString: string): string => {
    if (!utcString) return "";
    try {
      const date = new Date(utcString);
      // ✅ ลดเวลา 7 ชั่วโมงจาก backend
      date.setHours(date.getHours() - 7);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      const result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return result;
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

            {/* ✅ แสดงข้อความแจ้งเตือนเมื่อควรจำกัดการแก้ไข */}
            {activity?.activity_state && activity.activity_state !== "Not Start" && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-yellow-800 font-medium">
                    ⚠️ กิจกรรมอยู่ในสถานะ "{activity.activity_state}" การแก้ไขถูกจำกัดตามกฎที่กำหนด
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
                    handleChange={handleFormChangeWithValidation}
                    disabled={!isFieldEditable('activity_name')}
                    validationMode={getValidationMode()}
                    originalActivityStatus={activity?.activity_status}
                  />

                  <RegisterPeriodSectionUpdate
                    formData={formData as any}
                    handleDateTimeChange={handleDateTimeChange}
                    disabled={false} // ✅ ใช้ props เฉพาะเจาะจงแทน
                    isEditMode={!!finalActivityId} // ✅ ส่ง true ถ้าเป็นการแก้ไข (มี finalActivityId)
                    backendActivityStatus={backendActivityStatus} // ✅ ส่ง backend activity status
                    isSpecialStartRegisterDateEditable={isFieldEditable('special_start_register_date')}
                    isStartRegisterDateEditable={isFieldEditable('start_register_date')}
                    isEndRegisterDateEditable={isFieldEditable('end_register_date')}
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
                    disabled={!isFieldEditable('description')}
                    validationMode={getValidationMode()}
                    originalActivityStatus={activity?.activity_status}
                  />

                  <div className="flex flex-col space-y-3">
                    <ActivityTimeSectionUpdate
                      formData={formData}
                      setFormData={setFormData}
                      handleDateTimeChange={handleDateTimeChange}
                      disabled={false} // ✅ ใช้ props เฉพาะเจาะจงแทน
                      isStartActivityDateEditable={isFieldEditable('start_activity_date')}
                      isEndActivityDateEditable={isFieldEditable('end_activity_date')}
                      isRecieveHoursEditable={isFieldEditable('recieve_hours')}
                      isEditMode={!!finalActivityId}
                      originalActivityStatus={activity?.activity_status}
                    />

                    <TypeAndLocationSection
                      formData={formData}
                      handleChange={(e) => handleChange(e, setFormData)}
                      setSelectedFloor={setSelectedFloor}
                      setSelectedRoom={setSelectedRoom}
                      setSeatCapacity={setSeatCapacity}
                      disabled={!isFieldEditable('event_format')} // ✅ ส่งเงื่อนไขที่ถูกต้อง
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
                    disabled={!isFieldEditable('room_id')}
                    seatCapacity={seatCapacity}
                    setSeatCapacity={setSeatCapacity}
                    validationMode={getValidationMode()}
                    originalActivityStatus={activity?.activity_status}
                    roomConflicts={roomConflicts}
                    checkingAvailability={checkingAvailability}
                    hasTimeConflict={roomConflicts.length > 0}
                    currentActivityId={finalActivityId}
                  />

                  <ActivityLink 
                    formData={formData} 
                    handleChange={handleFormChangeWithValidation} 
                    disabled={!isFieldEditable('url')}
                    validationMode={getValidationMode()}
                    originalActivityStatus={activity?.activity_status}
                  />
                </div>

                <StatusAndSeatSection
                  formData={formData}
                  seatCapacity={seatCapacity}
                  handleChange={handleFormChangeWithValidation}
                  setSeatCapacity={setSeatCapacity}
                  selectedRoom={selectedRoom}
                  setFormData={setFormData}
                  disabled={!isFieldEditable('activity_status')}
                  validationMode={getValidationMode()}
                  originalActivityStatus={activity?.activity_status}
                />

                {formData.event_format === "Onsite" && (
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
                      disabled={false}
                    />
                  </div>
                )}
                <AssessmentSectionUpdate
                  formData={formData}
                  assessments={assessments}
                  handleChange={handleFormChangeWithValidation}
                  handleDateTimeChange={handleDateTimeChange}
                  disabled={false}
                  isAssessmentIdEditable={isFieldEditable('assessment_id')}
                  isStartAssessmentEditable={isFieldEditable('start_assessment')}
                  isEndAssessmentEditable={isFieldEditable('end_assessment')}
                  validationMode={getValidationMode()}
                  originalActivityStatus={activity?.activity_status}
                  isEditMode={!!finalActivityId}
                />

                <ImageUploadSection
                  previewImage={previewImage}
                  handleFileChange={handleFileChange}
                  disabled={!isFieldEditable('image_url')} // ✅ ส่งเงื่อนไขที่ถูกต้อง
                  hasExistingImage={!!activity?.image_url} // ✅ ส่งข้อมูลว่ามีรูปภาพอยู่แล้วหรือไม่
                />

                <CertificateTemplate
                  formData={formData}
                  setFormData={setFormData}
                  disabled={!isFieldEditable('upload_certificate_description')}
                />

                <ActionButtonsSection
                  formStatus={formData.activity_status ?? "Private"}
                  isModalOpen={isModalOpen}
                  fromPage={fromPage} // ✅ เพิ่มตรงนี้
                  setIsModalOpen={setIsModalOpen}
                  isEditMode={!!finalActivityId}
                  originalStatus={activity?.activity_status ?? "Private"}
                  onSubmit={async () => {
                    // ✅ สร้าง fake event object ที่มี preventDefault method
                    const fakeEvent = {
                      preventDefault: () => { },
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
