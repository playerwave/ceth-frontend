import { SelectChangeEvent } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";

// ✅ ฟังก์ชัน helper สำหรับเปรียบเทียบเวลาที่ถูกต้อง
const compareTime = (time1: string, time2: string) => {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  return date1.getTime() - date2.getTime();
};

// export const convertToDate = (value: string | null | undefined): string | null => {
//   return value && value.trim() !== "" ? new Date(value).toISOString() : null;
// };

export const convertToDate = (
  value: string | null | undefined,
): Date | undefined => {
  if (value && value.trim() !== "") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
};

// export const handleChange = (
//   e:
//     | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     | SelectChangeEvent,
//   setFormData: React.Dispatch<React.SetStateAction<FormData>>,
// ) => {
//   const { name, value } = e.target;
//   setFormData((prev: FormData) => ({
//     ...prev,
//     [name]: value,
//   }));
// };



// export function handleChange<T>(
//   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent,
//   setFormData: React.Dispatch<React.SetStateAction<T>>
// ) {
//   const { name, value } = e.target;
//   setFormData((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// }

export function handleChange<T extends Record<string, any>>(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent,
  setFormData: React.Dispatch<React.SetStateAction<T>>
) {
  const { name, value } = e.target as { name: keyof T; value: any };
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
}



export const handleDateTimeChange = (
  name: string,
  newValue: Dayjs | null,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
) => {
  setFormData((prev: any) => ({
    ...prev,
    [name]: newValue ? newValue.format("YYYY-MM-DD HH:mm:ss") : null, // ✅ ส่ง local time ไป Backend
  }));
};

// export const handleFileChange = (
//   e: React.ChangeEvent<HTMLInputElement>,
//   setFormData: React.Dispatch<React.SetStateAction<any>>,
//   setPreviewImage: (url: string | null) => void
// ) => {
//   if (e.target.files && e.target.files.length > 0) {
//     const file = e.target.files[0];
//     if (!file.type.startsWith("image/")) {
//       toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
//       return;
//     }
//     setPreviewImage(URL.createObjectURL(file));
//     setFormData((prev) => ({ ...prev, ac_image_url: file }));
//   }
// };

export const handleFileChange = <T extends Record<string, unknown>>(
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setPreviewImage: (url: string | null) => void,
) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      ac_image_url: file,
    }));
  }
};

export const validateForm = (formData: any, setErrors: any): boolean => {
  const newErrors: Record<string, string> = {};

  // ✅ ตรวจสอบเฉพาะเมื่อ activity_status เป็น "Public"
  if (formData.activity_status === "Public") {
    if (!formData.activity_name || formData.activity_name.length < 4) {
      newErrors.activity_name = "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร";
    } else if (formData.activity_name.length > 50) {
      newErrors.activity_name = "ชื่อกิจกรรมต้องไม่เกิน 50 ตัวอักษร";
    }
    if (
      !formData.presenter_company_name ||
      formData.presenter_company_name.length < 4
    ) {
      newErrors.presenter_company_name = "ต้องมีอย่างน้อย 4 ตัวอักษร";
    } else if (formData.presenter_company_name.length > 50) {
      newErrors.presenter_company_name = "ชื่อบริษัท/วิทยากรต้องไม่เกิน 50 ตัวอักษร";
    }
    if (!formData.type) {
      newErrors.type = "กรุณาเลือกประเภท";
    }
    if (!formData.activity_status) {
      newErrors.activity_status = "กรุณาเลือกสถานะ";
    }
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = "คำอธิบายต้องไม่เกิน 2000 ตัวอักษร";
    }
    if (!formData.start_activity_date) {
      newErrors.start_activity_date = "กรุณาเลือกวันและเวลาเริ่มกิจกรรม";
    }
    if (!formData.end_activity_date) {
      newErrors.end_activity_date = "กรุณาเลือกวันและเวลาสิ้นสุดกิจกรรม";
    }
    if (!formData.special_start_register_date) {
      newErrors.special_start_register_date = "กรุณาเลือกวันเวลาเริ่มลงทะเบียนพิเศษ";
    }
    if (!formData.start_register_date) {
      newErrors.start_register_date = "กรุณาเลือกวันเวลาเริ่มลงทะเบียน";
    }
    if (!formData.end_register_date) {
      newErrors.end_register_date = "กรุณาเลือกวันเวลาปิดลงทะเบียน";
    }
    if (
      formData.event_format === "Course" &&
      (!formData.recieve_hours || Number(formData.recieve_hours) <= 0)
    ) {
      newErrors.recieve_hours =
        "❌ ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0";
    }
    if (
      formData.start_assessment &&
      formData.start_activity_date &&
      compareTime(formData.start_assessment, formData.start_activity_date) < 0
    ) {
      newErrors.start_assessment =
        "❌ วันเปิดประเมินต้องไม่ก่อนวันเริ่มกิจกรรม";
    }
    if (
      formData.end_assessment &&
      formData.start_assessment &&
      compareTime(formData.end_assessment, formData.start_assessment) < 0
    ) {
      newErrors.end_assessment =
        "❌ วันสิ้นสุดประเมินต้องอยู่หลังวันเริ่มประเมิน";
    }
    if (
      formData.event_format === "Onsite" &&
      !formData.room_id
    ) {
      newErrors.room_id = "กรุณาเลือกห้องสำหรับกิจกรรม Onsite";
    }
    if (
      formData.event_format === "Onsite" &&
      (!formData.selectedFoods || formData.selectedFoods.length === 0)
    ) {
      newErrors.selectedFoods = "กรุณาเลือกอาหารอย่างน้อย 1 รายการ";
    }
    if (
      formData.event_format === "Course" &&
      (!formData.url || formData.url.trim() === "")
    ) {
      newErrors.url = "กรุณาระบุลิ้งกิจกรรมสำหรับ Course";
    }
    
    // ✅ ตรวจสอบวันที่ผ่านไปแล้ว
    const now = new Date();
    
    if (formData.special_start_register_date && compareTime(formData.special_start_register_date, now.toISOString()) < 0) {
      newErrors.special_start_register_date = "❌ วันลงทะเบียนพิเศษต้องไม่เป็นอดีต";
    }
    
    if (formData.start_register_date && compareTime(formData.start_register_date, now.toISOString()) < 0) {
      newErrors.start_register_date = "❌ วันเปิดลงทะเบียนต้องไม่เป็นอดีต";
    }
    
    if (formData.end_register_date && compareTime(formData.end_register_date, now.toISOString()) < 0) {
      newErrors.end_register_date = "❌ วันปิดลงทะเบียนต้องไม่เป็นอดีต";
    }
    
    if (formData.start_activity_date && compareTime(formData.start_activity_date, now.toISOString()) < 0) {
      newErrors.start_activity_date = "❌ วันเริ่มกิจกรรมต้องไม่เป็นอดีต";
    }
    
    if (formData.end_activity_date && compareTime(formData.end_activity_date, now.toISOString()) < 0) {
      newErrors.end_activity_date = "❌ วันสิ้นสุดกิจกรรมต้องไม่เป็นอดีต";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
