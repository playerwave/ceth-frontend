import { Typography } from "@mui/material";
<<<<<<< HEAD
import { CalendarDays, Hourglass, HouseWifi, MapPin, School } from "lucide-react";
=======
import {
  Album,
  CalendarDays,
  Hourglass,
  HouseWifi,
  MapPin,
  School,
} from "lucide-react";
>>>>>>> 479485fc736f097c34d732b1d3337cc61cb44b04

interface Props {
  activity: any;
}

<<<<<<< HEAD
export default function ActivityDetails({ activity }: Props) {
    const formatDate = (dateInput?: string | Date | null) => {
=======
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

export default function ActivityDetails({ activity }: Props) {
  const formatDate = (dateInput?: string | Date | null) => {
>>>>>>> 479485fc736f097c34d732b1d3337cc61cb44b04
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
<<<<<<< HEAD
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
              sx={{ display: "inline-flex", alignItems: "center", gap: 1, mr: 2 }}
            >
              <HouseWifi /> {activity.location_type}
            </Typography>
          )}
          <CalendarDays size={25} /> วันที่จัดกิจกรรม{" "}
          {formatDate(activity.start_time)} <Hourglass size={25} />{" "}
          ปิดลงทะเบียน {formatDate(activity.end_register)} 
          <MapPin size={25} />{" "}
=======
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
            {activity.company_lecturer}
          </p>

          {/* ป้ายประเภท + ชั่วโมง */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="px-2 py-1 rounded text-sm sm:text-base"
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
          <LocationTypeDisplay locationType={activity.location_type} />

          {/* วันที่เริ่มกิจกรรม */}
          {/* <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          {formatDate(activity.start_time)} */}

          {/* ปิดลงทะเบียน (เฉพาะกิจกรรมที่ไม่ใช่ Course) */}
          {activity.location_type !== "Course" ? (
            <>
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              {formatDate(activity.start_time)}
              <Hourglass className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              ปิดลงทะเบียน {formatDate(activity.end_register)}&nbsp;&nbsp;
            </>
          ) : null}

          {/* สถานที่ */}
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
>>>>>>> 479485fc736f097c34d732b1d3337cc61cb44b04
          {activity.location_type === "Onsite"
            ? `ห้อง ${activity.room}`
            : "ไม่มีห้องสำหรับกิจกรรมนี้"}
        </div>
      </div>
<<<<<<< HEAD
      <p className="mt-2 text-[14px] font-sans">{activity.description}</p>
=======
      <p className="mt-2 text-xs sm:text-sm md:text-base font-sans break-words overflow-hidden">
        {activity.description}
      </p>
>>>>>>> 479485fc736f097c34d732b1d3337cc61cb44b04
    </>
  );
}
