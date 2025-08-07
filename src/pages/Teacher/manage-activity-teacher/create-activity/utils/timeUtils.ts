import dayjs, { Dayjs } from "dayjs";

// ✅ ฟังก์ชันใหม่ที่ทำให้ DateTimePicker แสดงเวลาที่ถูกต้องตาม backend
// ลดเวลา 7 ชั่วโมงเฉพาะตอนโหลดข้อมูลจาก backend มาแสดงเท่านั้น
export const convertBackendTimeToLocal = (
  date: string | Date | null
): Dayjs | null => {
  if (!date) return null;

  // ✅ ใช้เวลาจาก backend โดยตรง ไม่แปลงเป็น UTC อีกครั้ง
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  // ✅ สร้าง dayjs object จากข้อมูลที่แยกแล้ว และลดเวลาไป 7 ชั่วโมงเฉพาะตอนโหลดข้อมูล
  return dayjs()
    .year(year)
    .month(month)
    .date(day)
    .hour(hours)
    .minute(minutes)
    .second(seconds)
    .subtract(7, "hour");
};

// ✅ ฟังก์ชันสำหรับใช้ใน DateTimePicker ที่ไม่ลดเวลา 7 ชั่วโมง (สำหรับตอนเลือกเวลาใหม่)
export const convertToLocalTimeForPicker = (
  date: string | Date | null
): Dayjs | null => {
  if (!date) return null;

  // ✅ ใช้เวลาจาก backend โดยตรง ไม่ลดเวลา 7 ชั่วโมง
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  // ✅ สร้าง dayjs object จากข้อมูลที่แยกแล้ว ไม่ลดเวลา
  return dayjs()
    .year(year)
    .month(month)
    .date(day)
    .hour(hours)
    .minute(minutes)
    .second(seconds);
};

// ✅ ฟังก์ชันแปลงเวลากลับเป็น UTC สำหรับส่งไป backend
export const convertLocalTimeToUTC = (date: Dayjs | null): string | null => {
  if (!date) return null;
  return date.utc().format();
};

// ✅ ฟังก์ชันสำหรับแปลง UTC เป็น local time (ฟังก์ชันเดิม)
export const convertToLocalTime = (
  date: string | Date | null
): Dayjs | null => {
  if (!date) return null;
  return dayjs(date).tz("Asia/Bangkok");
};

// ✅ ฟังก์ชันสำหรับแปลง local time เป็น UTC (ฟังก์ชันเดิม)
export const convertToUTC = (date: Dayjs | null): string | null => {
  if (!date) return null;
  return date.utc().format();
};
