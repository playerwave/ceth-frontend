import { SelectChangeEvent } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";

// ✅ ฟังก์ชัน helper สำหรับเปรียบเทียบเวลาที่ถูกต้อง
const compareTime = (time1: string, time2: string) => {
  try {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    
    // ✅ ตรวจสอบว่า date ถูกต้องหรือไม่
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      console.error("❌ Invalid date format:", { time1, time2 });
      return 0;
    }
    
    const result = date1.getTime() - date2.getTime();
    return result;
  } catch (error) {
    console.error("❌ Error comparing times:", error, { time1, time2 });
    return 0;
  }
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
    [name]: newValue ? newValue.utc().format() : null, // ✅ ส่ง UTC time ไป Backend
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

// ✅ Types สำหรับ validation
export type ValidationMode = 'create' | 'edit' | 'edit_private_to_public';

export interface FieldValidationResult {
  hasError: boolean;
  errorMessage: string;
  helperText: string;
}

export interface ValidationContext {
  mode: ValidationMode;
  originalActivityStatus?: string;
  isPublic: boolean;
  isOnsiteOrOnline: boolean;
  isCourse: boolean;
  isOnsite: boolean;
  isOnline: boolean;
}

// ✅ สร้าง validation context
const createValidationContext = (
  formData: any, 
  mode: ValidationMode, 
  originalActivityStatus?: string
): ValidationContext => {
  return {
    mode,
    originalActivityStatus,
    isPublic: formData.activity_status === "Public",
    isOnsiteOrOnline: formData.event_format === "Onsite" || formData.event_format === "Online",
    isCourse: formData.event_format === "Course",
    isOnsite: formData.event_format === "Onsite",
    isOnline: formData.event_format === "Online"
  };
};

// ✅ ตรวจสอบว่าควร validate หรือไม่
const shouldValidate = (context: ValidationContext): boolean => {
  // ถ้าเป็น create mode หรือ edit_private_to_public mode ให้ validate
  if (context.mode === 'create' || context.mode === 'edit_private_to_public') {
    return context.isPublic;
  }
  
  // ถ้าเป็น edit mode ปกติ ให้ validate เฉพาะเมื่อเป็น Public
  if (context.mode === 'edit') {
    return context.isPublic;
  }
  
  return false;
};

// ✅ ตรวจสอบวันที่ผ่านไปแล้ว
const isDateInPast = (dateString: string): boolean => {
  if (!dateString) return false;
  const now = new Date();
  const nowString = now.toISOString().slice(0, 19).replace('T', ' ');
  return compareTime(dateString, nowString) < 0;
};

// ✅ ตรวจสอบระยะห่างระหว่างวันที่
const isDateRangeValid = (startDate: string, endDate: string, minHours: number = 1): boolean => {
  if (!startDate || !endDate) return true;
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const duration = end.diff(start, "hour", true);
  return duration >= minHours;
};

// ✅ ตรวจสอบว่าวันที่ต้องเป็นวันถัดไป
const isNextDay = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true;
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).startOf("day");
  return end.isAfter(start);
};

