import React, { useState, useEffect } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { useActivityStore } from "../../../stores/Admin/activity_store"; // ✅ นำเข้า Zustand Store
import { useAssessmentStore } from "../../../stores/Admin/assessment_store";
import Button from "../../../components/Button";
import { Activity } from "../../../stores/Admin/activity_store";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { toast } from "sonner";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField, IconButton, Paper, Box, Typography } from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material"; // ✅ นำเข้า SelectChangeEvent
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../components/Loading";

interface FormData {
  ac_id: number | null;
  ac_name: string;
  assessment_id?: number | null;
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
  ac_image_url?: File | null;
  ac_normal_register?: string | null;
  ac_recieve_hours?: number | null;
  ac_start_assessment?: string | null;
  ac_end_assessment?: string | null;
  assessment?: {
    as_id: number;
    as_name: string;
    as_type: string;
    as_description: string;
    as_create_date: string;
    as_last_update?: string;
  } | null;
}

const UpdateActivityAdmin: React.FC = () => {
  const { updateActivity, fetchActivity, deleteActivity, activityLoading } =
    useActivityStore(); //
  const [formData, setFormData] = useState<FormData>({
    ac_id: null,
    ac_name: "",
    assessment_id: null,
    ac_company_lecturer: "",
    ac_description: "",
    ac_type: "",
    ac_room: "",
    ac_seat: null,
    ac_food: [],
    ac_status: "Private",
    ac_location_type: "Onsite",
    ac_state: "",
    ac_recieve_hours: null,
    ac_start_register: "",
    ac_end_register: "",
    ac_create_date: "",
    ac_last_update: "",
    ac_registered_count: 0,
    ac_attended_count: 0,
    ac_not_attended_count: 0,
    ac_start_time: "",
    ac_end_time: "",
    ac_image_url: null,
    ac_normal_register: "",
    ac_start_assessment: "",
    ac_end_assessment: "",
    assessment: null,
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
  const location = useLocation();

  const { id: paramId } = useParams();
  const { assessments, fetchAssessments } = useAssessmentStore();
  const id = location.state?.id || paramId;
  const finalActivityId = id ? Number(id) : null;

  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [seatCapacity, setSeatCapacity] = useState<number | string>(""); // ✅ เก็บจำนวนที่นั่งของห้องที่เลือก

  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );

  const handleFloorChange = (event: SelectChangeEvent) => {
    const newFloor = event.target.value;

    setSelectedFloor(newFloor);
    setSelectedRoom(""); // ✅ รีเซ็ตห้องเมื่อเปลี่ยนชั้น
    setSeatCapacity(""); // ✅ รีเซ็ตที่นั่งเมื่อเปลี่ยนชั้น

    setFormData((prev) => ({
      ...prev,
      ac_room: "", // ✅ รีเซ็ตค่าห้องใน formData ด้วย
      ac_seat: "", // ✅ รีเซ็ตค่าที่นั่ง
    }));
  };

  const handleRoomChange = (event: SelectChangeEvent) => {
    setSelectedRoom(event.target.value);

    // ✅ ค้นหา `capacity` ของห้องที่เลือก
    const selectedRoomObj = IfBuildingRoom[selectedFloor]?.find(
      (room) => room.name === event.target.value
    );

    const newSeatCapacity = selectedRoomObj ? selectedRoomObj.capacity : "";

    setSeatCapacity(newSeatCapacity); // ✅ อัปเดตจำนวนที่นั่ง

    setFormData((prev) => ({
      ...prev,
      ac_room: event.target.value, // ✅ บันทึกห้องที่เลือก
      ac_seat: newSeatCapacity, // ✅ บันทึกจำนวนที่นั่ง
    }));
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | SelectChangeEvent
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value ? parseInt(value, 10) || 0 : 0) : value, // ✅ ป้องกัน null และ undefined
    }));

    switch (name) {
      case "ac_status":
        console.log("Status changed to:", value);
        break;
      default:
        break;
    }
  };

  const handleDateTimeChange = (name: string, newValue: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue ? newValue.format("YYYY-MM-DDTHH:mm:ss") : null, // ✅ บันทึกเป็น Local Time
    }));
  };

  // ✅ ปรับให้ handleChange รองรับ SelectChangeEvent
  const handleChangeSelect = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ✅ รีเซ็ตค่าชั้นและห้องถ้าเปลี่ยนจาก "Onsite" เป็นประเภทอื่น
    if (name === "ac_location_type" && value !== "Onsite") {
      setSelectedFloor("");
      setSelectedRoom("");
      setSeatCapacity("");
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ ฟังก์ชันตรวจสอบข้อผิดพลาดในฟอร์ม
  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    if (formData.ac_status === "Public") {
      // ชื่อกิจกรรม
      if (!formData.ac_name || formData.ac_name.length < 4) {
        newErrors.ac_name = "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร";
      }

      // วิทยากร
      if (
        !formData.ac_company_lecturer ||
        formData.ac_company_lecturer.length < 4
      ) {
        newErrors.ac_company_lecturer = "ต้องมีอย่างน้อย 4 ตัวอักษร";
      }

      // ประเภทกิจกรรม
      if (!formData.ac_type) {
        newErrors.ac_type = "กรุณาเลือกประเภท";
      }

      // สถานะกิจกรรม
      if (!formData.ac_status) {
        newErrors.ac_status = "กรุณาเลือกสถานะ";
      }

      // วันเวลาเริ่ม-สิ้นสุดกิจกรรม
      if (!formData.ac_start_time) {
        newErrors.ac_start_time = "กรุณาเลือกวันและเวลาเริ่มกิจกรรม";
      }
      if (!formData.ac_end_time) {
        newErrors.ac_end_time = "กรุณาเลือกวันและเวลาสิ้นสุดกิจกรรม";
      }
      if (
        formData.ac_start_time &&
        formData.ac_end_time &&
        dayjs(formData.ac_start_time).isAfter(dayjs(formData.ac_end_time))
      ) {
        newErrors.ac_end_time = "วันสิ้นสุดกิจกรรมต้องมากกว่าวันเริ่มกิจกรรม";
      }

      // เวลาลงทะเบียน: ต้องอยู่หลังวันนี้ และก่อนวันปิด
      if (
        formData.ac_normal_register &&
        formData.ac_end_register &&
        (dayjs(formData.ac_normal_register).isAfter(
          dayjs(formData.ac_end_register)
        ) ||
          dayjs(formData.ac_normal_register).isSame(
            dayjs(formData.ac_end_register),
            "day"
          ))
      ) {
        newErrors.ac_normal_register =
          "วันเปิดให้นิสิตสถานะ normal ลงทะเบียนต้องไม่ตรงหรือเกินวันปิดลงทะเบียน";
      }

      // จำนวนที่นั่ง
      if (!formData.ac_seat || Number(formData.ac_seat) <= 0) {
        newErrors.ac_seat = "❌ ต้องระบุจำนวนที่นั่งมากกว่า 0";
      }

      // ชั่วโมงกิจกรรม (ถ้าเป็น Course)
      if (
        formData.ac_location_type === "Course" &&
        (!formData.ac_recieve_hours || Number(formData.ac_recieve_hours) <= 0)
      ) {
        newErrors.ac_recieve_hours =
          "❌ ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0";
      }

      // วันที่ประเมิน: ต้องอยู่หลังวันเริ่มกิจกรรม
      if (
        formData.ac_start_assessment &&
        formData.ac_start_time &&
        dayjs(formData.ac_start_assessment).isBefore(
          dayjs(formData.ac_start_time)
        )
      ) {
        newErrors.ac_start_assessment =
          "❌ วันเปิดประเมินต้องไม่ก่อนวันเริ่มกิจกรรม";
      }

      if (
        formData.ac_end_assessment &&
        formData.ac_start_assessment &&
        dayjs(formData.ac_end_assessment).isBefore(
          dayjs(formData.ac_start_assessment)
        )
      ) {
        newErrors.ac_end_assessment =
          "❌ วันสิ้นสุดประเมินต้องอยู่หลังวันเริ่มประเมิน";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload image success!", data.secure_url);
    return data.secure_url;
  };

  const convertToDate = (value: string | null | undefined) => {
    if (!value || value.trim() === "" || isNaN(Date.parse(value))) {
      return null; // ถ้าค่าไม่ถูกต้อง ให้ส่ง null แทน
    }
    return new Date(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("กรุณากรอกข้อมูลให้ถูกต้องก่อนส่งฟอร์ม!");
      return;
    }

    console.log("🛠 Submitting Activity:", formData);
    let imageUrl = formData.ac_image_url;
    if (formData.ac_image_url instanceof File) {
      imageUrl = await uploadImageToCloudinary(formData.ac_image_url);
    }

    let acRecieveHours = formData.ac_recieve_hours
      ? Number(formData.ac_recieve_hours)
      : 0;

    if (
      formData.ac_location_type !== "Course" &&
      formData.ac_start_time &&
      formData.ac_end_time
    ) {
      const start = dayjs(formData.ac_start_time);
      const end = dayjs(formData.ac_end_time);
      const duration = end.diff(start, "hour", true); // ✅ คำนวณเป็นชั่วโมง (รวมเศษทศนิยม)
      acRecieveHours = duration > 0 ? duration : 0; // ✅ ป้องกันค่าติดลบ
    }

    console.log("start register: ", formData.ac_start_register);

    let startRegister = dayjs(formData.ac_start_register);
    if (formData.ac_status == "Public" && formData.ac_start_register == "") {
      startRegister = dayjs();
      console.log("dont have start register");
    }

    if (formData.ac_location_type !== "Onsite") {
      formData.ac_room = "";
    }

    const activityData: Activity = {
      ...formData,
      ac_last_update: new Date(),
      ac_start_register: startRegister,
      ac_recieve_hours: acRecieveHours,
      ac_state: "Not Start",
      ac_image_url: imageUrl, // ✅ ใช้ URL ของรูปภาพจาก Cloudinary
      ac_registered_count: formData.ac_registered_count,
      ac_normal_register: formData.ac_normal_register
        ? convertToDate(formData.ac_normal_register)
        : null,
      ac_end_register: formData.ac_end_register
        ? convertToDate(formData.ac_end_register)
        : null,
      ac_start_assessment: formData.ac_start_assessment
        ? convertToDate(formData.ac_start_assessment)
        : null,
      ac_end_assessment: formData.ac_end_assessment
        ? convertToDate(formData.ac_end_assessment)
        : null,
      assessment_id: formData.assessment_id
        ? Number(formData.assessment_id)
        : null,
      assessment: formData.assessment_id
        ? assessments.find((a) => a.as_id === Number(formData.assessment_id)) ||
          null
        : null,
    };

    console.log("🚀 Data ที่ส่งไป store:", activityData);

    try {
      await updateActivity(activityData);
      toast.success("แก้ไขกิจกรรมสำเร็จ !", { duration: 5000 });
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Error creating activity:", error);
      toast.error("Create failed!");
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async (id) => {
    try {
      setIsDeleteOpen(false);
      await deleteActivity(id);
      await navigate("/list-activity-admin");
    } catch (error) {
      console.error("❌ Error delete activity:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching assessments..."); // ✅ ตรวจสอบว่า useEffect ทำงาน
    fetchAssessments();
  }, []);

  useEffect(() => {
    console.log("Assessments:", assessments); // ✅ ตรวจสอบว่า assessments มีค่าหรือไม่
  }, [assessments]);

  useEffect(() => {
    const loadActivity = async () => {
      if (!finalActivityId) {
        console.error("❌ No valid activity ID!", id);
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
          ac_id: activityData.id || finalActivityId,
          ac_name: activityData.name || "",
          assessment_id: activityData.assessment_id,
          assessment: activityData.assessment || null,
          ac_company_lecturer: activityData.company_lecturer || "",
          ac_description: activityData.description || "",
          ac_type: activityData.type || "",
          ac_room: activityData.room || "",
          ac_seat: activityData.seat.toString() || "",
          ac_food: activityData.food || [],
          ac_status: activityData.status || "",
          ac_location_type: activityData.location_type,
          ac_state: activityData.state || "",
          ac_recieve_hours: activityData.recieve_hours,
          ac_registered_count: activityData.registered_count,
          ac_start_register: activityData.start_register
            ? activityData.start_register.toISOString().split("T")[0]
            : "",
          ac_end_register: activityData.end_register
            ? activityData.end_register.toISOString().split("T")[0]
            : "",
          ac_normal_register: activityData.normal_register // ✅ เพิ่มค่า ac_normal_register
            ? activityData.normal_register.toISOString().split("T")[0]
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
          ac_image_url: activityData.image_url || null,
          ac_start_assessment: activityData.start_assessment
            ? new Date(activityData.start_assessment).toISOString()
            : "",
          ac_end_assessment: activityData.end_assessment
            ? new Date(activityData.end_assessment).toISOString()
            : "",
        }));
      } catch (error) {
        console.error("❌ Error fetching activity:", error);
      }
    };

    loadActivity();
  }, [finalActivityId, fetchActivity]);

  useEffect(() => {
    if (formData.ac_room) {
      const floor =
        formData.ac_room.charAt(3) === "1"
          ? formData.ac_room.substring(3, 5) // ชั้น 10 ขึ้นไป เช่น 11M280 → 11
          : formData.ac_room.charAt(3); // ชั้น 3-9 เช่น 3M210 → 3

      setSelectedFloor(floor);
      setSelectedRoom(formData.ac_room);
    }
  }, [formData.ac_room]);

  useEffect(() => {
    if (selectedRoom && selectedFloor) {
      const roomData = IfBuildingRoom[selectedFloor]?.find(
        (room) => room.name === selectedRoom
      );
      if (roomData) {
        setFormData((prev) => ({ ...prev, ac_seat: roomData.capacity }));
      }
    }
  }, [selectedRoom, selectedFloor]);

  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     ac_type:
  //       prev.ac_type === "Hard Skill"
  //         ? "HardSkill"
  //         : prev.ac_type === "Soft Skill"
  //         ? "SoftSkill"
  //         : prev.ac_type,
  //     ac_status: prev.ac_status || "Private",
  //   }));
  // }, [formData.ac_type, formData.ac_status]);

  return (
    <>
      {activityLoading ? (
        <Loading />
      ) : (
        <Box className="justify-items-center">
          <div
            className={`w-320 mx-auto ml-2xl mt-5 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-sm min-h-screen flex flex-col`}
          >
            {/* <h1>{formData.assessment}</h1> */}
            <div className="flex items-center justify-between mb-11">
              <h1 className="text-4xl font-bold">รายละเอียดกิจกรรมสหกิจ</h1>
              <Trash2
                className="cursor-pointer text-red-500"
                onClick={() => setIsDeleteOpen(true)}
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 flex flex-col flex-grow"
            >
              {/* scrollbar */}
              <div className="flex-grow">
                <div className="flex space-x-6 items-center">
                  {/* ช่องกรอกชื่อกิจกรรม */}
                  <div>
                    <label className="block font-semibold w-50">
                      ชื่อกิจกรรม *
                    </label>
                    <TextField
                      id="ac_name"
                      name="ac_name"
                      placeholder="ชื่อกิจกรรม"
                      value={formData.ac_name}
                      className="w-140"
                      onChange={handleChange}
                      error={
                        formData.ac_status !== "Private" &&
                        formData.ac_name.length > 0 &&
                        formData.ac_name.length < 4
                      }
                      helperText={
                        formData.ac_status !== "Private" &&
                        formData.ac_name.length > 0 &&
                        formData.ac_name.length < 4
                          ? "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร"
                          : ""
                      }
                      sx={{ height: "56px" }} // กำหนดความสูงให้ TextField
                    />
                  </div>

                  {/* ช่องกรอกวันและเวลาปิดการลงทะเบียน */}
                  <div className="flex flex-col">
                    <label className="block font-semibold">
                      วันและเวลาปิดการลงทะเบียน *
                    </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        className="w-77.5"
                        minDate={dayjs()}
                        value={
                          formData.ac_end_register
                            ? dayjs(formData.ac_end_register)
                            : null
                        }
                        onChange={(newValue) =>
                          handleDateTimeChange("ac_end_register", newValue)
                        }
                      />
                    </LocalizationProvider>
                  </div>
                </div>

                <div className="flex space-x-6 items-center mt-10">
                  {/* ช่องกรอกชื่อบริษัท/ชื่อวิทยากร */}
                  <div>
                    <label className="block font-semibold w-50">
                      ชื่อบริษัท/วิทยากร *
                    </label>
                    <TextField
                      id="ac_company_lecturer"
                      name="ac_company_lecturer"
                      placeholder="ชื่อบริษัท หรือ วิทยากร ที่มาอบรม"
                      value={formData.ac_company_lecturer}
                      className="w-140"
                      onChange={handleChange}
                      error={
                        formData.ac_status !== "Private" &&
                        formData.ac_company_lecturer.length > 0 &&
                        formData.ac_company_lecturer.length < 4
                      }
                      helperText={
                        formData.ac_status !== "Private" &&
                        formData.ac_company_lecturer.length > 0 &&
                        formData.ac_company_lecturer.length < 4
                          ? "ต้องมีอย่างน้อย 4 ตัวอักษร"
                          : ""
                      }
                      sx={{ height: "56px" }} // กำหนดความสูงให้ TextField
                    />
                  </div>

                  {/* ช่องกรอก วันและเวลาเปิดให้นิสิตสถานะ normal ลงทะเบียน */}
                  <div className="flex flex-col">
                    <label className="block font-semibold">
                      วันและเวลาเปิดให้นิสิตสถานะ normal ลงทะเบียน *
                    </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        className="w-77.5"
                        minDate={dayjs().add(1, "day")}
                        value={
                          formData.ac_normal_register
                            ? dayjs(formData.ac_normal_register)
                            : null
                        }
                        onChange={(newValue) =>
                          handleDateTimeChange("ac_normal_register", newValue)
                        }
                        slotProps={{
                          textField: {
                            sx: { height: "56px" },
                            error: !!(
                              (
                                formData.ac_status !== "Private" &&
                                formData.ac_normal_register &&
                                formData.ac_end_register &&
                                // ❌ ก่อนวันนี้
                                (dayjs(formData.ac_normal_register).isAfter(
                                  dayjs(formData.ac_end_register)
                                ) || // ❌ หลังวันปิด
                                  dayjs(formData.ac_normal_register).isSame(
                                    dayjs(formData.ac_end_register),
                                    "day"
                                  ))
                              ) // ❌ วันเดียวกัน
                            ),
                            helperText:
                              formData.ac_status !== "Private" &&
                              formData.ac_normal_register &&
                              formData.ac_end_register &&
                              (dayjs(formData.ac_normal_register).isAfter(
                                dayjs(formData.ac_end_register)
                              ) ||
                                dayjs(formData.ac_normal_register).isSame(
                                  dayjs(formData.ac_end_register),
                                  "day"
                                ))
                                ? "วันเปิดให้นิสิตสถานะ normal ลงทะเบียน ต้องไม่ตรงกับหรือเลยวันปิดลงทะเบียน"
                                : "",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>

                {/* ช่องกรอกคำอธิบาย */}
                <div className="flex space-x-6 mt-10">
                  <div>
                    <label className="block font-semibold w-50">
                      คำอธิบายกิจกรรม
                    </label>
                    <TextField
                      name="ac_description"
                      value={formData.ac_description}
                      onChange={handleChange}
                      multiline
                      rows={6} // ปรับจำนวนแถวตามต้องการ
                      variant="outlined"
                      fullWidth
                      sx={{
                        width: "35rem", // เทียบเท่ากับ w-140
                        mb: 2, // เทียบเท่ากับ mb-4
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.375rem", // เทียบเท่ากับ rounded
                          borderColor: "#9D9D9D", // เทียบเท่ากับ border-[#9D9D9D]
                        },
                      }}
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
                          <div className="flex flex-col">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DateTimePicker
                                className="w-77.5"
                                minDate={dayjs(formData.ac_end_register)}
                                value={
                                  formData.ac_start_time
                                    ? dayjs(formData.ac_start_time)
                                    : null
                                }
                                onChange={(newValue) =>
                                  handleDateTimeChange(
                                    "ac_start_time",
                                    newValue
                                  )
                                }
                                slotProps={{
                                  textField: {
                                    sx: { height: "56px" },
                                    error: !!(
                                      (
                                        formData.ac_status !== "Private" &&
                                        formData.ac_start_time &&
                                        ((formData.ac_end_register &&
                                          dayjs(
                                            formData.ac_start_time
                                          ).isBefore(
                                            dayjs(formData.ac_end_register)
                                          )) || // ✅ เงื่อนไขที่ 1
                                          (formData.ac_normal_register &&
                                            dayjs(
                                              formData.ac_start_time
                                            ).isBefore(
                                              dayjs(formData.ac_normal_register)
                                            )))
                                      ) // ✅ เงื่อนไขที่ 2
                                    ),
                                    helperText:
                                      formData.ac_status !== "Private" &&
                                      formData.ac_start_time &&
                                      (formData.ac_end_register ||
                                        formData.ac_normal_register)
                                        ? formData.ac_end_register &&
                                          dayjs(
                                            formData.ac_start_time
                                          ).isBefore(
                                            dayjs(formData.ac_end_register)
                                          )
                                          ? "❌ วันและเวลาการดำเนินกิจกรรมต้องมากกว่าวันที่ปิดลงทะเบียน" // 🔴 กรณีที่ 1
                                          : formData.ac_normal_register &&
                                            dayjs(
                                              formData.ac_start_time
                                            ).isBefore(
                                              dayjs(formData.ac_normal_register)
                                            )
                                          ? "❌ วันและเวลาการดำเนินกิจกรรมต้องอยู่หลังวันที่เปิดให้นิสิตสถานะ normal ลงทะเบียน" // 🔴 กรณีที่ 2
                                          : ""
                                        : "",
                                  },
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                          <p className="text-xs text-gray-500  mt-1">Start</p>
                        </div>

                        <span className="self-center font-semibold">-</span>

                        {/* กรอกวันจบ */}
                        <div className="w-1/2">
                          <div className="flex flex-col">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DateTimePicker
                                className="w-77.5"
                                minDate={dayjs(formData.ac_start_time)}
                                value={
                                  formData.ac_end_time
                                    ? dayjs(formData.ac_end_time)
                                    : null
                                }
                                onChange={(newValue) =>
                                  handleDateTimeChange("ac_end_time", newValue)
                                }
                                slotProps={{
                                  textField: {
                                    sx: { height: "56px" },
                                    error:
                                      formData.ac_status !== "Private" && // ✅ ตรวจสอบสถานะก่อน
                                      formData.ac_end_time && // ✅ ต้องมีค่า end_time ก่อน
                                      ((formData.ac_start_time &&
                                        dayjs(formData.ac_end_time).isBefore(
                                          dayjs(formData.ac_start_time)
                                        )) || // ✅ เงื่อนไขที่ 1
                                        (formData.ac_normal_register &&
                                          dayjs(formData.ac_end_time).isBefore(
                                            dayjs(formData.ac_normal_register)
                                          )) || // ✅ เงื่อนไขที่ 2
                                        (formData.ac_end_register &&
                                          dayjs(formData.ac_end_time).isBefore(
                                            dayjs(formData.ac_end_register)
                                          ))), // ✅ เงื่อนไขที่ 3
                                    helperText:
                                      formData.ac_status !== "Private" &&
                                      formData.ac_end_time
                                        ? formData.ac_start_time &&
                                          dayjs(formData.ac_end_time).isBefore(
                                            dayjs(formData.ac_start_time)
                                          )
                                          ? "❌ วันที่ หรือ เวลาต้องมากกว่าช่วงเริ่มต้น" // 🔴 เงื่อนไขที่ 1
                                          : formData.ac_normal_register &&
                                            dayjs(
                                              formData.ac_end_time
                                            ).isBefore(
                                              dayjs(formData.ac_normal_register)
                                            )
                                          ? "❌ วันที่ หรือ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาที่เปิดให้นิสิตที่มีสถานะ" // 🔴 เงื่อนไขที่ 2
                                          : formData.ac_end_register &&
                                            dayjs(
                                              formData.ac_end_time
                                            ).isBefore(
                                              dayjs(formData.ac_end_register)
                                            )
                                          ? "❌ วันที่ หรือ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาปิดการลงทะเบียน" // 🔴 เงื่อนไขที่ 3
                                          : ""
                                        : "",
                                  },
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                          <p className="text-xs text-gray-500  mt-1">End</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-77.5 mb-2">
                      <label className="block font-semibold ">
                        จำนวนชั่วโมงที่จะได้รับ * {}
                      </label>
                      <TextField
                        id="ac_recieve_hours"
                        name="ac_recieve_hours"
                        type="number"
                        placeholder="จำนวนชั่วโมงที่จะได้รับ"
                        value={
                          formData.ac_location_type === "Course"
                            ? String(formData.ac_recieve_hours)
                            : formData.ac_start_time && formData.ac_end_time
                            ? dayjs(formData.ac_end_time).diff(
                                dayjs(formData.ac_start_time),
                                "hour",
                                true
                              )
                            : String(formData.ac_recieve_hours ?? "")
                        }
                        className="w-full"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            setFormData((prev) => ({
                              ...prev,
                              ac_recieve_hours:
                                value === "" ? null : Number(value),
                            }));
                          }
                        }}
                        error={
                          formData.ac_status === "Public" &&
                          formData.ac_location_type === "Course" &&
                          (!formData.ac_recieve_hours ||
                            Number(formData.ac_recieve_hours) <= 0)
                        }
                        helperText={
                          formData.ac_status === "Public" &&
                          formData.ac_location_type === "Course" &&
                          (!formData.ac_recieve_hours ||
                            Number(formData.ac_recieve_hours) <= 0)
                            ? "❌ ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0"
                            : ""
                        }
                        disabled={formData.ac_location_type !== "Course"} // ✅ ปิดการแก้ไขถ้าไม่ใช่ "Course"
                        sx={{ height: "56px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* ช่องกรอกระเภท */}
                <div className="flex space-x-6 items-center mt-6">
                  <div>
                    <label className="block font-semibold w-50">ประเภท *</label>
                    <Select
                      labelId="ac_type-label"
                      name="ac_type"
                      value={formData.ac_type}
                      onChange={handleChange}
                      className="rounded w-140"
                      displayEmpty // ✅ ทำให้แสดง Placeholder
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <span className="text-black">
                              เลือกประเภทกิจกรรม
                            </span>
                          ); // ✅ Placeholder
                        }
                        return selected;
                      }}
                      sx={{
                        height: "56px", // ลดความสูงของ Select
                        "& .MuiSelect-select": {
                          padding: "8px", // ลด padding ด้านใน
                        },
                      }}
                    >
                      <MenuItem disabled value="">
                        เลือกประเภทกิจกรรม
                      </MenuItem>{" "}
                      {/* ✅ Disabled Placeholder */}
                      <MenuItem value="Soft Skill">
                        ชั่วโมงเตรียมความพร้อม (Soft Skill)
                      </MenuItem>
                      <MenuItem value="Hard Skill">
                        ชั้่วโมงทักษะทางวิชาการ (Hard Skill)
                      </MenuItem>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-semibold w-50">
                      ประเภทสถานที่จัดกิจกรรม *
                    </label>
                    <Select
                      labelId="ac_location_type-label"
                      name="ac_location_type"
                      value={formData.ac_location_type}
                      onChange={handleChangeSelect} // ✅ ใช้ฟังก์ชันใหม่
                      className="rounded w-76"
                      sx={{
                        height: "56px",
                        "& .MuiSelect-select": { padding: "8px" },
                      }}
                    >
                      <MenuItem value="Online">Online</MenuItem>
                      <MenuItem value="Onsite">Onsite</MenuItem>
                      <MenuItem value="Course">Course</MenuItem>
                    </Select>
                  </div>
                </div>

                {/* ช่องกรอกห้องที่ใช้อบรม */}
                <div className="flex space-x-4 mt-5">
                  {/* เลือกชั้น */}
                  <div className="w-1/6">
                    <label className="block font-semibold">เลือกชั้น</label>
                    <Select
                      labelId="floor-select-label"
                      value={
                        formData.ac_room
                          ? formData.ac_room.charAt(3) == "1"
                            ? formData.ac_room.substring(3, 5)
                            : formData.ac_room.charAt(3)
                          : selectedFloor
                      }
                      onChange={handleFloorChange}
                      className="rounded p-2 w-full"
                      disabled={formData.ac_location_type !== "Onsite"} // 🔴 ปิดการใช้งานหากไม่ใช่ Onsite
                      sx={{
                        height: "56px",
                        "& .MuiSelect-select": { padding: "8px" },
                      }}
                    >
                      <MenuItem value="">เลือกชั้น</MenuItem>
                      {Object.keys(IfBuildingRoom).map((floor) => (
                        <MenuItem key={floor} value={floor}>
                          {formData.ac_location_type !== "Onsite"
                            ? ""
                            : `${floor}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  {/* เลือกห้อง */}
                  <div className="w-85.5">
                    <label className="block font-semibold">เลือกห้อง</label>
                    <Select
                      labelId="room-select-label"
                      value={selectedRoom || formData.ac_room || ""}
                      onChange={handleRoomChange}
                      className={`rounded p-2 w-full ${
                        !selectedFloor || formData.ac_location_type !== "Onsite"
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                      disabled={
                        formData.ac_location_type !== "Onsite" ||
                        (!selectedFloor && !formData.ac_room)
                      } // 🔴 ปิดการใช้งานหากไม่ใช่ Onsite หรือยังไม่เลือกชั้น
                      sx={{
                        height: "56px",
                        "& .MuiSelect-select": { padding: "8px" },
                      }}
                    >
                      <MenuItem value="">เลือกห้อง</MenuItem>
                      {selectedFloor &&
                      Array.isArray(IfBuildingRoom[selectedFloor]) ? (
                        IfBuildingRoom[selectedFloor].map((room) => (
                          <MenuItem key={room.name} value={room.name}>
                            {room.name} (ความจุ {room.capacity} ที่นั่ง)
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>ไม่พบห้อง</MenuItem> // ✅ กรณีไม่เจอห้อง
                      )}
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-4 mt-5">
                  {/* ช่องกรอกสถานะ*/}
                  <div className="w-1/6">
                    <label className="block font-semibold w-50">สถานะ *</label>
                    <Select
                      labelId="ac_status" // ✅ ใช้ labelId ให้ตรงกับ name
                      name="ac_status" // ✅ เปลี่ยนให้ตรงกับ key ใน formData
                      value={formData.ac_status}
                      onChange={handleChange}
                      className="rounded w-50"
                      sx={{
                        height: "56px",
                        "& .MuiSelect-select": {
                          padding: "8px",
                        },
                      }}
                    >
                      <MenuItem value="Private">Private</MenuItem>
                      <MenuItem value="Public">Public</MenuItem>
                    </Select>
                  </div>
                  {/* ช่องกรอกจำนวนที่นั่ง*/}
                  <div className="w-85.5">
                    <label className="block font-semibold ">
                      จำนวนที่นั่ง *
                    </label>
                    <TextField
                      id="ac_seat"
                      name="ac_seat"
                      type="number" // ✅ รับเฉพาะตัวเลข
                      placeholder="จำนวนที่เปิดให้นิสิตลงทะเบียน"
                      value={formData.ac_seat || seatCapacity} // ✅ ถ้ามี formData.ac_seat ให้ใช้ค่านั้น
                      className="w-full"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setSeatCapacity(value); // ✅ อัปเดตค่า seatCapacity
                          setFormData((prev) => ({ ...prev, ac_seat: value })); // ✅ อัปเดต formData.ac_seat ด้วย
                        }
                      }}
                      error={
                        formData.ac_location_type === "Onsite" &&
                        Number(seatCapacity) < 0
                      }
                      disabled={
                        selectedRoom && formData.ac_location_type !== "Course"
                      } // ✅ ปิดการแก้ไข ถ้าเลือกห้องและไม่ใช่ Course
                      sx={{ height: "56px" }}
                    />
                  </div>
                </div>

                {/* ช่องเลือกอาหาร (เลือกได้เฉพาะ Onsite) */}
                <Paper
                  className={`w-140 mt-5 p-6 bg-white border border-gray-300 rounded-lg shadow-sm ${
                    formData.ac_location_type !== "Onsite" ? "opacity-50" : ""
                  }`}
                >
                  {/* หัวข้อ */}
                  <Typography variant="h6" className="font-semibold mb-2">
                    อาหาร *
                  </Typography>

                  {/* ส่วนรายการเมนู ไม่มี Scrollbar */}
                  <Box className="pr-2 space-y-2 flex flex-col">
                    {formData.ac_food?.map((menu, index) => (
                      <Box key={index} className="flex items-center space-x-2">
                        <TextField
                          fullWidth
                          value={menu}
                          onChange={(e) =>
                            updateFoodOption(index, e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          className="border-gray-400 rounded"
                          disabled={formData.ac_location_type !== "Onsite"} // ✅ ปิดใช้งานถ้าไม่ใช่ Onsite
                        />
                        <IconButton
                          onClick={() => removeFoodOption(index)}
                          color="error"
                          disabled={formData.ac_location_type !== "Onsite"} // ✅ ปิดใช้งานถ้าไม่ใช่ Onsite
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  {/* ปุ่มเพิ่มเมนู (จะซ่อนไปเลยถ้าไม่ใช่ Onsite) */}
                  {formData.ac_location_type === "Onsite" && (
                    <Box className="flex justify-end mt-2">
                      <Button
                        onClick={addFoodOption}
                        variant="contained"
                        color="blue"
                        startIcon={<Add />}
                        className="mt-4 text-white"
                      >
                        เพิ่มอาหาร
                      </Button>
                    </Box>
                  )}
                </Paper>

                {/* แบบประเมิน */}
                <div className="flex space-x-6 items-center mt-6">
                  <div className="border-[#9D9D9D]">
                    <label className="block font-semibold">แบบประเมิน *</label>
                    <Select
                      labelId="assessment"
                      name="assessment_id"
                      className="w-140"
                      value={
                        formData.assessment_id !== null
                          ? String(formData.assessment_id)
                          : ""
                      }
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(selected) => {
                        console.log("📌 Selected assessment_id:", selected);
                        console.log(
                          "📌 Current formData.assessment_id:",
                          formData.assessment_id
                        );

                        // ใช้ค่า as_name ถ้ามี assessment_id อยู่แล้ว
                        const selectedAssessment =
                          assessments.find(
                            (a) =>
                              String(a.as_id) ===
                              String(selected || formData.assessment_id)
                          )?.as_name || formData.assessment?.as_name; // ✅ ดึงค่า as_name จาก formData

                        if (!selectedAssessment) {
                          return (
                            <span className="text-gray-500">
                              เลือกแบบประเมิน
                            </span>
                          );
                        }
                        return selectedAssessment;
                      }}
                    >
                      <MenuItem disabled value="">
                        เลือกแบบประเมิน
                      </MenuItem>
                      {assessments && assessments.length > 0 ? (
                        assessments.map((assessment) => (
                          <MenuItem
                            key={assessment.as_id}
                            value={String(assessment.as_id)}
                          >
                            {assessment.as_name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>กำลังโหลดข้อมูล...</MenuItem>
                      )}
                    </Select>
                  </div>

                  {/* วันและเวลาทำแบบประเมิน */}

                  <div className="mt-5">
                    <label className="block font-semibold">
                      วันและเวลาเริ่มและสิ้นสุดการทำแบบประเมิน *
                    </label>
                    <div className="flex space-x-2 w-full">
                      {/* กรอกวันเริ่้ม */}
                      <div className="w-1/2">
                        <div className="flex flex-col">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              className="w-77.5"
                              minDate={dayjs(formData.ac_start_time)}
                              value={
                                formData.ac_start_assessment &&
                                dayjs(formData.ac_start_assessment).isValid()
                                  ? dayjs(formData.ac_start_assessment)
                                  : null
                              }
                              onChange={(newValue) =>
                                handleDateTimeChange(
                                  "ac_start_assessment",
                                  newValue
                                )
                              }
                              slotProps={{
                                textField: {
                                  sx: { height: "56px" },
                                  error: !!(
                                    (
                                      formData.ac_status === "Public" && // ✅ แสดง error เฉพาะเมื่อเป็น Public
                                      formData.ac_start_assessment &&
                                      ((formData.ac_start_time &&
                                        dayjs(
                                          formData.ac_start_assessment
                                        ).isBefore(
                                          dayjs(formData.ac_start_time)
                                        )) || // ✅ เงื่อนไขที่ 1
                                        (formData.ac_end_assessment &&
                                          dayjs(
                                            formData.ac_start_assessment
                                          ).isAfter(
                                            dayjs(formData.ac_end_assessment)
                                          )))
                                    ) // ✅ เงื่อนไขที่ 2
                                  ),
                                  helperText:
                                    formData.ac_status === "Public" && // ✅ แสดงข้อความเตือนเฉพาะเมื่อเป็น Public
                                    formData.ac_start_assessment &&
                                    (formData.ac_start_time &&
                                    dayjs(
                                      formData.ac_start_assessment
                                    ).isBefore(dayjs(formData.ac_start_time))
                                      ? "❌ วันและเวลาเปิดให้ทำแบบประเมินต้องมากกว่าหรือเท่ากับวันที่เริ่มดำเนินกิจกรรม"
                                      : formData.ac_end_assessment &&
                                        dayjs(
                                          formData.ac_start_assessment
                                        ).isAfter(
                                          dayjs(formData.ac_end_assessment)
                                        )
                                      ? "❌ วันที่ หรือ เวลาเปิดให้ทำแบบประเมินต้องอยู่ก่อนวันที่ปิดให้ทำแบบประเมิน"
                                      : ""),
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                        <p className="text-xs text-gray-500  mt-1">Start</p>
                      </div>

                      <span className="self-center font-semibold">-</span>

                      {/* กรอกวันจบ */}
                      <div className="w-1/2">
                        <div className="flex flex-col">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              className="w-77.5"
                              minDate={dayjs(formData.ac_start_assessment)}
                              value={
                                formData.ac_end_assessment
                                  ? dayjs(formData.ac_end_assessment)
                                  : null
                              }
                              onChange={(newValue) =>
                                handleDateTimeChange(
                                  "ac_end_assessment",
                                  newValue
                                )
                              }
                              slotProps={{
                                textField: {
                                  sx: { height: "56px" },
                                  error: !!(
                                    (
                                      formData.ac_status === "Public" && // ✅ แสดง error เฉพาะเมื่อเป็น Public
                                      formData.ac_end_assessment &&
                                      formData.ac_start_assessment &&
                                      dayjs(
                                        formData.ac_end_assessment
                                      ).isBefore(
                                        dayjs(formData.ac_start_assessment)
                                      )
                                    ) // ✅ เงื่อนไขที่ 1
                                  ),
                                  helperText:
                                    formData.ac_status === "Public" && // ✅ แสดงข้อความเตือนเฉพาะเมื่อเป็น Public
                                    formData.ac_end_assessment &&
                                    formData.ac_start_assessment &&
                                    dayjs(formData.ac_end_assessment).isBefore(
                                      dayjs(formData.ac_start_assessment)
                                    )
                                      ? "❌ วันที่ หรือ เวลาสิ้นสุดการทำแบบประเมินต้องอยู่หลังวันที่เริ่มทำแบบประเมิน"
                                      : "",
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                        <p className="text-xs text-gray-500  mt-1">End</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* อัปโหลดไฟล์ */}
                <div className="mt-10">
                  <label className=" font-semibold">แนบไฟล์ :</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-118 p-2 border rounded ml-4 border-[#9D9D9D]"
                  />
                </div>

                {/* แสดงภาพที่อัปโหลด (ถ้าเป็นรูป) */}
                {/* แสดงภาพที่อัปโหลด (ถ้ามี) */}
                {previewImage ||
                formData.ac_image_url !== "/img/default.png" ? (
                  <div className="mt-4 w-200 h-125 border-gray-300">
                    <p className="text-sm text-gray-500">ตัวอย่างรูปภาพ:</p>
                    <img
                      src={previewImage || formData.ac_image_url}
                      alt="รูปภาพกิจกรรม"
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
                  title="แก้ไขกิจกรรม"
                  message="คุณแน่ใจว่าจะแก้ไขข้อมูลในกิจกรรมนี้
            (นิสิตในระบบจะเห็นการเปลี่ยนแปลงของกิจกรรมนี้)"
                  onCancel={() => setIsModalOpen(false)}
                  type="submit" // ✅ ทำให้เป็นปุ่ม submit
                  onConfirm={() => {}}
                />

                <ConfirmDialog
                  isOpen={isDeleteOpen}
                  title="ลบกิจกรรม"
                  message="คุณแน่ใจว่าจะลบกิจกรรมนี้
            (หากลบกิจกรรมนี้แล้วจะไม่สามารถกู้คืนข้อมูลได้)"
                  onCancel={() => setIsDeleteOpen(false)}
                  type="submit" // ✅ ทำให้เป็นปุ่ม submit
                  onConfirm={() => {
                    handleDelete(formData.ac_id);
                  }}
                />

                {/* ปุ่ม ยกเลิก & สร้าง */}
                <div className="mt-auto flex justify-end items-center space-x-4 px-6">
                  {/* ปุ่มยกเลิก */}
                  <Button
                    type="button"
                    color="red"
                    onClick={() =>
                      navigate("/activity-info-admin", { state: { id } })
                    }
                  >
                    ยกเลิก
                  </Button>

                  {/* ปุ่มบันทึก */}
                  {formData.ac_status === "Public" ? (
                    <Button
                      onClick={() => {
                        setIsModalOpen(true);
                        console.log("clicked");
                      }}
                      color="blue"
                    >
                      บันทึก
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        console.log("clicked");
                      }}
                      color="blue"
                      type="submit"
                    >
                      บันทึก
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </Box>
      )}
    </>
  );
};

export default UpdateActivityAdmin;
