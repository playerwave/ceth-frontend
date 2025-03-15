import React, { useState, useEffect } from "react";
import { ImagePlus } from "lucide-react";
import { useActivityStore } from "../../../stores/Admin/activity_store"; // ✅ นำเข้า Zustand Store
import { useAssessmentStore } from "../../../stores/Admin/assessment_store";
import Button from "../../../components/Button";
import { Activity } from "../../../stores/Admin/activity_store";
import { useNavigate } from "react-router-dom";
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
  ac_image_url?: File | null;
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
    ac_type: "",
    ac_room: "",
    ac_seat: "",
    ac_food: [],
    ac_status: "Private",
    ac_location_type: "Onsite",
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
    ac_image_url: null,
    ac_normal_register: "",
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
  const { assessments, fetchAssessments } = useAssessmentStore();

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

  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );

  const handleFloorChange = (event: SelectChangeEvent) => {
    setSelectedFloor(event.target.value);
    setSelectedRoom(""); // ✅ รีเซ็ตห้องเมื่อเปลี่ยนชั้น
    setSeatCapacity(""); // ✅ รีเซ็ตที่นั่งเมื่อเปลี่ยนชั้น
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
      case "ac_start_register":
        setStartDate(value);
        break;
      case "ac_end_register":
        setEndRegisterDate(value);
        break;
      case "ac_normal_register":
        setNormalRegisterDate(value);
        break;
      case "ac_start_time":
        setStartTime(value);
        break;
      case "ac_end_time":
        setEndTime(value);
        break;
      default:
        break;

    }
  };
  const handleDateTimeChange = (name: string, newValue: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue ? newValue.format("YYYY-MM-DDTHH:mm:ss") : null, // ✅ บันทึกเป็นรูปแบบเดียวกันกับตัวอื่น
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
      navigate("/list-activity-admin");
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

  useEffect(() => {
    console.log("Fetching assessments..."); // ✅ ตรวจสอบว่า useEffect ทำงาน
    fetchAssessments();
  }, []);

  useEffect(() => {
    console.log("Assessments:", assessments); // ✅ ตรวจสอบว่า assessments มีค่าหรือไม่
  }, [assessments]);

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
      <Box className="justify-items-center">
        <div
          className={`w-320 mx-auto ml-2xl mt-5 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-sm min-h-screen flex flex-col`}
        >
          <h1 className="text-4xl font-bold mb-11">สร้างกิจกรรมสหกิจ</h1>
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
                            formData.ac_status !== "Private" &&
                            formData.ac_normal_register &&
                            formData.ac_end_register &&
                            dayjs(formData.ac_normal_register).isAfter(
                              dayjs(formData.ac_end_register)
                            )
                          ),
                          helperText:
                          formData.ac_status !== "Private" &&
                            formData.ac_normal_register &&
                              formData.ac_end_register &&
                              dayjs(formData.ac_normal_register).isAfter(dayjs(formData.ac_end_register))
                              ? "กรุณาใส่วันที่ใหม่ วันและเวลาเปิดให้นิสิตต้องอยู่หลังวันปิดการลงทะเบียน"
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
                              value={
                                formData.ac_start_time
                                  ? dayjs(formData.ac_start_time)
                                  : null
                              }
                              onChange={(newValue) =>
                                handleDateTimeChange("ac_start_time", newValue)
                              }
                              slotProps={{
                                textField: {
                                  sx: { height: "56px" },
                                  error: !!(
                                    (
                                      formData.ac_status !== "Private" &&
                                      formData.ac_start_time &&
                                      ((formData.ac_end_register &&
                                        dayjs(formData.ac_start_time).isBefore(
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
                                      (formData.ac_end_register || formData.ac_normal_register)
                                      ? formData.ac_end_register && dayjs(formData.ac_start_time).isBefore(dayjs(formData.ac_end_register))
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
                                    (
                                      (formData.ac_start_time && dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_start_time))) || // ✅ เงื่อนไขที่ 1
                                      (formData.ac_normal_register && dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_normal_register))) || // ✅ เงื่อนไขที่ 2
                                      (formData.ac_end_register && dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_end_register))) // ✅ เงื่อนไขที่ 3
                                    )
                                  )
                                  ,
                                  helperText: 
                                  formData.ac_status !== "Private" && formData.ac_end_time
                                    ? formData.ac_start_time && dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_start_time))
                                      ? "❌ เวลาต้องมากกว่าช่วงเริ่มต้น" // 🔴 เงื่อนไขที่ 1
                                      : formData.ac_normal_register && dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_normal_register))
                                        ? "❌ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาที่เปิดให้ลงทะเบียนนิสิต" // 🔴 เงื่อนไขที่ 2
                                        : formData.ac_end_register && dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_end_register))
                                          ? "❌ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาปิดการลงทะเบียน" // 🔴 เงื่อนไขที่ 3
                                          : ""
                                    : ""
                                ,
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
              </div>

              {/* ช่องกรอกระเภท */}
              <div className="flex space-x-6 items-center mt-6">
                <div>
                  <label className="block font-semibold w-50">ประเภท *</label>
                  <Select
                    labelId="ac_type"
                    name="ac_type"
                    value={formData.ac_type}
                    onChange={handleChange}
                    className=" rounded w-140"
                    sx={{
                      height: "56px", // ลดความสูงของ Select
                      "& .MuiSelect-select": {
                        padding: "8px", // ลด padding ด้านใน
                      },
                    }}
                  >
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


                {/* ช่องกรอกจำนวนชั่วโมงที่ได้รับ (เฉพาะ Course) */}
                <div className="flex flex-col">
                  <label className="block font-semibold">จำนวนชั่วโมงที่ได้รับ *</label>
                  <TextField
                    id="ac_recieve_hours"
                    name="ac_recieve_hours"
                    type="number"
                    placeholder="ใส่จำนวนชั่วโมงที่ได้รับ"
                    value={formData.ac_recieve_hours}
                    onChange={handleChange}
                    className="w-77.5"
                    disabled={formData.ac_location_type !== "Course"} // ✅ ปิดการใช้งานถ้าไม่ใช่ Course
                    error={formData.ac_location_type === "Course" && !formData.ac_recieve_hours} // ✅ แสดง error ถ้ายังไม่ได้ใส่
                    sx={{ height: "56px" }}
                  />
                </div>
              </div>

              {/* ช่องกรอกห้องที่ใช้อบรม */}
              <div className="flex space-x-4 mt-5">
                {/* เลือกชั้น */}
                <div className="w-1/6">
                  <label className="block font-semibold">เลือกชั้น</label>
                  <Select
                    labelId="floor-select-label"
                    value={selectedFloor}
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
                        {floor}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                {/* เลือกห้อง */}
                <div className="w-85.5">
                  <label className="block font-semibold">เลือกห้อง</label>
                  <Select
                    labelId="room-select-label"
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    className={`rounded p-2 w-full ${
                      !selectedFloor || formData.ac_location_type !== "Onsite"
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      formData.ac_location_type !== "Onsite" || !selectedFloor
                    } // 🔴 ปิดการใช้งานหากไม่ใช่ Onsite หรือยังไม่เลือกชั้น
                    sx={{
                      height: "56px",
                      "& .MuiSelect-select": { padding: "8px" },
                    }}
                  >
                    <MenuItem value="">เลือกห้อง</MenuItem>
                    {selectedFloor &&
                      IfBuildingRoom[selectedFloor]?.map((room) => (
                        <MenuItem key={room.name} value={room.name}>
                          {room.name} (ความจุ {room.capacity} ที่นั่ง)
                        </MenuItem>
                      ))}
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
                  <label className="block font-semibold ">จำนวนที่นั่ง *</label>
                  <TextField
                    id="ac_seat"
                    name="ac_seat"
                    type="number" // ✅ กำหนดให้รับเฉพาะตัวเลข
                    placeholder="จำนวนที่เปิดให้นิสิตลงทะเบียน"
                    value={seatCapacity} // ✅ ใช้ค่า seatCapacity
                    className="w-full"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setSeatCapacity(value); // ✅ อัปเดตค่า seatCapacity
                      }
                    }}
                    error={
                      formData.ac_location_type === "Onsite" &&
                      Number(seatCapacity) < 0
                    }
                    disabled={selectedRoom} // ✅ ปิดการแก้ไขถ้าไม่ได้เลือกห้อง
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
              <div className="mt-auto flex justify-end items-center space-x-4 px-6">
                {/* ปุ่มยกเลิก */}
                <Button
                  type="button"
                  color="red"
                  onClick={() => navigate("/list-activity-admin")}
                >
                  ยกเลิก
                </Button>

                {/* ปุ่มสร้าง */}
                {formData.ac_status === "Public" ? (
                  <Button
                    onClick={() => {
                      setIsModalOpen(true);
                      console.log("clicked");
                    }}
                    color="blue"
                  >
                    สร้าง
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      console.log("clicked");
                    }}
                    color="blue"
                    type="submit"
                  >
                    ร่าง
                  </Button>
                )}
              </div>
            </div>




          </form>
        </div>
      </Box>
    </>
  );
};

export default CreateActivityAdmin;
