import {
  CalendarDays,
  Hourglass,
  MapPin,
  School,
  HouseWifi,
} from "lucide-react";
import Typography from "@mui/material/Typography";
import type { Activity } from "../../../../../types/Admin/type_activity_info_admin";

interface Props {
  activity: Activity;
}

export default function ActivityDetails({ activity }: Props) {
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
      <div className="flex items-center justify-between w-full mt-4">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[25px] font-sans">
            {activity.company_lecturer}
          </p>
          <span
            className="px-2 py-1 rounded ml-5"
            style={{
              backgroundColor:
                activity.type === "Hard Skill"
                  ? "rgba(255, 174, 0, 0.2)"
                  : "rgba(9, 0, 255, 0.2)",
              color: activity.type === "Hard Skill" ? "#FFAE00" : "#0900FF",
              minWidth: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {activity.type}
          </span>
        </div>
        <div className="flex items-center gap-1 font-[Sarabun]">
          {activity.location_type === "Onsite" ? (
            <Typography
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                pr: 4,
              }}
            >
              <School /> Onsite
            </Typography>
          ) : (
            <Typography
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mr: 2,
              }}
            >
              <HouseWifi /> {activity.location_type}
            </Typography>
          )}
          <CalendarDays size={25} /> วันที่จัดกิจกรรม{" "}
          {formatDate(activity.start_time)} <Hourglass size={25} /> ปิดลงทะเบียน{" "}
          {formatDate(activity.end_register)}
          <MapPin size={25} />{" "}
          {activity.location_type === "Onsite"
            ? `ห้อง ${activity.room}`
            : "ไม่มีห้องสำหรับกิจกรรมนี้"}
        </div>
      </div>
      <p className="mt-2 text-[14px] font-sans">{activity.description}</p>
    </>
  );
}

import { Hourglass, MapPin, School, HouseWifi, Album } from "lucide-react";
import type { Activity } from "../../../../../types/Admin/type_activity_info_admin";

interface Props {
  activity: Activity;
}

function LocationTypeDisplay({ locationType }: { locationType: string }) {
  const iconMap = {
    Onsite: School,
    Course: Album,
    Online: HouseWifi,
  };

  const IconComponent = iconMap[locationType] ?? HouseWifi;
  const label = locationType;

  return (
    <span className="inline-flex items-center gap-1 pr-2 font-sans">
      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      {label}
    </span>
  );
}

function formatRoom(roomCode: string) {
  if (!roomCode.startsWith("IF-")) return roomCode;
  const room = roomCode.slice(3);
  const match = room.match(/^(\d+)/);
  if (!match) return roomCode;
  const floor = match[1];
  return `ชั้น ${floor} ห้อง ${room}`;
}

export default function ActivityDetails({ activity }: Props) {
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
          {/* 👇 ตัดชื่อยาว ๆ แล้วใส่ ... */}
          <p
            className="font-semibold text-[20px] lg:text-[22px] xl:text-[25px] font-sans truncate"
            style={{
              maxWidth: "100%", // รองรับ mobile
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flexShrink: 1,
            }}
          >
            {activity.company_lecturer}
          </p>

          {/* 👇 ไม่ให้โดนดันหลุดขอบ และไม่ขยายตามชื่อ */}
          <span
            className="px-2 py-1 rounded text-[14px] lg:text-[16px] xl:text-[18px] flex-shrink-0"
            style={{
              backgroundColor:
                activity.type === "Hard Skill"
                  ? "rgba(255, 174, 0, 0.2)"
                  : "rgba(9, 0, 255, 0.2)",
              color: activity.type === "Hard Skill" ? "#FFAE00" : "#0900FF",
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
          <LocationTypeDisplay locationType={activity.location_type} />

          {activity.location_type !== "Course" ? (
            <>
              <Hourglass className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              ปิดลงทะเบียน {formatDate(activity.end_register)}&nbsp;&nbsp;
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
          {activity.location_type === "Onsite"
            ? formatRoom(activity.room)
            : "ไม่มีห้องสำหรับกิจกรรมนี้"}
        </div>
      </div>

      <p className="mt-2 text-xs sm:text-sm md:text-base font-sans break-words overflow-hidden">
        {activity.description}
      </p>
    </>
  );
}
