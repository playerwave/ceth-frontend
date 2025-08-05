import dayjs from "dayjs";

/**
 * Utility functions for time handling
 * Backend stores time with +7 hours offset, so we need to subtract 7 hours when displaying
 * Updated: 2024-12-19
 *
 * การทำงาน:
 * 1. Backend ส่งเวลามาเป็น 3 PM (15:00) แต่จริงๆ ควรเป็น 8 AM (08:00)
 * 2. getStableDateTimePickerValue() ลบ 7 ชั่วโมง = 8 AM (08:00)
 * 3. DateTimePicker แสดง 8 AM
 * 4. ผู้ใช้เลือก 8 AM
 * 5. convertToBackendFormat() ส่ง "08:00" ไป backend
 * 6. Backend บวก 7 ชั่วโมง = 15:00 (3 PM) เก็บในฐานข้อมูล
 */

/**
 * แปลงเวลาจาก backend ให้เป็นเวลาที่ถูกต้องสำหรับแสดงผล
 * @param dateInput - วันที่จาก backend (string หรือ Date)
 * @returns วันที่ที่ลบ 7 ชั่วโมงออกแล้ว
 */
export const adjustTimeFromBackend = (
  dateInput: string | Date | null
): Date | null => {
  if (!dateInput) return null;

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  // ลบ 7 ชั่วโมงออกจากเวลาที่ได้จาก backend
  return new Date(date.getTime() - 7 * 60 * 60 * 1000);
};

/**
 * แปลงเวลาเป็นรูปแบบ HH:MM AM/PM
 * @param dateInput - วันที่จาก backend
 * @returns เวลาในรูปแบบ "HH:MM AM/PM"
 */
export const formatTime12Hour = (dateInput: string | Date | null): string => {
  const adjustedDate = adjustTimeFromBackend(dateInput);
  if (!adjustedDate) return "ไม่ระบุ";

  let hours = adjustedDate.getHours();
  let minutes = adjustedDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

/**
 * แปลงเวลาเป็นรูปแบบ HH.MM (24 ชั่วโมง)
 * @param dateInput - วันที่จาก backend
 * @returns เวลาในรูปแบบ "HH.MM"
 */
export const formatTime24Hour = (dateInput: string | Date | null): string => {
  const adjustedDate = adjustTimeFromBackend(dateInput);
  if (!adjustedDate) return "ไม่ระบุ";

  return `${adjustedDate.getHours().toString().padStart(2, "0")}.${adjustedDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

/**
 * แปลงเวลาเป็นรูปแบบ 24 ชั่วโมงสำหรับ Intl.DateTimeFormat
 * @param dateInput - วันที่จาก backend
 * @returns เวลาในรูปแบบ 24 ชั่วโมง
 */
export const formatTimeForIntl = (dateInput: string | Date | null): string => {
  const adjustedDate = adjustTimeFromBackend(dateInput);
  if (!adjustedDate) return "ไม่ระบุ";

  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(adjustedDate);
};

/**
 * แปลงเวลาจาก backend ให้เป็น dayjs object สำหรับ DateTimePicker
 * @param dateInput - วันที่จาก backend
 * @returns dayjs object ที่ลบ 7 ชั่วโมงออกแล้ว
 */
export const adjustTimeForDateTimePicker = (
  dateInput: string | Date | null
) => {
  if (!dateInput) return null;

  const adjustedDate = adjustTimeFromBackend(dateInput);
  if (!adjustedDate) return null;

  // ✅ ใช้ dayjs โดยตรงโดยไม่แปลง timezone เพื่อให้ DateTimePicker แสดงเวลาที่ถูกต้อง
  return dayjs(adjustedDate);
};

/**
 * แปลงเวลาจาก DateTimePicker ให้เป็น string สำหรับส่งไป backend
 * @param dayjsValue - dayjs object จาก DateTimePicker
 * @returns string ในรูปแบบ "YYYY-MM-DD HH:mm:ss"
 */
export const convertDateTimePickerToBackend = (
  dayjsValue: any
): string | null => {
  if (!dayjsValue) return null;

  // ✅ ส่ง local time string ไป backend โดยไม่แปลง timezone
  return dayjsValue.format("YYYY-MM-DD HH:mm:ss");
};

/**
 * ฟังก์ชันใหม่สำหรับจัดการ DateTimePicker ที่ไม่แปลง timezone และไม่ปิดตัวเอง
 * @param dateInput - วันที่จาก backend
 * @returns dayjs object ที่ลบ 7 ชั่วโมงออกแล้ว
 */
export const getStableDateTimePickerValue = (
  dateInput: string | Date | null
) => {
  if (!dateInput) return null;

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  // ✅ ลบ 7 ชั่วโมงออกจากเวลาที่ได้จาก backend เพื่อแสดงเวลาที่ถูกต้อง
  const adjustedDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);

  // ✅ ใช้ dayjs โดยไม่แปลง timezone
  return dayjs(adjustedDate);
};

/**
 * ฟังก์ชันใหม่สำหรับแปลง DateTimePicker value เป็น backend format
 * @param dayjsValue - dayjs object จาก DateTimePicker
 * @returns string สำหรับ backend
 */
export const convertToBackendFormat = (dayjsValue: any): string | null => {
  if (!dayjsValue) return null;

  // ✅ ส่ง local time string ไป backend โดยตรง
  return dayjsValue.format("YYYY-MM-DD HH:mm:ss");
};

/**
 * ฟังก์ชันใหม่สำหรับจัดการ DateTimePicker ที่ไม่แปลง timezone และไม่ปิดตัวเอง
 * @param dateInput - วันที่จาก backend
 * @returns dayjs object ที่ไม่ลบ 7 ชั่วโมง
 */
export const getFixedDateTimePickerValue = (
  dateInput: string | Date | null
) => {
  if (!dateInput) return null;

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  // ✅ ใช้ dayjs โดยตรง ไม่ลบ 7 ชั่วโมง
  return dayjs(date);
};
