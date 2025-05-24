import { SelectChangeEvent } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";

export const convertToDate = (value: string | null | undefined) =>
  value && value.trim() !== "" ? new Date(value) : undefined;

export const handleChange = (
  e: React.ChangeEvent<any> | SelectChangeEvent,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export const handleDateTimeChange = (
  name: string,
  newValue: Dayjs | null,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  setFormData((prev: any) => ({
    ...prev,
    [name]: newValue ? newValue.format("YYYY-MM-DDTHH:mm:ss") : null,
  }));
};

export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setPreviewImage: (url: string | null) => void
) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
      return;
    }
    setPreviewImage(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, ac_image_url: file }));
  }
};

export const validateForm = (formData: any, setErrors: any): boolean => {
  const newErrors: Record<string, string> = {};

  if (formData.ac_status === "Public") {
    if (!formData.ac_name || formData.ac_name.length < 4) {
      newErrors.ac_name = "ชื่อกิจกรรมต้องมีอย่างน้อย 4 ตัวอักษร";
    }
    if (!formData.ac_company_lecturer || formData.ac_company_lecturer.length < 4) {
      newErrors.ac_company_lecturer = "ต้องมีอย่างน้อย 4 ตัวอักษร";
    }
    if (!formData.ac_type) {
      newErrors.ac_type = "กรุณาเลือกประเภท";
    }
    if (!formData.ac_status) {
      newErrors.ac_status = "กรุณาเลือกสถานะ";
    }
    if (!formData.ac_start_time) {
      newErrors.ac_start_time = "กรุณาเลือกวันและเวลาเริ่มกิจกรรม";
    }
    if (!formData.ac_end_time) {
      newErrors.ac_end_time = "กรุณาเลือกวันและเวลาสิ้นสุดกิจกรรม";
    }
    if (
      formData.ac_location_type === "Course" &&
      (!formData.ac_recieve_hours || Number(formData.ac_recieve_hours) <= 0)
    ) {
      newErrors.ac_recieve_hours = "❌ ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0";
    }
    if (
      formData.ac_start_assessment &&
      formData.ac_start_time &&
      dayjs(formData.ac_start_assessment).isBefore(dayjs(formData.ac_start_time))
    ) {
      newErrors.ac_start_assessment = "❌ วันเปิดประเมินต้องไม่ก่อนวันเริ่มกิจกรรม";
    }
    if (
      formData.ac_end_assessment &&
      formData.ac_start_assessment &&
      dayjs(formData.ac_end_assessment).isBefore(dayjs(formData.ac_start_assessment))
    ) {
      newErrors.ac_end_assessment = "❌ วันสิ้นสุดประเมินต้องอยู่หลังวันเริ่มประเมิน";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
