// import { Hourglass, MapPin, School, HouseWifi, Album } from "lucide-react";
// import type { Activity } from "../../../../../types/activity.types";

// interface Props {
//   activity: Activity;
// }

// type LocationType = "Onsite" | "Course" | "Online";

// function LocationTypeDisplay({ locationType }: { locationType: string }) {
//   const iconMap: Record<LocationType, React.ElementType> = {
//     Onsite: School,
//     Course: Album,
//     Online: HouseWifi,
//   };

//   const IconComponent = iconMap[locationType as LocationType] ?? HouseWifi;
//   const label = locationType;

//   return (
//     <span className="inline-flex items-center gap-1 pr-2 font-sans">
//       <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
//       {label}
//     </span>
//   );
// }

// // function formatRoom(roomCode: string) {
// //   if (!roomCode.startsWith("IF-")) return roomCode;
// //   const room = roomCode.slice(3);
// //   const match = room.match(/^(\d+)/);
// //   if (!match) return roomCode;
// //   const floor = match[1];
// //   return `ชั้น ${floor} ห้อง ${room}`;
// // }


// function formatRoom(roomCode: number): string {
//   if (!roomCode || typeof roomCode !== "string") return "ไม่ระบุห้อง";

//   // กรณีเริ่มต้นด้วย IF-
//   if (roomCode.startsWith("IF-")) {
//     const raw = roomCode.slice(3); // ตัด "IF-"
//     const match = raw.match(/^(\d+)/); // หาตัวเลขต้น
//     if (match) {
//       const floor = match[1];
//       return `ชั้น ${floor} ห้อง ${raw}`;
//     }
//     return `ห้อง ${raw}`;
//   }

//   // กรณีเป็นตัวเลขล้วน เช่น "401"
//   if (/^\d+$/.test(roomCode)) {
//     const floor = roomCode.length >= 3 ? roomCode.slice(0, roomCode.length - 2) : "ไม่ระบุ";
//     return `ชั้น ${floor} ห้อง ${roomCode}`;
//   }

//   // กรณีอื่น ๆ เช่น "LAB-203"
//   return `ห้อง ${roomCode}`;
// }

// export default function ActivityDetails({ activity }: Props) {
//   const formatDate = (dateInput?: string | Date | null) => {
//     if (!dateInput) return "ไม่ระบุ";
//     const date = new Date(dateInput);
//     const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
//     const month =
//       date.getMonth() + 1 < 10
//         ? `0${date.getMonth() + 1}`
//         : date.getMonth() + 1;
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <>
//       <div className="flex flex-col lg:flex-row lg:items-center justify-start lg:justify-between w-full gap-4 mt-4">
//         {/* ✅ ก้อนซ้าย */}
//         <div className="flex items-center gap-2 w-full lg:w-auto">
//           {/* 👇 ตัดชื่อยาว ๆ แล้วใส่ ... */}
//           <p
//             className="font-semibold text-[20px] lg:text-[22px] xl:text-[25px] font-sans truncate"
//             style={{
//               maxWidth: "100%", // รองรับ mobile
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//               flexShrink: 1,
//             }}
//           >
//             {activity.presenter_company_name}
//           </p>

//           {/* 👇 ไม่ให้โดนดันหลุดขอบ และไม่ขยายตามชื่อ */}
//           <span
//             className="px-2 py-1 rounded text-[14px] lg:text-[16px] xl:text-[18px] flex-shrink-0"
//             style={{
//               backgroundColor:
//                 activity.type === "Hard"
//                   ? "rgba(255, 174, 0, 0.2)"
//                   : "rgba(9, 0, 255, 0.2)",
//               color: activity.type === "Hard" ? "#FFAE00" : "#0900FF",
//               minWidth: "100px",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             {activity.type}
//           </span>
//         </div>

//         {/* ✅ ก้อนขวา */}
//         <div className="flex items-center gap-1 font-[Sarabun] w-full lg:w-auto justify-start lg:justify-end text-xs sm:text-sm md:text-base">
//           <LocationTypeDisplay locationType={activity.event_format} />