// ✅ Main validation function สำหรับ field เดียว
export const validateField = (
  fieldName: string,
  formData: any,
  mode: ValidationMode = 'create',
  originalActivityStatus?: string
): FieldValidationResult => {
  const context = createValidationContext(formData, mode, originalActivityStatus);
  
  // ถ้าไม่ควร validate ให้ return ไม่มี error
  if (!shouldValidate(context)) {
    return {
      hasError: false,
      errorMessage: "",
      helperText: ""
    };
  }

  // ✅ Activity Name Validation
  if (fieldName === 'activity_name') {
    if (!formData.activity_name || formData.activity_name.trim() === "") {
      return {
        hasError: true,
        errorMessage: "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร",
        helperText: "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร"
      };
    }
    if (formData.activity_name.length < 4) {
      return {
        hasError: true,
        errorMessage: "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร",
        helperText: "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร"
      };
    }
    if (formData.activity_name.length > 50) {
      return {
        hasError: true,
        errorMessage: "ชื่อกิจกรรมต้องไม่เกิน 50 ตัวอักษร",
        helperText: "ชื่อกิจกรรมต้องไม่เกิน 50 ตัวอักษร"
      };
    }
  }

  // ✅ Presenter Company Name Validation
  if (fieldName === 'presenter_company_name') {
    if (!formData.presenter_company_name || formData.presenter_company_name.trim() === "") {
      return {
        hasError: true,
        errorMessage: "ต้องมีอย่างน้อย 4 ตัวอักษร",
        helperText: "ต้องมีอย่างน้อย 4 ตัวอักษร"
      };
    }
    if (formData.presenter_company_name.length < 4) {
      return {
        hasError: true,
        errorMessage: "ต้องมีอย่างน้อย 4 ตัวอักษร",
        helperText: "ต้องมีอย่างน้อย 4 ตัวอักษร"
      };
    }
    if (formData.presenter_company_name.length > 50) {
      return {
        hasError: true,
        errorMessage: "ชื่อบริษัท/วิทยากรต้องไม่เกิน 50 ตัวอักษร",
        helperText: "ชื่อบริษัท/วิทยากรต้องไม่เกิน 50 ตัวอักษร"
      };
    }
  }

  // ✅ Type Validation
  if (fieldName === 'type') {
    if (!formData.type) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกประเภท",
        helperText: "กรุณาเลือกประเภท"
      };
    }
  }

  // ✅ Description Validation
  if (fieldName === 'description') {
    if (formData.description && formData.description.length > 2000) {
      return {
        hasError: true,
        errorMessage: "คำอธิบายต้องไม่เกิน 2000 ตัวอักษร",
        helperText: "คำอธิบายต้องไม่เกิน 2000 ตัวอักษร"
      };
    }
  }

  // ✅ Special Start Register Date Validation
  if (fieldName === 'special_start_register_date') {
    if (!formData.special_start_register_date) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกวันเวลาเริ่มลงทะเบียนพิเศษ",
        helperText: "กรุณาเลือกวันเวลาเริ่มลงทะเบียนพิเศษ"
      };
    }
    
    // ตรวจสอบวันที่ผ่านไปแล้ว (เฉพาะ create mode)
    if (context.mode === 'create' && isDateInPast(formData.special_start_register_date)) {
      return {
        hasError: true,
        errorMessage: "วันลงทะเบียนพิเศษต้องไม่เป็นอดีต",
        helperText: "วันลงทะเบียนพิเศษต้องไม่เป็นอดีต"
      };
    }
    
    // ตรวจสอบระยะห่างจาก start_register_date
    if (context.isOnsiteOrOnline && formData.start_register_date && 
        !isDateRangeValid(formData.special_start_register_date, formData.start_register_date, 1)) {
      return {
        hasError: true,
        errorMessage: "วันและเวลาลงทะเบียนพิเศษต้องอยู่ก่อนวันเปิดลงทะเบียนอย่างน้อย 1 ชั่วโมง",
        helperText: "วันและเวลาลงทะเบียนพิเศษต้องอยู่ก่อนวันเปิดลงทะเบียนอย่างน้อย 1 ชั่วโมง"
      };
    }
  }

  // ✅ Start Register Date Validation
  if (fieldName === 'start_register_date') {
    if (!formData.start_register_date) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกวันเวลาเริ่มลงทะเบียน",
        helperText: "กรุณาเลือกวันเวลาเริ่มลงทะเบียน"
      };
    }
    
    // ตรวจสอบวันที่ผ่านไปแล้ว (เฉพาะ create mode)
    if (context.mode === 'create' && isDateInPast(formData.start_register_date)) {
      return {
        hasError: true,
        errorMessage: "วันเปิดลงทะเบียนต้องไม่เป็นอดีต",
        helperText: "วันเปิดลงทะเบียนต้องไม่เป็นอดีต"
      };
    }
    
    // ตรวจสอบระยะห่างจาก special_start_register_date
    if (context.isOnsiteOrOnline && formData.special_start_register_date && 
        !isDateRangeValid(formData.special_start_register_date, formData.start_register_date, 1)) {
      return {
        hasError: true,
        errorMessage: "วันและเวลาเปิดลงทะเบียนต้องห่างจากวันลงทะเบียนพิเศษอย่างน้อย 1 ชั่วโมง",
        helperText: "วันและเวลาเปิดลงทะเบียนต้องห่างจากวันลงทะเบียนพิเศษอย่างน้อย 1 ชั่วโมง"
      };
    }
    
    // ตรวจสอบระยะห่างจาก end_register_date
    if (formData.end_register_date && !isDateRangeValid(formData.start_register_date, formData.end_register_date, 1)) {
      return {
        hasError: true,
        errorMessage: "วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง",
        helperText: "วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง"
      };
    }
  }

  // ✅ End Register Date Validation
  if (fieldName === 'end_register_date') {
    if (!formData.end_register_date) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกวันเวลาปิดลงทะเบียน",
        helperText: "กรุณาเลือกวันเวลาปิดลงทะเบียน"
      };
    }
    
    // ตรวจสอบวันที่ผ่านไปแล้ว (เฉพาะ create mode)
    if (context.mode === 'create' && isDateInPast(formData.end_register_date)) {
      return {
        hasError: true,
        errorMessage: "วันปิดลงทะเบียนต้องไม่เป็นอดีต",
        helperText: "วันปิดลงทะเบียนต้องไม่เป็นอดีต"
      };
    }
    
    // ตรวจสอบระยะห่างจาก start_register_date
    if (formData.start_register_date && !isDateRangeValid(formData.start_register_date, formData.end_register_date, 1)) {
      return {
        hasError: true,
        errorMessage: "วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง",
        helperText: "วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง"
      };
    }
  }

  // ✅ Start Activity Date Validation
  if (fieldName === 'start_activity_date') {
    if (!formData.start_activity_date) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกวันและเวลาเริ่มกิจกรรม",
        helperText: "กรุณาเลือกวันและเวลาเริ่มกิจกรรม"
      };
    }
    
    // ตรวจสอบวันที่ผ่านไปแล้ว (เฉพาะ create mode)
    if (context.mode === 'create' && isDateInPast(formData.start_activity_date)) {
      return {
        hasError: true,
        errorMessage: "วันเริ่มกิจกรรมต้องไม่เป็นอดีต",
        helperText: "วันเริ่มกิจกรรมต้องไม่เป็นอดีต"
      };
    }
    
    // ตรวจสอบว่าต้องเป็นวันถัดไปจาก end_register_date
    if (context.isOnsiteOrOnline && formData.end_register_date && 
        !isNextDay(formData.end_register_date, formData.start_activity_date)) {
      return {
        hasError: true,
        errorMessage: "วันเริ่มกิจกรรมต้องเป็นวันถัดไปหลังวันปิดลงทะเบียน (อย่างน้อย 1 วัน)",
        helperText: "วันเริ่มกิจกรรมต้องเป็นวันถัดไปหลังวันปิดลงทะเบียน (อย่างน้อย 1 วัน)"
      };
    }
    
    // ตรวจสอบระยะห่างจาก end_activity_date
    if (formData.end_activity_date && !isDateRangeValid(formData.start_activity_date, formData.end_activity_date, 1)) {
      return {
        hasError: true,
        errorMessage: "วันและเวลาการดำเนินกิจกรรมต้องห่างกันอย่างน้อย 1 ชั่วโมง",
        helperText: "วันและเวลาการดำเนินกิจกรรมต้องห่างกันอย่างน้อย 1 ชั่วโมง"
      };
    }
  }

  // ✅ End Activity Date Validation
  if (fieldName === 'end_activity_date') {
    if (!formData.end_activity_date) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกวันและเวลาสิ้นสุดกิจกรรม",
        helperText: "กรุณาเลือกวันและเวลาสิ้นสุดกิจกรรม"
      };
    }
    
    // ตรวจสอบวันที่ผ่านไปแล้ว (เฉพาะ create mode)
    if (context.mode === 'create' && isDateInPast(formData.end_activity_date)) {
      return {
        hasError: true,
        errorMessage: "วันสิ้นสุดกิจกรรมต้องไม่เป็นอดีต",
        helperText: "วันสิ้นสุดกิจกรรมต้องไม่เป็นอดีต"
      };
    }
    
    // ตรวจสอบระยะห่างจาก start_activity_date
    if (formData.start_activity_date && !isDateRangeValid(formData.start_activity_date, formData.end_activity_date, 1)) {
      return {
        hasError: true,
        errorMessage: "วันและเวลาการดำเนินกิจกรรมต้องห่างกันอย่างน้อย 1 ชั่วโมง",
        helperText: "วันและเวลาการดำเนินกิจกรรมต้องห่างกันอย่างน้อย 1 ชั่วโมง"
      };
    }
  }

  // ✅ Receive Hours Validation
  if (fieldName === 'recieve_hours') {
    if (context.isCourse && (!formData.recieve_hours || Number(formData.recieve_hours) <= 0)) {
      return {
        hasError: true,
        errorMessage: "ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0",
        helperText: "ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0"
      };
    }
  }

  // ✅ Start Assessment Validation
  if (fieldName === 'start_assessment') {
    // ตรวจสอบว่าต้องเป็น Public และ Onsite/Online
    if (!context.isPublic || !context.isOnsiteOrOnline) {
      return {
        hasError: false,
        errorMessage: "",
        helperText: ""
      };
    }
    
    if (!formData.start_assessment) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกวันและเวลาเริ่มการทำแบบประเมิน",
        helperText: "กรุณาเลือกวันและเวลาเริ่มการทำแบบประเมิน"
      };
    }
    
    // ตรวจสอบว่าต้องอยู่หลัง end_activity_date
    if (formData.end_activity_date && 
        compareTime(formData.start_assessment, formData.end_activity_date) < 0) {
      return {
        hasError: true,
        errorMessage: "วันที่และเวลาเปิดให้ทำแบบประเมินต้องอยู่วันที่เดียวกันหรือหลังวันที่จบกิจกรรมและเวลาต้องอยู่เท่ากับหรือหลังจากเวลาจบกิจกรรม",
        helperText: "วันที่และเวลาเปิดให้ทำแบบประเมินต้องอยู่วันที่เดียวกันหรือหลังวันที่จบกิจกรรมและเวลาต้องอยู่เท่ากับหรือหลังจากเวลาจบกิจกรรม"
      };
    }
    
    // ตรวจสอบระยะห่างจาก end_assessment
    if (formData.end_assessment && !isDateRangeValid(formData.start_assessment, formData.end_assessment, 1)) {
      return {
        hasError: true,
        errorMessage: "วันเปิดและปิดประเมินต้องห่างกันอย่างน้อย 1 ชั่วโมง",
        helperText: "วันเปิดและปิดประเมินต้องห่างกันอย่างน้อย 1 ชั่วโมง"
      };
    }
  }

  // ✅ End Assessment Validation
  if (fieldName === 'end_assessment') {
    // ตรวจสอบว่าต้องเป็น Public และ Onsite/Online
    if (!context.isPublic || !context.isOnsiteOrOnline) {
      return {
        hasError: false,
        errorMessage: "",
        helperText: ""
      };
    }
    
    if (!formData.end_assessment) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกวันและเวลาสิ้นสุดการทำแบบประเมิน",
        helperText: "กรุณาเลือกวันและเวลาสิ้นสุดการทำแบบประเมิน"
      };
    }
    
    // ตรวจสอบระยะห่างจาก start_assessment
    if (formData.start_assessment && !isDateRangeValid(formData.start_assessment, formData.end_assessment, 1)) {
      return {
        hasError: true,
        errorMessage: "วันเปิดและปิดประเมินต้องห่างกันอย่างน้อย 1 ชั่วโมง",
        helperText: "วันเปิดและปิดประเมินต้องห่างกันอย่างน้อย 1 ชั่วโมง"
      };
    }
    
    // ตรวจสอบว่าต้องอยู่หลัง end_activity_date
    if (formData.end_activity_date && 
        compareTime(formData.end_assessment, formData.end_activity_date) < 0) {
      return {
        hasError: true,
        errorMessage: "วันสิ้นสุดประเมินต้องอยู่หลังวันสิ้นสุดกิจกรรม",
        helperText: "วันสิ้นสุดประเมินต้องอยู่หลังวันสิ้นสุดกิจกรรม"
      };
    }
  }

  // ✅ Room ID Validation
  if (fieldName === 'room_id') {
    if (context.isOnsite && !formData.room_id) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกห้องสำหรับกิจกรรม Onsite",
        helperText: "กรุณาเลือกห้องสำหรับกิจกรรม Onsite"
      };
    }
  }

  // ✅ Selected Foods Validation
  if (fieldName === 'selectedFoods') {
    if (context.isOnsite && (!formData.selectedFoods || formData.selectedFoods.length === 0)) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกอาหารอย่างน้อย 1 รายการ",
        helperText: "กรุณาเลือกอาหารอย่างน้อย 1 รายการ"
      };
    }
  }

  // ✅ URL Validation
  if (fieldName === 'url') {
    // ตรวจสอบว่าต้องเป็น Public และ (Online หรือ Course)
    if (!context.isPublic || (!context.isOnline && !context.isCourse)) {
      return {
        hasError: false,
        errorMessage: "",
        helperText: ""
      };
    }
    
    // บังคับใส่ URL สำหรับ Online และ Course
    if ((context.isOnline || context.isCourse) && (!formData.url || formData.url.trim() === "")) {
      const eventType = context.isCourse ? "Course" : "Online";
      return {
        hasError: true,
        errorMessage: `กิจกรรมแบบ ${eventType} ต้องระบุลิ้งกิจกรรม`,
        helperText: `กิจกรรมแบบ ${eventType} ต้องระบุลิ้งกิจกรรม`
      };
    }
  }

  // ✅ Seat Validation
  if (fieldName === 'seat') {
    const maxCapacity = Number(formData.seatCapacity || 0);
    
    // ✅ ถ้าเป็น Onsite และมีการกำหนด seatCapacity
    if (context.isOnsite && maxCapacity > 0 && typeof formData.seat === "number") {
      if (formData.seat < 0 || formData.seat > maxCapacity) {
        return {
          hasError: true,
          errorMessage: `จำนวนที่นั่งต้องอยู่ระหว่าง 0 ถึง ${maxCapacity}`,
          helperText: `จำนวนที่นั่งต้องอยู่ระหว่าง 0 ถึง ${maxCapacity}`
        };
      }
    }
    
    // ✅ ถ้าเป็น Onsite แต่ยังไม่ได้เลือกห้อง (seatCapacity = 0)
    if (context.isOnsite && maxCapacity === 0 && context.isPublic && typeof formData.seat === "number" && formData.seat < 0) {
      return {
        hasError: true,
        errorMessage: "จำนวนที่นั่งต้องมากกว่าหรือเท่ากับ 0",
        helperText: "จำนวนที่นั่งต้องมากกว่าหรือเท่ากับ 0"
      };
    }
  }

  // ✅ Assessment ID Validation
  if (fieldName === 'assessment_id') {
    if (context.isOnsiteOrOnline && !formData.assessment_id) {
      return {
        hasError: true,
        errorMessage: "กรุณาเลือกแบบประเมิน",
        helperText: "กรุณาเลือกแบบประเมิน"
      };
    }
  }

  // ถ้าไม่มี error ให้ return ไม่มี error
  return {
    hasError: false,
    errorMessage: "",
    helperText: ""
  };
};

// ✅ Legacy function สำหรับ backward compatibility
export const validateForm = (formData: any, setErrors: any, isEditMode: boolean = false): boolean => {
  const newErrors: Record<string, string> = {};
  const mode: ValidationMode = isEditMode ? 'edit' : 'create';

  // ตรวจสอบทุก field
  const fieldsToValidate = [
    'activity_name', 'presenter_company_name', 'type', 'description',
    'special_start_register_date', 'start_register_date', 'end_register_date',
    'start_activity_date', 'end_activity_date', 'recieve_hours',
    'start_assessment', 'end_assessment', 'room_id', 'selectedFoods',
    'url', 'seat', 'assessment_id'
  ];

  fieldsToValidate.forEach(fieldName => {
    const result = validateField(fieldName, formData, mode);
    if (result.hasError) {
      newErrors[fieldName] = result.errorMessage;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
