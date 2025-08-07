// import Button from "../../../../../components/Button";
// import { CalendarDays, Play } from "lucide-react";

// interface Props {
//   startTime?: string | Date | null;
//   endTime?: string | Date | null;
//   state: string;
//   locationType?: string; // เพิ่มตรงนี้
//   onBack: () => void;
//   onEdit: () => void;
// }

// const formatDate = (dateInput?: string | Date | null) => {
//   if (!dateInput) return "ไม่ระบุ";
//   const date = new Date(dateInput);
//   const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
//   const month =
//     date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// const formatTime = (dateInput?: string | Date | null) => {
//   if (!dateInput) return "ไม่ระบุ";
//   const date = new Date(dateInput);
//   let hours = date.getHours();
//   let minutes = date.getMinutes();
//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12 || 12;
//   const formattedHours = hours.toString().padStart(2, "0"); // ✅ เติม 0 ถ้าหลักเดียว
//   const formattedMinutes = minutes.toString().padStart(2, "0");
//   return `${formattedHours}:${formattedMinutes} ${ampm}`;
// };

// const formatDateTimeRange = (
//   startTime?: string | Date | null,
//   endTime?: string | Date | null
// ) => {
//   if (!startTime && !endTime) return "ไม่ระบุ";

//   const startDate = formatDate(startTime);
//   const startFormattedTime = formatTime(startTime);
//   const endDate = formatDate(endTime);
//   const endFormattedTime = formatTime(endTime);

//   return `${startDate}(${startFormattedTime}) - ${endDate}(${endFormattedTime})`;
// };

// export default function ActivityFooter({
//   startTime,
//   endTime,
//   state,
//   locationType,
//   onBack,
//   onEdit,
// }: Props) {
//   const isCourse = locationType === "Course";
//   return (
//     <div className="flex justify-between items-center mt-1 text-[14px]">
//       <div className="flex items-center gap-2">
//         <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
//           <CalendarDays size={25} />
//           {formatDateTimeRange(startTime, endTime)}
//         </div>

//         <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
//           <Play size={25} /> {state}
//         </div>
//       </div>

//       <div className="flex justify-end gap-3">
//         <Button width="120px" onClick={onBack}>
//           ← กลับ
//         </Button>

//         <div className={isCourse ? "opacity-50 pointer-events-none" : ""}>
//           <Button
//             width="120px"
//             onClick={() => {
//               if (!isCourse) {
//                 // logic scan
//               }
//             }}
//           >
//             Scan
//           </Button>
//         </div>

//         <Button width="120px" onClick={onEdit}>
//           แก้ไข
//         </Button>
//       </div>
//     </div>
//   );
// }

import Button from "../../../../../components/Button";
import {
  CalendarDays,
  Play,
  StepForward,
  CalendarHeart,
  BookCheck,
  CalendarFold,
  FileText,
  CalendarOff,
  FileCheck,
} from "lucide-react";

interface Props {
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  state: string;
  locationType?: string;
  onBack: () => void;
  onEdit: () => void;
}

const formatDate = (dateInput?: string | Date | null) => {
  if (!dateInput) return "ไม่ระบุ";
  
  // ✅ Debug: Log raw date data
  console.log("📅 Raw date input:", dateInput);
  console.log("📅 Raw date type:", typeof dateInput);
  
  // ✅ ใช้เวลาจาก backend โดยตรง ไม่ผ่านฟังก์ชันที่เพิ่ม 7 ชั่วโมง
  const date = new Date(dateInput);
  console.log("📅 Date object:", date);
  
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  const result = `${day}/${month}/${year}`;
  
  console.log("📅 Formatted date result:", result);
  return result;
};

const formatTime = (dateInput?: string | Date | null) => {
  if (!dateInput) return "ไม่ระบุ";
  
  // ✅ Debug: Log raw time data
  console.log("🕐 Raw time input:", dateInput);
  console.log("🕐 Raw time type:", typeof dateInput);
  
  // ✅ ใช้เวลาจาก backend โดยตรง ไม่ผ่านฟังก์ชันที่เพิ่ม 7 ชั่วโมง
  const date = new Date(dateInput);
  console.log("🕐 Date object:", date);
  console.log("🕐 Date hours:", date.getHours());
  console.log("🕐 Date minutes:", date.getMinutes());
  
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const result = `${formattedHours}:${formattedMinutes} ${ampm}`;
  
  console.log("🕐 Formatted time result:", result);
  return result;
};

const formatDateTimeRange = (
  startTime?: string | Date | null,
  endTime?: string | Date | null,
) => {
  if (!startTime && !endTime) return "ไม่ระบุ";

  // ลบ 7 ชั่วโมงก่อนแสดงผล
  const adjustTime = (timeInput?: string | Date | null) => {
    if (!timeInput) return null;
    const date = new Date(timeInput);
    date.setHours(date.getHours() - 7);
    return date;
  };

  const adjustedStartTime = adjustTime(startTime);
  const adjustedEndTime = adjustTime(endTime);

  const startDate = formatDate(adjustedStartTime);
  const startFormattedTime = formatTime(adjustedStartTime);
  const endDate = formatDate(adjustedEndTime);
  const endFormattedTime = formatTime(adjustedEndTime);

  return `${startDate}(${startFormattedTime}) - ${endDate}(${endFormattedTime})`;
};

const getStateIcon = (state: string) => {
  switch (state) {
    case "Not Start":
      return <Play size={25} />;
    case "Start Activity":
      return <StepForward size={25} />;
    case "Special Open":
      return <CalendarHeart size={25} />;
    case "End Activity":
      return <BookCheck size={25} />;
    case "Open Register":
      return <CalendarFold size={25} />;
    case "Start Assessment":
      return <FileText size={25} />;
    case "Close Register":
      return <CalendarOff size={25} />;
    case "End Assessment":
      return <FileCheck size={25} />;
    default:
      return <Play size={25} />;
  }
};

export default function ActivityFooter({
  startTime,
  endTime,
  state,
  locationType,
  onBack,
  onEdit,
}: Props) {
  const isCourse = locationType === "Course";
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-[14px] mt-1">
      {/* ก้อนซ้าย: วันที่ + สถานะ */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 min-w-0 w-full lg:w-auto justify-start">
        <div className="order-1 sm:order-1 flex items-center gap-1 ml-0 sm:ml-0 font-[Sarabun] font-semibold">
          <CalendarDays size={25} />
          {formatDateTimeRange(startTime, endTime)}
        </div>

        <div className="order-2 sm:order-2 flex items-center gap-1 font-[Sarabun] font-semibold">
          {getStateIcon(state)} {state}
        </div>
      </div>

      {/* ก้อนขวา: ปุ่ม */}
      <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-between lg:justify-end">
        <Button width="120px" onClick={onBack}>
          ← กลับ
        </Button>
        <div className={isCourse ? "opacity-50 pointer-events-none" : ""}>
          <Button
            width="120px"
            onClick={() => !isCourse && console.log("Scan")}
          >
            Scan
          </Button>
        </div>
        <Button width="120px" onClick={onEdit}>
          แก้ไข
        </Button>
      </div>
    </div>
  );
}