//           {activity.event_format !== "Course" ? (
//             <>
//               <Hourglass className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
//               ปิดลงทะเบียน {formatDate(activity.end_register_date)}&nbsp;&nbsp;
//             </>
//           ) : (
//             <span
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 width: "220px",
//               }}
//             >
//               {/* เว้นที่ว่าง */}
//             </span>
//           )}

//           <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
//           {activity.event_format === "Onsite"
//             ? formatRoom(activity.room_id)
//             : "ไม่มีห้องสำหรับกิจกรรมนี้"}
//         </div>
//       </div>

//       <p className="mt-2 text-xs sm:text-sm md:text-base font-sans break-words overflow-hidden">
//         {activity.description}
//       </p>
//     </>
//   );
// }

import { useEffect } from "react";
import { Hourglass, MapPin, School, HouseWifi, Album } from "lucide-react";
import type { Activity } from "../../../../../types/activity.types";
import { useRoomStore } from "../../../../../stores/Teacher/room.store";

interface Props {
  activity: Activity;
}

type LocationType = "Onsite" | "Course" | "Online";

function LocationTypeDisplay({ locationType }: { locationType: string }) {
  const iconMap: Record<LocationType, React.ElementType> = {
    Onsite: School,
    Course: Album,
    Online: HouseWifi,
  };

  const IconComponent = iconMap[locationType as LocationType] ?? HouseWifi;
  const label = locationType;

  return (
    <span className="inline-flex items-center gap-1 pr-2 font-sans">
      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      {label}
    </span>
  );
}

function formatRoomDisplay(room?: { room_name?: string; floor?: string }) {
  if (!room || !room.room_name) return "ไม่ระบุห้อง";
  return `ชั้น ${room.floor ?? "-"} ห้อง ${room.room_name}`;
}

export default function ActivityDetails({ activity }: Props) {
  const { rooms, fetchRooms } = useRoomStore();
  const room = rooms.find((r) => r.room_id === activity.room_id);

  useEffect(() => {
    if (rooms.length === 0) {
      fetchRooms();
    }
  }, [rooms.length, fetchRooms]);

  const formatDate = (dateInput?: string | Date | null) => {
    if (!dateInput) return "ไม่ระบุ";
    const date = new Date(dateInput);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-start lg:justify-between w-full gap-4 mt-4">
        {/* ✅ ก้อนซ้าย */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <p
            className="font-semibold text-[20px] lg:text-[22px] xl:text-[25px] font-sans truncate"
            style={{
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flexShrink: 1,
            }}
          >
            {activity.presenter_company_name}
          </p>

          <span
            className="px-2 py-1 rounded text-[14px] lg:text-[16px] xl:text-[18px] flex-shrink-0"
            style={{
              backgroundColor:
                activity.type === "Hard"
                  ? "rgba(255, 174, 0, 0.2)"
                  : "rgba(9, 0, 255, 0.2)",
              color: activity.type === "Hard" ? "#FFAE00" : "#0900FF",
              minWidth: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {activity.type}
          </span>
        </div>

        {/* ✅ ก้อนขวา */}
        <div className="flex items-center gap-1 font-[Sarabun] w-full lg:w-auto justify-start lg:justify-end text-xs sm:text-sm md:text-base">
          <LocationTypeDisplay locationType={activity.event_format} />

          {activity.event_format !== "Course" ? (
            <>
              <Hourglass className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              ปิดลงทะเบียน {formatDate(activity.end_register_date)}&nbsp;&nbsp;
            </>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                width: "220px",
              }}
            >
              {/* เว้นที่ว่าง */}
            </span>
          )}

          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          {activity.event_format === "Onsite"
            ? formatRoomDisplay(room)
            : "ไม่มีห้องสำหรับกิจกรรมนี้"}
        </div>
      </div>

      <p className="mt-8 text-xs sm:text-sm md:text-base font-sans break-words overflow-hidden">
        {activity.description}
      </p>
    </>
  );
}
