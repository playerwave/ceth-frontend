import dayjs, { Dayjs } from "dayjs";

// ✅ ฟังก์ชันสำหรับแสดงเวลาจาก backend โดยไม่แปลง timezone
export const convertBackendTimeToLocal = (
  date: string | Date | null
): Dayjs | null => {
  if (!date) return null;

  // ✅ แสดง UTC time จาก backend โดยตรง ไม่แปลง timezone
  return dayjs(date);
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
