// import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import {
  Album,
  CalendarDays,
  Hourglass,
  HouseWifi,
  MapPin,
  School,
} from "lucide-react";
// import type { Activity } from "../../../../../types/model";
import { useRoomStore } from "../../../../../stores/Teacher/room.store";

interface Props {
  activity: {
    presenter_company_name: string;
    type: string;
    event_format: string;
    room_id?: number;
    start_register_date?: string;
    end_register_date?: string;
    start_activity_date?: string;
    end_activity_date?: string;
    description?: string;
    recieve_hours?: number;
  };
  isVisitor?: boolean; // ✅ เพิ่ม prop สำหรับ visitor mode
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

export default function ActivityDetails({ activity, isVisitor = false }: Props) {
  // ✅ ดึงข้อมูล rooms กับ fetchRooms จาก store (เฉพาะ non-visitor)
  const { rooms, fetchRooms } = useRoomStore();

  // ✅ โหลดข้อมูล rooms ถ้ายังไม่มี (เฉพาะ non-visitor)
  useEffect(() => {
    if (!isVisitor && rooms.length === 0) {
      fetchRooms();
    }
  }, [isVisitor, rooms.length, fetchRooms]);

  // ✅ หา room ที่ตรงกับ activity.room_id (เฉพาะ non-visitor)
  const room = !isVisitor ? rooms.find((r) => r.room_id === activity.room_id) : null;

  const formatDate = (dateInput?: string | Date | null) => {
    if (!dateInput) return "ไม่ระบุ";
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return "ไม่ระบุ";
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const month =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", dateInput);
      return "ไม่ระบุ";
    }
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-start lg:justify-between w-full gap-4 mt-4">
        {/* ✅ ก้อนซ้าย */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* ชื่อกิจกรรม (ย่อด้วย truncate) */}
          <p
            className="font-semibold text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[25px] font-sans truncate"
            style={{
              maxWidth: "100%", // mobile support
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flexShrink: 1,
            }}
          >
            {activity.presenter_company_name}
          </p>

          {/* ป้ายประเภท + ชั่วโมง */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="px-2 py-1 rounded text-sm sm:text-base"
              style={{
                backgroundColor: activity.type === "Soft" ? "#EDE7F6" : "rgba(255, 174, 0, 0.2)",
                color: activity.type === "Soft" ? "#5E35B1" : "#FFAE00",
                minWidth: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              {activity.type}
            </span>
            <div className="text-green-600 text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[25px] whitespace-nowrap">
              +{activity.recieve_hours} Hrs
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 font-[Sarabun] w-full lg:w-auto justify-start lg:justify-end text-xs sm:text-sm md:text-base">
          {/* ประเภทกิจกรรม */}
          <LocationTypeDisplay locationType={activity.event_format} />

          {/* วันที่เริ่มกิจกรรม */}
          {/* <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          {formatDate(activity.start_time)} */}

          {/* ปิดลงทะเบียน (เฉพาะกิจกรรมที่ไม่ใช่ Course) */}
          {activity.event_format !== "Course" ? (
            <>
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              {formatDate(activity.start_activity_date)}
              <Hourglass className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              ปิดลงทะเบียน {formatDate(activity.end_register_date)}&nbsp;&nbsp;
            </>
          ) : null}

          {/* สถานที่ */}
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          {activity.event_format === "Onsite"
            ? (activity.room_id ? formatRoomDisplay(room) : "ไม่ระบุห้อง")
            : "ไม่มีห้องสำหรับกิจกรรมนี้"}
        </div>
      </div>
      <p className="mt-2 text-xs sm:text-sm md:text-base font-sans break-words overflow-hidden">
        {activity.description}
      </p>
    </>
  );
}
