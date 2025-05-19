import { Typography } from "@mui/material";
import { CalendarDays, Hourglass, HouseWifi, MapPin, School } from "lucide-react";

interface Props {
  activity: any;
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
              sx={{ display: "inline-flex", alignItems: "center", gap: 1, mr: 2 }}
            >
              <HouseWifi /> {activity.location_type}
            </Typography>
          )}
          <CalendarDays size={25} /> วันที่จัดกิจกรรม{" "}
          {formatDate(activity.start_time)} <Hourglass size={25} />{" "}
          ปิดลงทะเบียน {formatDate(activity.end_register)} 
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
