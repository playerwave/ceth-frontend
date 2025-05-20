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
      <IconComponent />
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
          <LocationTypeDisplay locationType={activity.location_type} />
          <Hourglass size={25} /> ปิดลงทะเบียน{" "}
          {formatDate(activity.end_register)}&nbsp;&nbsp;
          <MapPin size={25} />
          {activity.location_type === "Onsite"
            ? formatRoom(activity.room)
            : "ไม่มีห้องสำหรับกิจกรรมนี้"}
        </div>
      </div>
      <p className="mt-2 text-[14px] font-sans">{activity.description}</p>
    </>
  );
}
